import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { supabase } from "@/lib/supabase";

// GET all overrides for the logged in user
export async function GET() {
    try {
        const session = await getServerSession();
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { data: user, error: userError } = await supabase.from('users').select('id').eq('email', session.user.email).single();
        if (userError || !user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        const { data: overrides, error: overridesError } = await supabase
            .from('event_overrides')
            .select('*')
            .eq('user_id', user.id);

        if (overridesError) throw overridesError;

        // Map Postgres schema to match existing frontend expectations temporarily
        const mappedOverrides = overrides.map((o: Record<string, unknown>) => ({
            _id: o.id,
            academicEventId: o.academic_event_id,
            hidden: o.hidden,
            replacedWith: o.replaced_with
        }));

        return NextResponse.json({ overrides: mappedOverrides });

    } catch (error) {
        console.error("Failed to fetch user event overrides:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// PATCH an override (hide or replace a system event)
export async function PATCH(req: NextRequest) {
    try {
        const session = await getServerSession();
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();

        if (!body.academicEventId) {
            return NextResponse.json({ error: "Missing academicEventId" }, { status: 400 });
        }

        const { data: user, error: userError } = await supabase.from('users').select('id').eq('email', session.user.email).single();
        if (userError || !user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        const upsertPayload: Record<string, unknown> = {
            user_id: user.id,
            academic_event_id: body.academicEventId,
            hidden: body.hidden ?? false,
        };
        if (body.replacedWith) upsertPayload.replaced_with = new Date(body.replacedWith);

        const { data: override, error: upsertError } = await supabase
            .from('event_overrides')
            .upsert(upsertPayload, { onConflict: 'user_id,academic_event_id' })
            .select()
            .single();

        if (upsertError) throw upsertError;

        return NextResponse.json({ override }, { status: 200 });

    } catch (error) {
        console.error("Failed to update user event override:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
