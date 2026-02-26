"use client";
import { Target } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RealityCheckProps {
    profile: Record<string, unknown> | null;
}

export function RealityCheck({ profile }: RealityCheckProps) {
    if (!profile) return (
        <div className="glass-panel p-6 flex flex-col justify-center items-center h-full opacity-60 border-dashed border-border-muted bg-bg-card/50">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted italic">Complete profile for insights</p>
        </div>
    );
    const hasDrift = (profile?.cgpa as number) < (profile?.target_cgpa as number);
    const isAtRisk = (profile?.attendance as number) < 75;

    return (
        <div className={cn(
            "glass-panel p-8 flex flex-col justify-between group h-full transition-all duration-500 relative overflow-hidden",
            isAtRisk ? "border-red-500/30 hover:border-red-500/50" : "hover:border-accent-primary/30"
        )}>
            {isAtRisk && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-transparent" />
            )}

            <div className="flex justify-between items-start mb-6 relative z-10">
                <h3 className="text-text-muted text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                    <Target className="w-4 h-4 text-accent-primary" strokeWidth={2.5} />
                    Academic Analysis
                </h3>
            </div>

            <div className="flex-1 flex flex-col justify-center space-y-4 relative z-10">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <h4 className="text-text-primary text-base font-bold tracking-tight">
                            {hasDrift ? 'CGPA Drift Analysis' : 'On Track for Target'}
                        </h4>
                        {isAtRisk && (
                            <span className="bg-red-500/10 text-red-500 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border border-red-500/20">
                                Risk
                            </span>
                        )}
                    </div>
                    <p className="text-xs text-text-muted leading-relaxed font-bold tracking-tight opacity-70">
                        Your current CGPA is <span className="text-text-primary font-black">{profile.cgpa as number}</span>.
                        To hit your target of <span className="text-text-primary font-black">{profile.target_cgpa as number}</span>,
                        maintain a semester SGPA of {Math.min(10, (profile.target_cgpa as number) + 0.5).toFixed(1)}+.
                    </p>
                </div>

                <div className="pt-4 border-t border-border-muted/50">
                    <p className="text-xs text-accent-primary leading-relaxed font-bold tracking-tight">
                        <span className="text-text-muted block mb-1 uppercase tracking-[0.2em] text-[10px] opacity-40">Performance Status</span>
                        Attendance ({profile.attendance as number}%) is {(profile.attendance as number) >= 75 ? 'healthy' : 'below threshold'}.
                    </p>
                </div>
            </div>
        </div>
    );
}
