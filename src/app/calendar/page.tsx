import { SemesterCalendar } from "@/components/calendar/SemesterCalendar";

export default function CalendarPage() {
    return (
        <div className="p-6 md:p-8 pb-32 max-w-[1400px] mx-auto min-h-screen flex items-center justify-center animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <SemesterCalendar />
        </div>
    );
}
