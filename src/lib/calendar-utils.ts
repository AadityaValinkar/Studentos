import { AcademicEvent } from './event-mapper';

export interface CalendarDayInfo {
    date: Date;
    dateString: string; // YYYY-MM-DD
    isCurrentMonth: boolean;
    isToday: boolean;
    events: AcademicEvent[];
}

/**
 * Returns YYYY-MM-DD string adjusted for local timezone offset
 */
export function toISODateString(date: Date): string {
    const d = new Date(date);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().split('T')[0];
}

export function getEventsForDate(dateString: string, events: AcademicEvent[]): AcademicEvent[] {
    return events.filter(event => {
        return dateString >= event.start && dateString <= event.end;
    });
}

/**
 * Generates precisely 42 days (6 weeks * 7 days) to fill a typical month grid.
 */
export function generateMonthGrid(year: number, month: number, allEvents: AcademicEvent[]): CalendarDayInfo[] {
    const firstDayOfMonth = new Date(year, month, 1);
    const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 is Sunday, 1 is Monday...

    const todayDateString = toISODateString(new Date());

    const days: CalendarDayInfo[] = [];

    // Add days from the previous month to fill the first row
    const prevMonthDays = startingDayOfWeek;
    for (let i = prevMonthDays - 1; i >= 0; i--) {
        const d = new Date(year, month, 0 - i);
        const dateString = toISODateString(d);
        days.push({
            date: d,
            dateString,
            isCurrentMonth: false,
            isToday: dateString === todayDateString,
            events: getEventsForDate(dateString, allEvents),
        });
    }

    // Add days from current month
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let i = 1; i <= daysInMonth; i++) {
        const d = new Date(year, month, i);
        const dateString = toISODateString(d);
        days.push({
            date: d,
            dateString,
            isCurrentMonth: true,
            isToday: dateString === todayDateString,
            events: getEventsForDate(dateString, allEvents),
        });
    }

    // Add days from next month to fill exactly 42 cells (6 rows)
    const totalCells = 42; // 6 rows * 7 columns
    const remainingDays = totalCells - days.length;
    for (let i = 1; i <= remainingDays; i++) {
        const d = new Date(year, month + 1, i);
        const dateString = toISODateString(d);
        days.push({
            date: d,
            dateString,
            isCurrentMonth: false,
            isToday: dateString === todayDateString,
            events: getEventsForDate(dateString, allEvents),
        });
    }

    return days;
}
