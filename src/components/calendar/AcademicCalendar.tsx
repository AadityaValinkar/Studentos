"use client";
import { generateYearGrid } from "@/lib/calendarLogic";
import { useMemo, useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Flag, Target } from "lucide-react";

export function AcademicCalendar() {
    const [hoveredDay, setHoveredDay] = useState<string | null>(null);

    // Dummy events
    const events = useMemo(() => [
        { date: new Date(new Date().setMonth(3, 15)), type: "Exam" },
        { date: new Date(new Date().setMonth(5, 20)), type: "Hackathon" },
        { date: new Date(new Date().setMonth(8, 10)), type: "Custom" },
        { date: new Date(new Date().setMonth(8, 11)), type: "Custom" },
    ], []);

    const grid = useMemo(() => generateYearGrid(events), [events]);

    // Group by weeks (7 days)
    const weeks = [];
    for (let i = 0; i < grid.length; i += 7) {
        weeks.push(grid.slice(i, i + 7));
    }

    const getDayColor = (intensity: number) => {
        switch (intensity) {
            case 0: return "bg-bg-card border-border-muted/30";
            case 1: return "bg-accent-primary/10 border-accent-primary/20";
            case 2: return "bg-accent-primary/30 border-accent-primary/30";
            case 3: return "bg-accent-primary/60 border-accent-primary/50";
            case 4: return "bg-accent-primary border-accent-primary/80";
            default: return "bg-accent-primary border-accent-primary/80";
        }
    };

    const getEventIcon = (type?: string) => {
        switch (type) {
            case "Exam": return <Target className="w-3 h-3 text-red-500" />;
            case "Hackathon": return <Flag className="w-3 h-3 text-amber-500" />;
            default: return <CalendarIcon className="w-3 h-3 text-accent-primary" />;
        }
    };

    return (
        <div className="glass-panel p-8 rounded-[2rem] border-border-muted relative overflow-hidden group">
            {/* Background Decor (Dark Only) */}
            <div className="absolute top-0 right-10 w-64 h-64 bg-accent-primary/5 rounded-full blur-[80px] -mt-10 pointer-events-none hidden dark:block" />

            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 relative z-10">
                <div>
                    <h2 className="text-xl font-bold text-text-primary flex items-center gap-3 mb-1">
                        <CalendarIcon className="w-6 h-6 text-accent-primary" />
                        Academic Timeline
                    </h2>
                    <p className="text-text-muted text-sm font-medium">365-day strategic overview of your engagements</p>
                </div>

                <div className="flex gap-4 text-[10px] font-bold uppercase tracking-wider text-text-muted bg-bg-base/50 backdrop-blur-sm p-3 rounded-2xl border border-border-muted/50">
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-[3px] bg-bg-card border border-border-muted" /> None
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-[3px] bg-accent-primary/60 border border-accent-primary/20" /> Focus
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-[3px] bg-accent-primary border border-accent-primary/40" /> Event
                    </div>
                </div>
            </div>

            <div className="flex gap-1.5 overflow-x-auto pb-4 custom-scrollbar relative z-10">
                {weeks.map((week, wIdx) => (
                    <div key={wIdx} className="flex flex-col gap-1.5">
                        {week.map((day, dIdx) => (
                            <div
                                key={dIdx}
                                onMouseEnter={() => setHoveredDay(day.dateStr)}
                                onMouseLeave={() => setHoveredDay(null)}
                                className={`w-[14px] h-[14px] rounded-[3px] border transition-all duration-200 relative cursor-pointer
                  ${getDayColor(day.intensity)} hover:scale-125 hover:z-20 hover:shadow-[0_0_10px_rgba(99,102,241,0.5)]
                `}
                            >
                                {/* Tooltip */}
                                {hoveredDay === day.dateStr && (
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-max p-3.5 rounded-2xl bg-bg-card border border-border-subtle shadow-2xl z-50 pointer-events-none backdrop-blur-2xl">
                                        <p className="text-[10px] uppercase font-bold tracking-widest text-text-muted opacity-60 mb-2">
                                            {format(day.date, "MMM d, yyyy")}
                                        </p>
                                        {day.hasEvent ? (
                                            <div className="flex items-center gap-3 text-xs text-text-primary bg-bg-base/80 p-2 rounded-xl border border-border-muted">
                                                {getEventIcon(day.eventType)}
                                                <span className="font-bold">{day.eventType}</span>
                                            </div>
                                        ) : (
                                            <p className="text-xs font-medium text-text-muted/60 lowercase italic">No events scheduled</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}
