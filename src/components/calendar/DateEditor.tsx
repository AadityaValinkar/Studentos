"use client";

import { CalendarDayInfo } from "@/lib/calendar-utils";
import { useState } from "react";
import { Plus, EyeOff, CheckCircle2, Trash2 } from "lucide-react";

interface DateEditorProps {
    day: CalendarDayInfo;
    onAddEvent: (data: { title: string }) => void;
    onDeleteEvent: (eventId: string) => void;
    onHideSystemEvent: (eventId: string) => void;
}

export function DateEditor({ day, onAddEvent, onDeleteEvent, onHideSystemEvent }: DateEditorProps) {
    const [isAdding, setIsAdding] = useState(false);

    // Placeholder Add Event Form State
    const [title, setTitle] = useState("");

    return (
        <div className="space-y-8 animate-in fade-in duration-300">
            {/* System Events */}
            {day.events.filter(e => !e.isUserEvent).length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-[10px] uppercase font-bold tracking-[0.2em] text-text-muted opacity-60 mb-2">System Academic Events</h3>
                    {day.events.filter(e => !e.isUserEvent).map(event => (
                        <div key={event.id} className="group bg-bg-card border border-border-muted rounded-2xl p-4 hover:border-border-subtle transition-all flex items-start justify-between">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-[9px] px-2 py-0.5 rounded-md bg-accent-soft text-accent-primary font-bold tracking-wider">SYSTEM</span>
                                    <h4 className="text-sm font-bold text-text-primary">{event.title}</h4>
                                </div>
                                <p className="text-xs font-medium text-text-muted tracking-tight">{event.type.replace('_', ' ')}</p>
                            </div>

                            <button
                                onClick={() => onHideSystemEvent(event.id)}
                                className="opacity-0 group-hover:opacity-100 p-2 text-text-muted hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                                title="Hide from my calendar"
                            >
                                <EyeOff className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Custom User Events */}
            {day.events.filter(e => e.isUserEvent).length > 0 && (
                <div className="space-y-4 pt-4 border-t border-border-muted/50">
                    <h3 className="text-[10px] uppercase font-bold tracking-[0.2em] text-accent-primary mb-2">My Custom Events</h3>
                    {day.events.filter(e => e.isUserEvent).map(event => (
                        <div key={event.id} className="group bg-accent-soft/30 border border-accent-primary/20 rounded-2xl p-4 hover:border-accent-primary/40 transition-all flex items-start justify-between border-l-[3px] border-l-accent-primary shadow-sm shadow-accent-primary/5">
                            <div>
                                <h4 className="text-sm font-bold text-text-primary mb-1">{event.title}</h4>
                                <p className="text-xs font-medium text-text-muted">Custom Event</p>
                            </div>

                            <button
                                onClick={() => onDeleteEvent(event.id)}
                                className="opacity-0 group-hover:opacity-100 p-2 text-text-muted hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                                title="Delete event"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Custom Add Event Section */}
            <div className="pt-4 border-t border-border-muted/50">
                {!isAdding ? (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="w-full py-4 border-2 border-dashed border-border-muted rounded-2xl text-text-muted hover:text-accent-primary hover:border-accent-primary/40 hover:bg-accent-soft transition-all flex items-center justify-center gap-2 font-bold text-[11px] uppercase tracking-[0.1em]"
                    >
                        <Plus className="w-4 h-4" />
                        Add Custom Event
                    </button>
                ) : (
                    <div className="bg-bg-card border border-border-subtle rounded-3xl p-6 mb-2 space-y-4 shadow-xl">
                        <h3 className="text-sm font-bold text-text-primary mb-2">New Event</h3>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest pl-1 opacity-60">Event Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full bg-bg-base border border-border-muted rounded-xl px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all placeholder:text-text-muted/30"
                                placeholder="e.g. Minor Project Deadline"
                            />
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <button
                                onClick={() => setIsAdding(false)}
                                className="px-4 py-2 text-xs font-bold text-text-muted hover:text-text-primary transition-colors uppercase tracking-widest"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    onAddEvent({ title });
                                    setIsAdding(false);
                                    setTitle("");
                                }}
                                className="px-5 py-2.5 bg-accent-primary hover:bg-accent-primary/90 text-white text-[11px] font-bold uppercase tracking-widest rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-accent-primary/20 active:scale-95"
                            >
                                <CheckCircle2 className="w-4 h-4" />
                                Save Event
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
