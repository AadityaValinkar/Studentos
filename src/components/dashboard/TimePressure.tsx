"use client";

import { Clock, Target, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { format, differenceInCalendarDays } from 'date-fns';

export function TimePressure() {
    // Static Semester Data (Could later be pulled from Admin Settings)
    const semesterEnd = new Date(2026, 3, 25); // April 25, 2026
    const today = new Date();
    const daysLeft = differenceInCalendarDays(semesterEnd, today);

    interface PinnedEventData {
        title: string;
        startDate: string;
        priority: string;
        isPinned: boolean;
    }

    const [pinnedEvent, setPinnedEvent] = useState<PinnedEventData | null>(null);

    useEffect(() => {
        const fetchPinnedEvents = async () => {
            try {
                const res = await fetch('/api/user-events');
                const data = await res.json();

                if (data.events) {
                    // Find upcoming pinned or critical events
                    const upcoming = data.events.filter((e: PinnedEventData) => {
                        const eventDate = new Date(e.startDate);
                        return eventDate >= today && (e.isPinned || e.priority === 'CRITICAL');
                    }).sort((a: PinnedEventData, b: PinnedEventData) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

                    if (upcoming.length > 0) {
                        setPinnedEvent(upcoming[0]);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch pinned events", err);
            }
        };

        fetchPinnedEvents();
    }, []);

    return (
        <div className="flex flex-col md:flex-row gap-6">
            <div className="glass-card p-8 relative overflow-hidden group flex-1">
                {/* Subtle glass sheen overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-black/5 dark:from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div className="flex items-start justify-between relative z-10">
                    <div className="space-y-2">
                        <h2 className="text-xl font-light flex items-center gap-2 text-slate-900 dark:text-white/90 tracking-wide">
                            <Clock className="w-4 h-4 text-indigo-500 dark:text-indigo-400" strokeWidth={1.5} />
                            Time Pressure Engine
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400/80 font-light text-sm tracking-wide">Semester V Analytics & Countdown</p>
                    </div>

                    <div className="text-right flex flex-col items-end justify-center">
                        <div className="text-5xl font-light text-orange-600 dark:text-orange-200/90 tracking-tighter mb-2 drop-shadow-sm dark:drop-shadow-[0_0_15px_rgba(254,215,170,0.15)]">
                            {daysLeft} <span className="text-2xl text-orange-500 dark:text-orange-200/50 font-extralight">Days</span>
                        </div>
                        <div className="text-xs font-light text-slate-500 uppercase tracking-[0.2em]">
                            Remaining
                        </div>
                    </div>
                </div>
            </div>

            {pinnedEvent && (
                <div className="glass-card p-8 relative overflow-hidden group flex-1 border-indigo-500/20 bg-indigo-500/5">
                    <div className="flex items-start justify-between relative z-10">
                        <div className="space-y-2">
                            <h2 className="text-xl font-medium flex items-center gap-2 text-indigo-400 tracking-wide">
                                {pinnedEvent.priority === 'CRITICAL' ? <AlertCircle className="w-4 h-4 text-red-400" /> : <Target className="w-4 h-4" />}
                                Focus: {pinnedEvent.title}
                            </h2>
                            <p className="text-slate-400 font-light text-sm tracking-wide">
                                {format(new Date(pinnedEvent.startDate), "MMMM do, yyyy")}
                            </p>
                        </div>

                        <div className="text-right flex flex-col items-end justify-center">
                            <div className="text-5xl font-light text-white tracking-tighter mb-2">
                                {differenceInCalendarDays(new Date(pinnedEvent.startDate), new Date())} <span className="text-2xl text-slate-500 font-extralight">Days</span>
                            </div>
                            <div className="text-xs font-light text-indigo-500/70 uppercase tracking-[0.2em] font-medium">
                                To Goal
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
