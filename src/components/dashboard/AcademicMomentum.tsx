"use client";

import { Clock, Info } from 'lucide-react';
import { getDaysRemaining } from '@/lib/calculations';

interface AcademicMomentumProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    profile: any;
}

export function AcademicMomentum({ profile }: AcademicMomentumProps) {
    if (!profile) return null;
    const daysLeft = getDaysRemaining(profile.semester_end_date);

    return (
        <div className="flex flex-col md:flex-row gap-6">
            <div className="glass-card p-8 flex-1 relative overflow-hidden group">
                {/* Metric Top Accent */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-accent-primary/50 dark:bg-accent-primary/20" />

                <div className="flex items-start justify-between relative z-10">
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <h2 className="text-xl font-bold flex items-center gap-2 text-text-primary tracking-tight">
                                <Clock className="w-5 h-5 text-accent-primary" strokeWidth={2.5} />
                                Time Command
                            </h2>
                            <p className="text-text-muted font-bold text-[10px] tracking-[0.2em] uppercase opacity-60">
                                Semester {profile.semester} Timeline
                            </p>
                        </div>

                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-soft border border-accent-primary/20 text-accent-primary text-[10px] font-bold uppercase tracking-widest shadow-sm shadow-accent-primary/10">
                            <Info className="w-3.5 h-3.5" />
                            Suggested Focus: Maintain study consistency
                        </div>
                    </div>

                    <div className="text-right flex flex-col items-end justify-center lg:group-hover:scale-105 transition-transform duration-500">
                        <div className="text-6xl font-black text-text-primary tracking-tighter mb-1 font-accent">
                            {daysLeft} <span className="text-2xl text-accent-primary/30 font-bold uppercase tracking-widest">Days</span>
                        </div>
                        <div className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] opacity-40">
                            To Semester End
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
