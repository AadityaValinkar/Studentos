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
            case 0: return "bg-[#1e2230] border-white/5";
            case 1: return "bg-indigo-900/50 border-indigo-500/20";
            case 2: return "bg-indigo-700/60 border-indigo-500/30";
            case 3: return "bg-indigo-500/80 border-indigo-400/50";
            case 4: return "bg-indigo-400 border-indigo-300";
            default: return "bg-indigo-400 border-indigo-300";
        }
    };

    const getEventIcon = (type?: string) => {
        switch (type) {
            case "Exam": return <Target className="w-3 h-3 text-red-400" />;
            case "Hackathon": return <Flag className="w-3 h-3 text-purple-400" />;
            default: return <CalendarIcon className="w-3 h-3 text-indigo-400" />;
        }
    };

    return (
        <div className="glass-panel p-8 rounded-2xl border-t border-t-white/10 relative">
            <div className="absolute top-0 right-10 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -mt-10 pointer-events-none" />

            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 relative z-10">
                <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-1">
                        <CalendarIcon className="w-5 h-5 text-indigo-400" />
                        Academic Timeline
                    </h2>
                    <p className="text-slate-400 text-sm">365-day strategic overview of your engagements</p>
                </div>

                <div className="flex gap-4 text-xs text-slate-400 bg-black/20 p-2 rounded-lg border border-white/5">
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-sm bg-[#1e2230] border border-white/5" /> None
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-sm bg-indigo-500/80 border border-indigo-400/50" /> Focus
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-sm bg-indigo-400 border border-indigo-300" /> Event
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
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max p-2.5 rounded-lg bg-[#151821] border border-white/10 shadow-xl z-50 pointer-events-none backdrop-blur-xl">
                                        <p className="text-xs font-semibold text-white mb-1.5">
                                            {format(day.date, "MMM d, yyyy")}
                                        </p>
                                        {day.hasEvent ? (
                                            <div className="flex items-center gap-1.5 text-xs text-slate-300 bg-white/5 p-1.5 rounded-md">
                                                {getEventIcon(day.eventType)}
                                                <span className="font-medium">{day.eventType}</span>
                                            </div>
                                        ) : (
                                            <p className="text-xs text-slate-500">No events scheduled</p>
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
