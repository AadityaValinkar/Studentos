import { SemesterCalendar } from "@/components/calendar/SemesterCalendar";
import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

export default async function CalendarPage() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Fetch User Events server-side
    const { data: userEvents } = await supabase
        .from('user_events')
        .select('*')
        .eq('user_id', user.id);

    return (
        <div className="p-6 md:p-8 pb-32 max-w-[1400px] mx-auto min-h-screen flex items-center justify-center animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <SemesterCalendar initialUserEvents={userEvents || []} />
        </div>
    );
}
