import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
    try {
        const session = await getServerSession();
        if (!session || !session.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { totalClasses, attendedClasses } = await req.json();

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
