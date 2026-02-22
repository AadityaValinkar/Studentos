import { AcademicEvent } from '@/lib/event-mapper';

interface TimelineViewProps {
    events: AcademicEvent[];
}

export function TimelineView({ events }: TimelineViewProps) {
    // Sort events by start date
    const sortedEvents = [...events].sort((a, b) => a.start.localeCompare(b.start));

    const typeColors: Record<string, string> = {
        TEACHING: 'bg-indigo-500',
        WEEKLY: 'bg-blue-500',
        HOLIDAY: 'bg-green-500',
        MID_SEM: 'bg-indigo-400',
        ESE_PRACTICAL: 'bg-amber-500',
        ESE_THEORY: 'bg-yellow-500',
        SUBMISSION: 'bg-cyan-500',
        GATE: 'bg-red-500',
        EVENT: 'bg-slate-400'
    };

    return (
        <div className="max-w-3xl mx-auto py-12 relative">
            {/* Center Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-white/10 -translate-x-1/2" />

            <div className="space-y-12">
                {sortedEvents.map((event, i) => {
                    const isLeft = i % 2 === 0;
                    const dateDisplay = event.start === event.end
                        ? new Date(event.start).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                        : `${new Date(event.start).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${new Date(event.end).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;

                    return (
                        <div key={`${event.id}-${i}`} className={`flex items-center justify-between w-full ${isLeft ? 'flex-row-reverse' : ''}`}>

                            {/* Empty spacer for alignment */}
                            <div className="w-5/12" />

                            {/* Center Node */}
                            <div className="z-10 flex items-center justify-center w-8 h-8 rounded-full bg-[#12141c] border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                                <div className={`w-3 h-3 rounded-full ${typeColors[event.type] || 'bg-white'}`} />
                            </div>

                            {/* Content Card */}
                            <div className={`w-5/12 ${isLeft ? 'text-right pr-8' : 'pl-8'}`}>
                                <div className="glass-card p-5 group hover:border-white/20 transition-all cursor-default">
                                    <div className={`text-xs font-medium tracking-widest uppercase mb-2 ${typeColors[event.type]?.replace('bg-', 'text-')} opacity-80`}>
                                        {event.type.replace('_', ' ')}
                                    </div>
                                    <h4 className="text-lg font-light text-white tracking-wide mb-1">{event.title}</h4>
                                    <p className="text-sm font-light text-slate-500">{dateDisplay}</p>

                                    {event.description && (
                                        <p className="text-xs text-slate-400 mt-3 pt-3 border-t border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {event.description}
                                        </p>
                                    )}
                                </div>
                            </div>

                        </div>
                    );
                })}
            </div>
        </div>
    );
}
