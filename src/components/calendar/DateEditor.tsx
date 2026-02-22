"use client";

import { CalendarDayInfo } from "@/lib/calendar-utils";
import { useState } from "react";
import { Plus, EyeOff, CheckCircle2 } from "lucide-react";

interface DateEditorProps {
    day: CalendarDayInfo;
    onAddEvent: (data: { title: string }) => void;
    onHideSystemEvent: (eventId: string) => void;
}

export function DateEditor({ day, onAddEvent, onHideSystemEvent }: DateEditorProps) {
    const [isAdding, setIsAdding] = useState(false);

    // Placeholder Add Event Form State
    const [title, setTitle] = useState("");

    return (
        <div className="space-y-8 animate-in fade-in duration-300">
            {/* System Events */}
            {day.events.length > 0 && (
                <div className="space-y-3">
                    <h3 className="text-xs uppercase tracking-widest text-slate-500 font-medium mb-4">System Academic Events</h3>
                    {day.events.map(event => (
                        <div key={event.id} className="group bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors flex items-start justify-between">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 font-medium">SYSTEM</span>
                                    <h4 className="text-sm font-medium text-white">{event.title}</h4>
                                </div>
                                <p className="text-xs text-slate-400">{event.type.replace('_', ' ')}</p>
                            </div>

                            <button
                                onClick={() => onHideSystemEvent(event.id)}
                                className="opacity-0 group-hover:opacity-100 p-2 text-slate-500 hover:text-red-400 bg-black/20 hover:bg-black/40 rounded-lg transition-all"
                                title="Hide from my calendar"
                            >
                                <EyeOff className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Custom Add Event Section */}
            <div className="pt-4 border-t border-white/5">
                {!isAdding ? (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="w-full py-4 border border-dashed border-white/20 rounded-xl text-slate-400 hover:text-white hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all flex items-center justify-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Add Custom Event
                    </button>
                ) : (
                    <div className="bg-[#151821] border border-white/10 rounded-xl p-5 space-y-4">
                        <h3 className="text-sm font-medium text-white mb-2">New Event</h3>

                        <div>
                            <label className="text-xs text-slate-400 mb-1.5 block">Event Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                                placeholder="e.g. Minor Project Deadline"
                            />
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                            <button
                                onClick={() => setIsAdding(false)}
                                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    onAddEvent({ title });
                                    setIsAdding(false);
                                    setTitle("");
                                }}
                                className="px-3 py-1.5 bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 shadow-[0_0_15px_rgba(99,102,241,0.3)]"
                            >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Save
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
