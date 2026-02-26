"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Target, Calendar as CalendarIcon, ExternalLink, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabaseClient } from "@/lib/supabase-client";
import Link from "next/link";

interface UpcomingEventsWidgetProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    initialEvents: any[];
    userId: string;
}

export function UpcomingEventsWidget({ initialEvents, userId }: UpcomingEventsWidgetProps) {
    const [events, setEvents] = useState(initialEvents);
    const [now, setNow] = useState(new Date());

    // 1. Auto-update "now" every minute to keep countdowns accurate
    useEffect(() => {
        const interval = setInterval(() => {
            setNow(new Date());
        }, 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    // 2. Refresh logic for realtime
    const refreshEvents = async () => {
        const todayStr = new Date().toISOString().split('T')[0];
        const { data } = await supabaseClient
            .from("user_events")
            .select("*")
            .eq("user_id", userId)
            .gte("start_date", todayStr)
            .order("start_date", { ascending: true })
            .limit(3);

        if (data) setEvents(data);
    };

    // 3. Supabase Realtime Subscription
    useEffect(() => {
        const channel = supabaseClient
            .channel(`dashboard-events-${userId}`)
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "user_events",
                    filter: `user_id=eq.${userId}`
                },
                () => {
                    refreshEvents();
                }
            )
            .subscribe();

        return () => {
            supabaseClient.removeChannel(channel);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId]);

    // 4. Midnight-Safe Countdown Calculation
    const calculateDaysLeft = (startDate: string) => {
        const today = new Date(now);
        const eventDate = new Date(startDate);

        // Zero out time for clean date diff
        today.setHours(0, 0, 0, 0);
        eventDate.setHours(0, 0, 0, 0);

        const diff = eventDate.getTime() - today.getTime();
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
    };

    if (events.length === 0) {
        return (
            <section className="space-y-6 animate-in fade-in duration-700">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <Target className="w-6 h-6 text-accent-primary" strokeWidth={2.5} />
                        <h2 className="text-2xl font-bold text-text-primary tracking-tight">Coming Up</h2>
                    </div>
                </div>

                <div className="glass-panel p-16 flex flex-col items-center justify-center text-center space-y-6 border-dashed border-border-muted bg-bg-card/30 relative overflow-hidden">
                    {/* Background Glow (Dark Only) */}
                    <div className="absolute inset-0 bg-accent-primary/2 hidden dark:block" />

                    <div className="w-16 h-16 rounded-[2.5rem] bg-bg-base border border-border-muted flex items-center justify-center text-text-muted shadow-inner relative z-10">
                        <Plus className="w-8 h-8 opacity-20" strokeWidth={1.5} />
                    </div>
                    <div className="space-y-1 relative z-10">
                        <h3 className="text-text-primary text-lg font-bold tracking-tight">All clear! 🎉</h3>
                        <p className="text-sm text-text-muted font-medium opacity-60">No upcoming deadlines or events.</p>
                    </div>
                    <Link
                        href="/calendar"
                        className="px-8 py-4 bg-accent-primary hover:bg-accent-primary/90 text-white text-[11px] font-bold rounded-2xl transition-all shadow-xl shadow-accent-primary/20 uppercase tracking-widest active:scale-95 relative z-10"
                    >
                        Add Event
                    </Link>
                </div>
            </section>
        );
    }

    return (
        <section className="space-y-4 animate-in fade-in duration-700">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3 opacity-60">
                    <h2 className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Priority Deadlines</h2>
                </div>
                <Link href="/calendar" className="text-[10px] font-bold text-text-muted lg:hover:text-accent-primary uppercase tracking-[0.2em] transition-all opacity-40 lg:hover:opacity-100 flex items-center gap-2">
                    View full calendar <ExternalLink className="w-3.5 h-3.5" />
                </Link>
            </div>

            <div className="grid grid-cols-1 gap-3">
                {events.map((event) => {
                    const daysLeft = calculateDaysLeft(event.start_date);
                    const eventDate = new Date(event.start_date);

                    return (
                        <div
                            key={event.id}
                            className="glass-panel p-6 flex items-center justify-between group lg:hover:border-accent-primary/30 transition-all duration-500 relative overflow-hidden active:scale-[0.98] md:active:scale-100"
                        >
                            {/* Background Glow (Dark Only) */}
                            <div className="absolute top-0 right-0 w-24 h-24 bg-accent-primary/5 rounded-full blur-2xl pointer-events-none hidden dark:block" />
                            {/* Left: Date Badge */}
                            <div className="flex items-center gap-5 relative z-10">
                                <div className="flex flex-col items-center justify-center w-16 h-16 rounded-[2rem] bg-bg-base border border-border-muted lg:group-hover:border-accent-primary/30 transition-colors dark:backdrop-blur-md shadow-sm">
                                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-[0.1em] opacity-60">
                                        {format(eventDate, "MMM")}
                                    </span>
                                    <span className="text-2xl font-black text-text-primary leading-none font-accent">
                                        {format(eventDate, "dd")}
                                    </span>
                                </div>

                                {/* Center: Info */}
                                <div className="space-y-1.5">
                                    <div className="flex items-center gap-2.5">
                                        {event.type === 'EXAM' && <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />}
                                        <h3 className="text-lg font-bold text-text-primary tracking-tight lg:group-hover:text-accent-primary transition-colors">
                                            {event.title}
                                        </h3>
                                    </div>
                                    <p className="text-[10px] text-text-muted uppercase tracking-[0.2em] font-bold flex items-center gap-2 opacity-50">
                                        <CalendarIcon className="w-3.5 h-3.5" />
                                        {format(eventDate, "EEEE")} &bull; {event.type || 'Personal'}
                                    </p>
                                </div>
                            </div>

                            {/* Right: Countdown */}
                            <div className="text-right relative z-10">
                                <div className={cn(
                                    "text-xs font-bold uppercase tracking-widest",
                                    daysLeft <= 3 ? "text-red-500" :
                                        daysLeft <= 7 ? "text-amber-500" :
                                            "text-text-muted opacity-60"
                                )}>
                                    {daysLeft <= 0 ? (
                                        <span className="bg-red-500/10 text-red-500 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">Today</span>
                                    ) : (
                                        <div className="flex flex-col items-end">
                                            <span className="text-xl font-black font-accent text-text-primary">{daysLeft}</span>
                                            <span className="text-[9px]">Days Left</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
