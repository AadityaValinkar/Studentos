import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { supabase } from "@/lib/supabase";

// ... existing GET and POST ...

// GET all custom events for the logged in user (optional range query)
export async function GET(req: NextRequest) {
    try {
        const supabaseAuth = createClient();
        const { data: { session } } = await supabaseAuth.auth.getSession();
        if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const searchParams = req.nextUrl.searchParams;
        const start = searchParams.get('start');
        const end = searchParams.get('end');

        // Get User UUID
        const { data: user, error: userError } = await supabase.from('users').select('id').eq('email', session.user.email).single();
        if (userError || !user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        // Select User Events
        let query = supabase.from('user_events').select('*').eq('user_id', user.id).order('start_date', { ascending: true });

        if (start) query = query.gte('end_date', start);
        if (end) query = query.lte('start_date', end);

        const { data: events, error: eventsError } = await query;
        if (eventsError) throw eventsError;

        // Map Postgres schema to match existing frontend expectations temporarily
        const mappedEvents = events.map((e: Record<string, unknown>) => ({
            _id: e.id,
            title: e.title,
            startDate: e.start_date,
            endDate: e.end_date,
            type: e.type,
            priority: e.priority,
            isPinned: e.is_pinned,
            description: e.description,
            color: e.color
        }));

        return NextResponse.json({ events: mappedEvents });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const supabaseAuth = createClient();
        const { data: { session } } = await supabaseAuth.auth.getSession();
        if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        const body = await req.json();
        if (!body.title || !body.startDate || !body.endDate) return NextResponse.json({ error: "Missing required fields" }, { status: 400 });

        const { data: user, error: userError } = await supabase.from('users').select('id').eq('email', session.user.email).single();
        if (userError || !user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        const { data: newEvent, error: insertError } = await supabase.from('user_events').insert([{
            user_id: user.id,
            title: body.title,
            start_date: body.startDate,
            end_date: body.endDate,
            type: body.type || "CUSTOM",
            priority: body.priority || "LOW",
            is_pinned: body.isPinned || false,
            description: body.description,
            color: body.color
        }]).select().single();

        if (insertError) throw insertError;

        return NextResponse.json({ event: { ...newEvent, _id: newEvent.id } }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// PATCH update existing event
export async function PATCH(req: NextRequest) {
    try {
        const supabaseAuth = createClient();
        const { data: { session } } = await supabaseAuth.auth.getSession();
        if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await req.json();
        if (!body.eventId) return NextResponse.json({ error: "Missing eventId" }, { status: 400 });

        const { data: user, error: userError } = await supabase.from('users').select('id').eq('email', session.user.email).single();
        if (userError || !user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        // Map payload fields back to postgres snake_case
        const updatePayload: Record<string, unknown> = {};
        if (body.title !== undefined) updatePayload.title = body.title;
        if (body.startDate !== undefined) updatePayload.start_date = body.startDate;
        if (body.endDate !== undefined) updatePayload.end_date = body.endDate;
        if (body.type !== undefined) updatePayload.type = body.type;
        if (body.priority !== undefined) updatePayload.priority = body.priority;
        if (body.isPinned !== undefined) updatePayload.is_pinned = body.isPinned;
        if (body.description !== undefined) updatePayload.description = body.description;
        if (body.color !== undefined) updatePayload.color = body.color;

        const { data: updatedEvent, error: updateError } = await supabase
            .from('user_events')
            .update(updatePayload)
            .eq('id', body.eventId)
            .eq('user_id', user.id)
            .select()
            .single();

        if (updateError) return NextResponse.json({ error: "Event not found or failed update" }, { status: 404 });
        return NextResponse.json({ event: updatedEvent });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// DELETE an event
export async function DELETE(req: NextRequest) {
    try {
        const supabaseAuth = createClient();
        const { data: { session } } = await supabaseAuth.auth.getSession();
        if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const eventId = req.nextUrl.searchParams.get('eventId');
        if (!eventId) return NextResponse.json({ error: "Missing eventId" }, { status: 400 });

        const { data: user, error: userError } = await supabase.from('users').select('id').eq('email', session.user.email).single();
        if (userError || !user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        const { error: deleteError } = await supabase
            .from('user_events')
            .delete()
            .eq('id', eventId)
            .eq('user_id', user.id);

        if (deleteError) return NextResponse.json({ error: "Event not found or deletion failed" }, { status: 404 });

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
