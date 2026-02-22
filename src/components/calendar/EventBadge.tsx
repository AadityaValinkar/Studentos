import { AcademicEvent } from '@/lib/event-mapper';

const typeStyles: Record<AcademicEvent['type'], string> = {
    TEACHING: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20',
    WEEKLY: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    HOLIDAY: 'bg-green-500/10 text-green-400 border border-green-500/20',
    MID_SEM: 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 font-medium',
    ESE_PRACTICAL: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    ESE_THEORY: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 font-medium',
    SUBMISSION: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20',
    GATE: 'bg-red-500/10 text-red-400 border border-red-500/20 font-medium',
    EVENT: 'bg-slate-500/10 text-slate-300 border border-white/10'
};

export function EventBadge({ event }: { event: AcademicEvent }) {
    return (
        <div
            className={`text-[10px] leading-tight px-1.5 py-0.5 rounded-md truncate cursor-default transition-colors hover:brightness-125 ${typeStyles[event.type]}`}
            title={event.description || event.title}
        >
            {event.title}
        </div>
    );
}
