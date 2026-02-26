import { CalendarDayInfo } from '@/lib/calendar-utils';
import { CalendarCell } from './CalendarCell';

interface MonthGridProps {
    days: CalendarDayInfo[];
    onDayClick?: (day: CalendarDayInfo) => void;
}

export function MonthGrid({ days, onDayClick }: MonthGridProps) {
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <div className="w-full">
            <div className="grid grid-cols-7 gap-3 mb-4">
                {weekDays.map(day => (
                    <div key={day} className="text-center text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-3 auto-rows-[110px]">
                {days.map((day, i) => (
                    <CalendarCell key={`${day.dateString}-${i}`} dayInfo={day} onClick={onDayClick} />
                ))}
            </div>
        </div>
    );
}
