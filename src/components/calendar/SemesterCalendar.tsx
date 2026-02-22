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

export function SemesterCalendar() {
    const [view, setView] = useState<'month' | 'timeline'>('month');
    const [currentDate, setCurrentDate] = useState(new Date(2025, 10, 1)); // Default to November 2025 (Month 10 is Nov)
    const [selectedDay, setSelectedDay] = useState<CalendarDayInfo | null>(null);

    // State for Dynamic Events
    interface UserEventData {
        _id: string;
        title: string;
        startDate: string;
        endDate: string;
        priority: string;
        isPinned: boolean;
        description?: string;
    }
    const [userEvents, setUserEvents] = useState<UserEventData[]>([]);
    const [overrides, setOverrides] = useState<{ hidden: boolean, academicEventId: string }[]>([]);

    const fetchUserData = async () => {
        try {
            // Optional optimization: passing first and last days of the view. Using the month +/- 1 logic or just fetching all for now.
            const queryParams = '?start=' + format(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1), 'yyyy-MM-dd') +
                '&end=' + format(new Date(currentDate.getFullYear(), currentDate.getMonth() + 2, 0), 'yyyy-MM-dd');

            const [eventsRes, overridesRes] = await Promise.all([
                fetch('/api/user-events' + queryParams, { cache: 'no-store' }).then(r => r.json()),
                fetch('/api/event-overrides', { cache: 'no-store' }).then(r => r.json())
            ]);

            if (eventsRes.events) setUserEvents(eventsRes.events);
            if (overridesRes.overrides) setOverrides(overridesRes.overrides);
        } catch (err) {
            console.error("Failed to fetch user calendar data", err);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, [currentDate]); // Re-fetch when month changes

    const days = useMemo(() => {
        // 1. Filter out hidden system events using overrides
        const hiddenEventIds = new Set(overrides.filter(o => o.hidden).map(o => o.academicEventId));
        const activeSystemEvents = semesterEvents.filter(e => !hiddenEventIds.has(e.id));

        // 2. Map UserEvents to AcademicEvent format for the calendar grid
        const mappedUserEvents: AcademicEvent[] = userEvents.map(ue => ({
            id: ue._id,
            title: ue.title,
            start: format(new Date(ue.startDate), "yyyy-MM-dd"),
            end: format(new Date(ue.endDate), "yyyy-MM-dd"),
            type: (ue.priority === "CRITICAL" ? "GATE" : "EVENT") as AcademicEvent['type'], // Re-using existing styles temporarily
            description: ue.description,
            isUserEvent: true
        }));

        const mergedEvents = [...activeSystemEvents, ...mappedUserEvents];
        return generateMonthGrid(currentDate.getFullYear(), currentDate.getMonth(), mergedEvents);
    }, [currentDate, userEvents, overrides]);

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
        try {
            const res = await fetch('/api/user-events', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...data,
                    startDate: selectedDay?.dateString, // use string instead of Date object
                    endDate: selectedDay?.dateString
                })
            });
            if (res.ok) {
                await fetchUserData(); // Refresh local event state immediately
                setSelectedDay(null); // Close panel
            }
        } catch (error) {
            console.error(error);
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
                await fetchUserData(); // Re-fetch logic triggered upon success
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="glass-panel p-8 md:p-12 w-full max-w-6xl mx-auto shadow-2xl relative overflow-hidden group">
            {/* Ambient Background Glow inside the calendar */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

            {/* Header Settings */}
            <div className="flex justify-between items-center mb-8 pb-8 border-b border-white/5 relative z-10">
                <div>
                    <h1 className="text-3xl font-light text-white tracking-wide mb-2">Academic Calendar</h1>
                    <p className="text-slate-400 font-light text-sm tracking-wide">Even Term 2025-26 Overview</p>
                </div>

                <div className="flex items-center gap-2 bg-white/5 p-1 rounded-full border border-white/10">
                    <button
                        onClick={() => setView('month')}
                        className={`p-2 rounded-full transition-colors flex items-center justify-center ${view === 'month' ? 'bg-indigo-500/20 text-indigo-300' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                        title="Month View"
                    >
                        <LayoutGrid className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setView('timeline')}
                        className={`p-2 rounded-full transition-colors flex items-center justify-center ${view === 'timeline' ? 'bg-indigo-500/20 text-indigo-300' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                        title="Timeline View"
                    >
                        <ListTree className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Calendar Views */}
            <div className="relative z-10">
                {view === 'month' ? (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <MonthNavigator
                            currentDate={currentDate}
                            onPrevMonth={handlePrevMonth}
                            onNextMonth={handleNextMonth}
                            onToday={handleToday}
                        />
                        <MonthGrid days={days} onDayClick={setSelectedDay} />
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
                        onHideSystemEvent={handleHideSystemEvent}
                    />
                )}
            </GlassSidePanel>
        </div>
    );
}
