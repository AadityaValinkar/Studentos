import { CalendarDayInfo } from '@/lib/calendar-utils';
import { EventBadge } from './EventBadge';
import { Plus } from 'lucide-react';

interface CalendarCellProps {
    dayInfo: CalendarDayInfo;
    onClick?: (day: CalendarDayInfo) => void;
}

export function CalendarCell({ dayInfo, onClick }: CalendarCellProps) {
    const hasEvents = dayInfo.events.length > 0;
    const isSunday = dayInfo.date.getDay() === 0;
    const isHoliday = dayInfo.events.some(e => e.type === 'HOLIDAY');

    let outlineClass = '';
    if (isHoliday) {
        outlineClass = 'ring-2 ring-green-500/70 border-green-500/30';
    } else if (isSunday) {
        outlineClass = 'ring-2 ring-red-500/70 border-red-500/30';
    }

    return (
        <div
            onClick={() => onClick && onClick(dayInfo)}
            className={`group min-h-[110px] p-2 flex flex-col gap-1 rounded-2xl border transition-all duration-200 cursor-pointer overflow-hidden relative
                ${dayInfo.isCurrentMonth ? 'bg-white dark:bg-white/[0.02] border-slate-200 dark:border-white/5 hover:-translate-y-1 hover:shadow-md dark:shadow-none' : 'bg-transparent border-transparent opacity-30'}
                ${dayInfo.isToday ? 'ring-2 ring-indigo-600 dark:ring-indigo-500/70 bg-indigo-50 dark:bg-indigo-500/5' : ''}
                ${outlineClass}
                ${hasEvents && !outlineClass ? 'border-l-2 border-l-slate-200 dark:border-l-white/10' : ''}
            `}
        >
            <div className="flex items-start justify-between z-10">
                <div className={`text-base font-bold tracking-tight ${dayInfo.isToday ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-900 dark:text-slate-500'}`}>
                    {dayInfo.date.getDate()}
                </div>
                {dayInfo.isCurrentMonth && (
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 bg-slate-100 dark:bg-white/5 rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 hover:text-slate-900 dark:hover:text-white">
                        <Plus className="w-3.5 h-3.5" />
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-1 mt-auto pt-1 z-10 overflow-hidden">
                {dayInfo.events.slice(0, 3).map((event, index) => (
                    <EventBadge key={`${event.id}-${index}`} event={event} />
                ))}
                {dayInfo.events.length > 3 && (
                    <div className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1 mt-0.5">
                        + {dayInfo.events.length - 3} more
                    </div>
                )}
            </div>
        </div>
    );
}
