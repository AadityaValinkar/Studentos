"use client";
import { useEffect, useState } from 'react';
import { Target } from 'lucide-react';
import { calculateMomentum, getMomentumStatus } from '@/lib/calculations';

interface MomentumScoreProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    profile: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    targets: any[];
}

export function MomentumScore({ profile, targets }: MomentumScoreProps) {
    const targetScore = profile ? calculateMomentum(profile, targets) : 0;
    const [score, setScore] = useState(0);

    useEffect(() => {
        if (!profile) return;
        setScore(0);
        let current = 0;
        const interval = setInterval(() => {
            current += 2;
            if (current >= targetScore) {
                setScore(targetScore);
                clearInterval(interval);
            } else {
                setScore(current);
            }
        }, 16);
        return () => clearInterval(interval);
    }, [targetScore, profile]);

    if (!profile) return (
        <div className="glass-panel p-6 flex flex-col justify-center items-center h-full opacity-60 border-dashed border-border-muted bg-bg-card/50">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted italic">No momentum data available</p>
        </div>
    );

    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    return (
        <div className="glass-panel p-8 flex flex-col justify-between group h-full hover:border-accent-primary/30 transition-all duration-500 relative overflow-hidden">
            {/* Background Glow (Dark Only) */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent-primary/5 rounded-full blur-3xl pointer-events-none hidden dark:block" />

            <div className="flex justify-between items-start mb-6 relative z-10">
                <h3 className="font-bold text-text-muted text-[10px] uppercase tracking-[0.2em] flex items-center gap-2">
                    <Target className="w-4 h-4 text-accent-primary" strokeWidth={2.5} />
                    Performance Index
                </h3>
            </div>

            <div className="relative flex items-center justify-center py-6">
                <svg className="absolute w-32 h-32 -rotate-90 transform opacity-40">
                    <circle
                        cx="64"
                        cy="64"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="1"
                        fill="transparent"
                        className="text-bg-base/5 dark:text-white/5"
                    />
                    <circle
                        cx="64"
                        cy="64"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="3"
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        className="text-accent-primary transition-all duration-1000 ease-out"
                    />
                </svg>

                <div className="flex items-baseline gap-1 z-10 group-hover:scale-110 transition-transform duration-700">
                    <span className="text-7xl font-black text-text-primary tracking-tighter tabular-nums dark:drop-shadow-[0_0_20px_rgba(99,102,241,0.3)] font-accent">
                        {score}
                    </span>
                    <span className="text-accent-primary/40 font-bold tracking-[0.2em] text-[10px] font-accent uppercase">/ 100</span>
                </div>
            </div>

            <p className="text-[11px] font-bold text-text-muted mt-6 tracking-widest uppercase text-center opacity-60">
                {getMomentumStatus(score)}
            </p>
        </div>
    );
}
