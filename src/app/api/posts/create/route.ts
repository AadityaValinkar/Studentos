import { createClient } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const supabase = createClient();

        // 1. Authenticate User
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { communityId, content, mediaPath, mediaType } = body;

        if (!communityId) {
            return NextResponse.json({ error: "Missing community ID" }, { status: 400 });
        }

        if (!content?.trim() && !mediaPath) {
            return NextResponse.json({ error: "Post must have either content or media" }, { status: 400 });
        }

        // RLS already handles the validation that the user is a member, but we can also explicitly catch it
        // The policy "Users can post only if member" on posts for insert will fail if they aren't.

        // 2. Insert Post
        const { data, error } = await supabase
            .from("posts")
            .insert({
                community_id: communityId,
                author_id: user.id,
                content: content,
                media_path: mediaPath,
                media_type: mediaType
            })
            .select(`
                *,
                author:profiles(id, global_username, avatar_url)
            `)
            .single();

        if (error) {
            console.error("Create Post API Error:", error.message);
            return NextResponse.json({ error: "Failed to create post. Are you a member?" }, { status: 403 });
        }

        return NextResponse.json({ success: true, post: data });

    } catch (err: unknown) {
        console.error("Create Post API Exception:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
