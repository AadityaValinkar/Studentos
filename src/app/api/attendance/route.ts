import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
    try {
        const supabaseAuth = createClient();
        const { data: { session } } = await supabaseAuth.auth.getSession();

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { totalClasses, attendedClasses } = await req.json();

        // First, get the user's ID to ensure they exist and for potential future use
        const { error: userFetchError } = await supabase
            .from('users')
            .select('id')
            .eq('email', session.user.email)
            .single();

        if (userFetchError) {
            return NextResponse.json({ error: "User not found or database error" }, { status: 404 });
        }

        const { data: user, error } = await supabase
            .from('users')
            .update({
                attendance: {
                    totalClasses,
                    attendedClasses,
                    targetPercentage: 75 // Maintain the default target or fetch existing if preferred
                }
            })
            .eq('email', session.user.email)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ success: true, user });
    } catch {
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}
