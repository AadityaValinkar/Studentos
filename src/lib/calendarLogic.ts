import { startOfYear, endOfYear, eachDayOfInterval, format } from "date-fns";

export interface CalendarDay {
    date: Date;
    dateStr: string;
    hasEvent: boolean;
    eventType?: "Exam" | "Hackathon" | "Custom";
    intensity: number; // 0 to 4 for GitHub style
}

export function generateYearGrid(events: { date: Date; type: string }[] = []): CalendarDay[] {
    const currentDate = new Date();
    const start = startOfYear(currentDate);
    const end = endOfYear(currentDate);

    const days = eachDayOfInterval({ start, end });

    // Map dates to events
    const eventMap = new Map<string, { type: string; count: number }>();
    events.forEach(e => {
        const key = format(e.date, "yyyy-MM-dd");
        const existing = eventMap.get(key);
        if (existing) {
            existing.count += 1;
        } else {
            eventMap.set(key, { type: e.type, count: 1 });
        }
    });

    return days.map(date => {
        const dateStr = format(date, "yyyy-MM-dd");
        const event = eventMap.get(dateStr);

        let intensity = 0;
        if (event) {
            intensity = Math.min(event.count, 4); // Max intensity 4
        }

        return {
            date,
            dateStr,
            hasEvent: !!event,
            eventType: event?.type as "Exam" | "Hackathon" | "Custom" | undefined,
            intensity,
        };
    });
}
