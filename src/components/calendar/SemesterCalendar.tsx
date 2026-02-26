"use client";

import { useState, useMemo, useEffect } from "react";
import { semesterEvents, AcademicEvent } from "@/lib/event-mapper";
import { generateMonthGrid, CalendarDayInfo } from "@/lib/calendar-utils";
import { MonthNavigator } from "./MonthNavigator";
import { MonthGrid } from "./MonthGrid";
import { TimelineView } from "./TimelineView";
import { LayoutGrid, ListTree } from "lucide-react";
import { GlassSidePanel } from "../ui/GlassSidePanel";
import { format } from "date-fns";
import { DateEditor } from "./DateEditor";
import { supabaseClient } from "@/lib/supabase-client";
import { useSession } from "@/lib/useSession";
import { useRouter } from "next/navigation";

interface SemesterCalendarProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    initialUserEvents: any[];
}

import { AgendaView } from "./AgendaView";

export function SemesterCalendar({ initialUserEvents }: SemesterCalendarProps) {
    const { data: session } = useSession();
    const router = useRouter();
    const [view, setView] = useState<'month' | 'timeline'>('month');
    const [, setIsMobile] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDay, setSelectedDay] = useState<CalendarDayInfo | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [localUserEvents, setLocalUserEvents] = useState<any[]>(initialUserEvents);

    const [overrides] = useState<{ hidden: boolean, academicEventId: string }[]>([]);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const normalizeDate = (dateVal: any) => {
        if (!dateVal) return "";
        if (typeof dateVal === 'string') return dateVal.split('T')[0];
        if (dateVal instanceof Date) {
            const y = dateVal.getFullYear();
            const m = String(dateVal.getMonth() + 1).padStart(2, '0');
            const d = String(dateVal.getDate()).padStart(2, '0');
            return `${y}-${m}-${d}`;
        }
        return String(dateVal).split('T')[0];
    };

    const days = useMemo(() => {
        // 1. Filter out hidden system events using overrides
        const hiddenEventIds = new Set(overrides.filter(o => o.hidden).map(o => o.academicEventId));
        const activeSystemEvents = semesterEvents.filter(e => !hiddenEventIds.has(e.id));

        // 2. Map UserEvents to AcademicEvent format for the calendar grid
        const mappedUserEvents: AcademicEvent[] = localUserEvents.map(ue => ({
            id: ue.id,
            title: ue.title,
            start: normalizeDate(ue.start_date),
            end: normalizeDate(ue.start_date), // Only using start_date for single-day events as per new schema
            type: (ue.priority === "CRITICAL" ? "GATE" : "EVENT") as AcademicEvent['type'],
            description: ue.description,
            isUserEvent: true
        }));

        const mergedEvents = [...activeSystemEvents, ...mappedUserEvents];
        return generateMonthGrid(currentDate.getFullYear(), currentDate.getMonth(), mergedEvents);
    }, [currentDate, localUserEvents, overrides]);

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const handleToday = () => {
        setCurrentDate(new Date());
    };

    const handleAddEvent = async (data: { title: string }) => {
        if (!session?.user?.id || !selectedDay) return;

        const optimisticEvent = {
            id: "temp-" + Date.now(),
            user_id: session.user.id,
            title: data.title,
            start_date: selectedDay.dateString,
            priority: "EVENT",
        };

        // Optimistic update
        setLocalUserEvents(prev => [...prev, optimisticEvent]);
        setSelectedDay(null); // Close panel instantly

        try {
            const { data: serverEvent, error } = await supabaseClient
                .from('user_events')
                .insert({
                    user_id: session.user.id,
                    title: data.title,
                    start_date: selectedDay.dateString,
                })
                .select()
                .single();

            if (error) throw error;

            console.log("Event added successfully");
            // Replace optimistic event with real event from server
            setLocalUserEvents(prev => prev.map(e => e.id === optimisticEvent.id ? serverEvent : e));

            // Do not use router.refresh() here to prevent full page flicker
        } catch (error) {
            console.error("Failed to add event:", error);
            // Rollback optimistic update
            setLocalUserEvents(prev => prev.filter(e => e.id !== optimisticEvent.id));
        }
    };

    const handleDeleteEvent = async (eventId: string) => {
        if (!session?.user?.id) return;

        // Optimistic delete
        const previousEvents = [...localUserEvents];
        setLocalUserEvents(prev => prev.filter(e => e.id !== eventId));
        setSelectedDay(null); // Close panel instantly

        try {
            const { error } = await supabaseClient
                .from('user_events')
                .delete()
                .eq('id', eventId)
                .eq('user_id', session.user.id);

            if (error) throw error;
            console.log("Event deleted successfully");
        } catch (error) {
            console.error(error);
            // Rollback optimistic delete
            setLocalUserEvents(previousEvents);
        }
    };

    const handleHideSystemEvent = async (eventId: string) => {
        try {
            const res = await fetch('/api/event-overrides', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ academicEventId: eventId, hidden: true })
            });
            if (res.ok) {
                router.refresh();
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="glass-panel p-4 md:p-12 w-full max-w-6xl mx-auto shadow-2xl relative overflow-hidden group">
            {/* Ambient Background Glow inside the calendar (Dark Only) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-accent-primary/5 rounded-full blur-[100px] pointer-events-none hidden dark:block" />

            {/* Header Settings */}
            <div className="flex justify-between items-center mb-6 md:mb-8 pb-6 md:pb-8 border-b border-border-muted relative z-10">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-text-main tracking-tight mb-2">Academic Calendar</h1>
                    <p className="text-[10px] text-text-muted font-bold uppercase tracking-[0.2em] opacity-60">Even Term 2025-26 Overview</p>
                </div>

                <div className="hidden md:flex items-center gap-2 bg-bg-main p-1 rounded-full border border-border-muted shadow-sm">
                    <button
                        onClick={() => setView('month')}
                        className={`p-2 rounded-full transition-all flex items-center justify-center ${view === 'month' ? 'bg-text-main text-bg-card shadow-lg' : 'text-text-muted hover:text-text-main hover:bg-bg-card'}`}
                        title="Month View"
                    >
                        <LayoutGrid className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setView('timeline')}
                        className={`p-2 rounded-full transition-all flex items-center justify-center ${view === 'timeline' ? 'bg-text-main text-bg-card shadow-lg' : 'text-text-muted hover:text-text-main hover:bg-bg-card'}`}
                        title="Timeline View"
                    >
                        <ListTree className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Calendar Views */}
            <div className="relative z-10 min-h-[400px]">
                {view === 'month' ? (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <MonthNavigator
                            currentDate={currentDate}
                            onPrevMonth={handlePrevMonth}
                            onNextMonth={handleNextMonth}
                            onToday={handleToday}
                        />

                        {/* Mobile Agenda View */}
                        <div className="md:hidden">
                            <AgendaView days={days} onEventClick={setSelectedDay} />
                        </div>

                        {/* Desktop Grid View */}
                        <div className="hidden md:block">
                            <MonthGrid days={days} onDayClick={setSelectedDay} />
                        </div>
                    </div>
                ) : (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <TimelineView events={semesterEvents} />
                    </div>
                )}
            </div>

            {/* Glass Side Panel Editor */}
            <GlassSidePanel
                isOpen={!!selectedDay}
                onClose={() => setSelectedDay(null)}
                title={selectedDay ? format(selectedDay.date, "EEEE, MMMM do, yyyy") : "Date Options"}
            >
                {selectedDay && (
                    <DateEditor
                        day={selectedDay}
                        onAddEvent={handleAddEvent}
                        onDeleteEvent={handleDeleteEvent}
                        onHideSystemEvent={handleHideSystemEvent}
                    />
                )}
            </GlassSidePanel>
        </div>
    );
}
