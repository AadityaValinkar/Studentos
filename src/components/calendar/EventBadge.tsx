import { AcademicEvent } from '@/lib/event-mapper';

const typeStyles: Record<string, string> = {
    EXAM: 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 font-bold',
    DEADLINE: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20',
    ACADEMIC: 'bg-accent-soft text-accent-primary border border-accent/20',
    HOLIDAY: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
};

export function EventBadge({ event }: { event: AcademicEvent }) {
    return (
        <div
            className={`text-[9px] font-bold uppercase tracking-tight leading-tight px-2 py-0.5 min-h-[18px] rounded-md line-clamp-1 overflow-hidden cursor-default transition-all hover:scale-[1.02] active:scale-95 ${typeStyles[event.type]}`}
            title={event.description || event.title}
        >
            {event.title}
        </div>
    );
}
