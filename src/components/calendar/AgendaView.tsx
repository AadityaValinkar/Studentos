"use client";

import { CalendarDayInfo } from '@/lib/calendar-utils';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Clock, ChevronRight } from 'lucide-react';

interface AgendaViewProps {
    days: CalendarDayInfo[];
    onEventClick?: (day: CalendarDayInfo) => void;
}

export function AgendaView({ days, onEventClick }: AgendaViewProps) {
    const daysWithEvents = days.filter(day => day.isCurrentMonth && day.events.length > 0);

    if (daysWithEvents.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center mb-4">
                    <CalendarIcon className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No events this month</h3>
                <p className="text-slate-500 dark:text-slate-400 max-w-xs">
                    Your agenda is clear! Enjoy your free time or add some new goals.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {daysWithEvents.map((day) => (
                <div key={day.dateString} className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="flex flex-col items-center justify-center w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                                {format(day.date, 'eee')}
                            </span>
                            <span className="text-lg font-bold text-indigo-700 dark:text-indigo-300 leading-none">
                                {format(day.date, 'd')}
                            </span>
                        </div>
                        <div className="h-px flex-1 bg-slate-100 dark:bg-white/5" />
                    </div>

                    <div className="space-y-2 pl-2">
                        {day.events.map((event, idx) => (
                            <button
                                key={`${event.id}-${idx}`}
                                onClick={() => onEventClick && onEventClick(day)}
                                className="w-full flex items-center gap-4 p-5 rounded-2xl bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 hover:border-indigo-500/50 transition-all text-left min-h-[72px]"
                            >
                                <div className={`w-1.5 h-12 rounded-full ${event.type === 'GATE' || event.type === 'EXAM' ? 'bg-red-500' :
                                        event.type === 'HOLIDAY' ? 'bg-green-500' : 'bg-indigo-500'
                                    }`} />

                                <div className="flex-1 min-w-0">
                                    <h4 className="text-base font-bold text-slate-900 dark:text-white truncate">
                                        {event.title}
                                    </h4>
                                    <div className="flex items-center gap-2 mt-1.5">
                                        <Clock className="w-4 h-4 text-slate-400" />
                                        <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400">
                                            {event.type}
                                        </span>
                                    </div>
                                </div>

                                <ChevronRight className="w-6 h-6 text-slate-300" />
                            </button>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
