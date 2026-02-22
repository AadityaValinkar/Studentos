import { calculateBunkStats } from '@/lib/bunkCalculator';
import { Activity } from 'lucide-react';
import Link from 'next/link';

export function BunkCalculatorWidget() {
    const totalClasses = 150;
    const attendedClasses = 120;

    const stats = calculateBunkStats(totalClasses, attendedClasses);

    return (
        <div className="glass-card p-6 flex flex-col justify-between group h-full hover:border-black/10 dark:hover:border-white/20 transition-all pointer-events-auto">
            <div className="flex justify-between items-start mb-6 z-10">
                <h3 className="font-light text-slate-700 dark:text-slate-300 flex items-center gap-2 tracking-wide">
                    <Activity className="w-4 h-4 text-indigo-500 dark:text-indigo-400" strokeWidth={1.5} />
                    Quick Bunk Status
                </h3>
            </div>

            <div className="flex-1 flex flex-col justify-center gap-8 z-10">
                <div>
                    <div className="flex items-baseline gap-2 mb-3">
                        <span className="text-5xl font-light text-slate-900 dark:text-white tracking-tighter tabular-nums drop-shadow-sm dark:drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                            {stats.currentPercentage}
                        </span>
                        <span className="text-sm text-slate-500 font-light tracking-widest">%</span>
                    </div>
                    {/* Minimal Progress Line */}
                    <div className="w-full bg-black/5 dark:bg-white/5 h-[2px] rounded-full overflow-hidden">
                        <div
                            className={`h-full opacity-80 ${stats.currentPercentage >= 75 ? 'bg-indigo-400' : 'bg-red-400'}`}
                            style={{ width: `${stats.currentPercentage}%` }}
                        />
                    </div>
                </div>

                {/* Inline Metrics Nothing Style */}
                <div className="flex items-center gap-4 text-sm font-light">
                    <div className="flex items-center gap-2">
                        <span className="text-slate-500 tracking-wide">Safe Bunks:</span>
                        <span className="text-slate-900 dark:text-white">{stats.classesCanBunk}</span>
                    </div>
                    <div className="w-[1px] h-4 bg-black/10 dark:bg-white/10" />
                    <div className="flex items-center gap-2">
                        <span className="text-slate-500 tracking-wide">Must Attend:</span>
                        <span className="text-orange-500 dark:text-orange-300">{stats.classesToAttend}</span>
                    </div>
                </div>
            </div>

            <Link href="/bunk" className="text-xs text-slate-500 mt-6 pt-4 border-t border-black/5 dark:border-white/5 text-center hover:text-slate-900 dark:hover:text-white transition-colors z-10 font-light tracking-wide">
                Advanced Calculator &rarr;
            </Link>
        </div>
    );
}
