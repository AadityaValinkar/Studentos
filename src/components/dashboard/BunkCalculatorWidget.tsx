import { calculateBunkStats } from '@/lib/bunkCalculator';
import { Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export function BunkCalculatorWidget() {
    // Note: In a real app, these would come from profile/API
    const totalClasses = 150;
    const attendedClasses = 120;
    const target = 75;

    const stats = calculateBunkStats(totalClasses, attendedClasses, target);
    const isAtRisk = stats.currentPercentage < target;

    return (
        <div className={cn(
            "glass-panel p-8 flex flex-col justify-between group h-full transition-all duration-500 relative overflow-hidden",
            isAtRisk ? "border-red-500/30 hover:border-red-500/50" : "hover:border-accent-primary/30"
        )}>
            {/* Background Glow (Dark Only) */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent-primary/5 rounded-full blur-3xl pointer-events-none hidden dark:block" />
            {isAtRisk && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-transparent" />
            )}

            <div className="flex justify-between items-start mb-6 z-10 relative">
                <h3 className="text-text-muted text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                    <Activity className="w-4 h-4 text-accent-primary" strokeWidth={2.5} />
                    Attendance Status
                </h3>
                {isAtRisk && (
                    <span className="bg-red-500/10 text-red-500 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border border-red-500/20">
                        Below Target
                    </span>
                )}
            </div>

            <div className="flex-1 flex flex-col justify-center gap-8 z-10">
                <div>
                    <div className="flex items-baseline gap-2 mb-3">
                        <span className={cn(
                            "font-accent text-6xl font-black tracking-tighter tabular-nums",
                            isAtRisk ? "text-red-500" : "text-text-primary dark:drop-shadow-[0_0_20px_rgba(99,102,241,0.3)]"
                        )}>
                            {Math.floor(stats.currentPercentage)}
                        </span>
                        <span className="font-accent text-sm text-accent-primary/40 font-bold tracking-[0.2em] uppercase">%</span>
                    </div>
                    {/* Minimal Progress Line */}
                    <div className="w-full bg-slate-100 dark:bg-white/5 h-[3px] rounded-full overflow-hidden">
                        <div
                            className={cn(
                                "h-full transition-all duration-1000",
                                isAtRisk ? "bg-red-500" : "bg-accent-primary"
                            )}
                            style={{ width: `${stats.currentPercentage}%` }}
                        />
                    </div>
                </div>

                <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest opacity-80">
                    <div className="flex items-center gap-2">
                        <span className="text-text-muted">Bunk:</span>
                        <span className={cn(
                            "font-accent font-black",
                            stats.classesCanBunk > 0 ? "text-emerald-500" : "text-text-muted opacity-40"
                        )}>{stats.classesCanBunk}</span>
                    </div>
                    <div className="w-[1px] h-3 bg-border-muted opacity-20" />
                    <div className="flex items-center gap-2">
                        <span className="text-text-muted">Required:</span>
                        <span className="text-text-primary font-accent font-black">{stats.classesToAttend}</span>
                    </div>
                </div>
            </div>

            <Link href="/bunk" className="text-[10px] font-bold text-text-muted mt-6 pt-5 border-t border-border-muted text-center hover:text-accent-primary transition-colors z-10 uppercase tracking-[0.2em] opacity-40 hover:opacity-100">
                Update Data &rarr;
            </Link>
        </div>
    );
}
