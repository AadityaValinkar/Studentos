"use client";

import { useEffect, useState } from 'react';
import { Target } from 'lucide-react';

export function MomentumScore() {
    const targetScore = 84;
    const [score, setScore] = useState(0);

    useEffect(() => {
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
    }, []);

    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    return (
        <div className="glass-card p-6 flex flex-col justify-between group h-full hover:border-black/10 dark:hover:border-white/20 transition-all pointer-events-auto">
            <div className="flex justify-between items-start mb-6 relative z-10">
                <h3 className="font-light text-slate-700 dark:text-slate-300 flex items-center gap-2 tracking-wide">
                    <Target className="w-4 h-4 text-indigo-500 dark:text-indigo-400" strokeWidth={1.5} />
                    Momentum Score
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
                        className="text-slate-200 dark:text-white/10"
                    />
                    <circle
                        cx="64"
                        cy="64"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        className="text-indigo-400 transition-all duration-75 ease-out"
                    />
                </svg>

                <div className="flex items-baseline gap-1 z-10">
                    <span className="text-6xl font-light text-slate-900 dark:text-white tracking-tighter tabular-nums drop-shadow-sm dark:drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                        {score}
                    </span>
                    <span className="text-slate-500 font-light tracking-widest text-sm">/ 100</span>
                </div>
            </div>

            <p className="text-xs text-slate-500 mt-6 tracking-wide font-light text-center">
                Academic momentum is stable.
            </p>
        </div>
    );
}
