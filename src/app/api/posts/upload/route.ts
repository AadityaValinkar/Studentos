import { createClient } from "@/lib/supabase-server";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

const ALLOWED_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
];

const MAX_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(req: Request) {
    try {
        const supabase = createClient();

        // 1. Authenticate User
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get("file") as File;
        const communityId = formData.get("communityId") as string;
        const communitySlug = formData.get("communitySlug") as string;

        if (!file || !communityId || !communitySlug) {
            return NextResponse.json({ error: "Missing file or community data" }, { status: 400 });
        }

        // 2. Validate Membership
        const { data: membership, error: memberError } = await supabase
            .from("community_members")
            .select("id")
            .eq("community_id", communityId)
            .eq("user_id", user.id)
            .single();

        if (memberError || !membership) {
            return NextResponse.json({ error: "You must be a member to upload media" }, { status: 403 });
        }

        // 3. Validate File
        if (file.size > MAX_SIZE) {
            return NextResponse.json({ error: "File too large (Max 10MB)" }, { status: 400 });
        }

        if (!ALLOWED_TYPES.includes(file.type)) {
            return NextResponse.json({ error: "Invalid file type. Only images, PDFs, and Docs allowed." }, { status: 400 });
        }

        // 4. Upload to Storage
        // Path format: community-media/{community_slug}/{temp_id}/{filename}
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}-${uuidv4()}.${fileExt}`;
        const filePath = `${communitySlug}/${fileName}`; // simplified for now since post_id isn't known yet, or we can use a temp folder

        const { error: uploadError } = await supabase.storage
            .from("community-media")
            .upload(filePath, file, {
                contentType: file.type,
                cacheControl: "3600",
                upsert: false
            });

        if (uploadError) {
            console.error("Storage Upload Error:", uploadError);
            return NextResponse.json({ error: "Failed to upload to storage" }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            path: filePath,
            type: file.type
        });

    } catch (err: unknown) {
        console.error("Upload API Exception:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
