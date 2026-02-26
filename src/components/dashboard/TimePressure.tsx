"use client";

import { Clock, Target } from 'lucide-react';
import { useState, useEffect } from 'react';
import { format, differenceInCalendarDays } from 'date-fns';
import { supabaseClient } from '@/lib/supabase-client';

export function TimePressure() {
    // Static Semester Data (Could later be pulled from Admin Settings)
    const semesterEnd = new Date(2026, 3, 25); // April 25, 2026
    const today = new Date();
    const daysLeft = differenceInCalendarDays(semesterEnd, today);

    interface PinnedEventData {
        title: string;
        start_date: string;
        description?: string;
    }

    const [pinnedEvent, setPinnedEvent] = useState<PinnedEventData | null>(null);

    useEffect(() => {
        const fetchPinnedEvents = async () => {
            try {
                const { data: { user } } = await supabaseClient.auth.getUser();
                if (!user) return;

                // Format today to match start_date schema (YYYY-MM-DD)
                const todayStr = new Date().toISOString().split('T')[0];

                const { data, error } = await supabaseClient
                    .from('user_events')
                    .select('*')
                    .eq('user_id', user.id)
                    .gte('start_date', todayStr)
                    .order('start_date', { ascending: true })
                    .limit(1)
                    .single();

                if (error && error.code !== 'PGRST116') { // Ignore 0 rows error
                    throw error;
                }

                if (data) {
                    setPinnedEvent(data);
                }
            } catch (err) {
                console.error("Failed to fetch upcoming event", err);
            }
        };

        fetchPinnedEvents();
    }, []);

    return (
        <div className="flex flex-col md:flex-row gap-6">
            <div className="glass-panel p-8 flex-1 relative overflow-hidden group">
                {/* Background Decor (Dark Only) */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent-primary/5 rounded-full blur-3xl pointer-events-none hidden dark:block" />

                <div className="flex items-start justify-between relative z-10">
                    <div className="space-y-1">
                        <h2 className="text-xl font-bold flex items-center gap-2 text-text-primary tracking-tight">
                            <Clock className="w-5 h-5 text-accent-primary" strokeWidth={2.5} />
                            Academic Countdown
                        </h2>
                        <p className="text-text-muted font-bold text-xs tracking-[0.1em] uppercase opacity-60">Semester V • Insights Engine</p>
                    </div>

                    <div className="text-right flex flex-col items-end justify-center">
                        <div className="text-6xl font-black text-amber-500 dark:text-amber-400 tracking-tighter mb-1 font-accent">
                            {daysLeft} <span className="text-2xl text-amber-500/30 font-bold uppercase tracking-widest">Days</span>
                        </div>
                        <div className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] opacity-40">
                            Remaining
                        </div>
                    </div>
                </div>
            </div>

            {pinnedEvent && (
                <div className="glass-panel p-8 flex-1 border-accent-primary/20 bg-accent-soft relative overflow-hidden group">
                    {/* Background Glow (Dark Only) */}
                    <div className="absolute inset-0 bg-accent-primary/2 dark:block hidden" />

                    <div className="flex items-start justify-between relative z-10">
                        <div className="space-y-1">
                            <h2 className="text-xl font-bold flex items-center gap-2 text-accent-primary tracking-tight">
                                <Target className="w-5 h-5" strokeWidth={2.5} />
                                Goal: {pinnedEvent.title}
                            </h2>
                            <p className="text-text-muted font-bold text-[10px] uppercase tracking-widest opacity-60">
                                {format(new Date(pinnedEvent.start_date), "MMMM do, yyyy")}
                            </p>
                        </div>

                        <div className="text-right flex flex-col items-end justify-center">
                            <div className="text-6xl font-black text-text-primary tracking-tighter mb-1 font-accent">
                                {differenceInCalendarDays(new Date(pinnedEvent.start_date), new Date())} <span className="text-2xl text-text-muted/20 font-bold uppercase tracking-widest">Days</span>
                            </div>
                            <div className="text-[10px] font-bold text-accent-primary uppercase tracking-[0.2em]">
                                To Deadline
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
