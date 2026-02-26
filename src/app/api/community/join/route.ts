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
        const { communityId } = body;

        if (!communityId) {
            return NextResponse.json({ error: "Community ID is required" }, { status: 400 });
        }

        // 2. Insert Membership
        const { data, error } = await supabase
            .from("community_members")
            .insert({
                community_id: communityId,
                user_id: user.id
            })
            .select()
            .single();

        if (error) {
            if (error.code === "23505") { // Unique violation
                return NextResponse.json({ success: true, message: "Already joined" });
            }
            console.error("Join API Error:", error.message);
            return NextResponse.json({ error: "Failed to join community" }, { status: 500 });
        }

        return NextResponse.json({ success: true, membership: data });

    } catch (err: unknown) {
        console.error("Join API Exception:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
