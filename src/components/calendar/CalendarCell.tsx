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
            className={`group min-h-[110px] p-2 flex flex-col gap-1 rounded-2xl border backdrop-blur-3xl transition-all duration-200 cursor-pointer overflow-hidden relative
                ${dayInfo.isCurrentMonth ? 'bg-white/[0.02] border-white/5 hover:-translate-y-0.5 hover:bg-white/[0.04]' : 'bg-transparent border-transparent opacity-30'}
                ${dayInfo.isToday ? 'ring-2 ring-indigo-500/70 bg-indigo-500/5' : ''}
                ${outlineClass}
                ${hasEvents && !outlineClass ? 'border-l-2 border-l-white/10' : ''}
            `}
        >
            <div className="flex items-center justify-between z-10">
                <div className={`text-xs font-light px-1 ${dayInfo.isToday ? 'text-indigo-400 font-medium' : 'text-slate-500'}`}>
                    {dayInfo.date.getDate()}
                </div>
                {dayInfo.isCurrentMonth && (
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity p-1 bg-white/5 rounded-md hover:bg-white/10 text-slate-400 hover:text-white">
                        <Plus className="w-3 h-3" />
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-1 overflow-y-auto no-scrollbar mt-1 z-10 pb-1">
                {dayInfo.events.map((event, index) => (
                    <EventBadge key={`${event.id}-${index}`} event={event} />
                ))}
            </div>
        </div>
    );
}
