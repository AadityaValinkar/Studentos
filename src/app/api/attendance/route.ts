import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
    try {
        const supabaseAuth = createClient();
        const { data: { user }, error: authError } = await supabaseAuth.auth.getUser();

        if (authError || !user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { totalClasses, attendedClasses } = await req.json();

        const { error: userFetchError } = await supabase
            .from('users')
            .select('id')
            .eq('email', user.email)
            .single();

        if (userFetchError) {
            return NextResponse.json({ error: "User not found or database error" }, { status: 404 });
        }

        const { data: userUpdate, error } = await supabase
            .from('users')
            .update({
                attendance: {
                    totalClasses,
                    attendedClasses,
                    targetPercentage: 75
                }
            })
            .eq('email', user.email)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ success: true, user: userUpdate });
    } catch {
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}
