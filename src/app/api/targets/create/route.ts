import { createClient } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const supabase = createClient();
    const { title, type, target_value, deadline } = await req.json();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
        .from("academic_targets")
        .insert({
            user_id: user.id,
            title,
            type,
            target_value: parseFloat(target_value),
            deadline: deadline || null
        })
        .select()
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
}
