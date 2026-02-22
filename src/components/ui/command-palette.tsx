"use client";

import { useEffect, useState } from "react";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { Calendar, Home, Map, Activity, Settings, X, Search } from "lucide-react";
import { useSession } from "next-auth/react";

export function CommandPalette() {
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const { data: session } = useSession();

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    const runCommand = (command: () => void) => {
        setOpen(false);
        command();
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] sm:pt-[25vh]">
            <div
                className="fixed inset-0 bg-black/40 backdrop-blur-sm"
                onClick={() => setOpen(false)}
            />

            <Command
                className="relative w-full max-w-xl mx-4 overflow-hidden rounded-2xl bg-[#0B0B0D]/90 border border-white/10 shadow-[0_16px_60px_rgba(0,0,0,0.5)] backdrop-blur-3xl animate-in fade-in zoom-in-95 duration-200"
            >
                <div className="flex items-center px-4 border-b border-white/10">
                    <Search className="w-5 h-5 text-slate-500 mr-2" />
                    <Command.Input
                        placeholder="Search or jump to..."
                        className="w-full h-14 bg-transparent text-white placeholder:text-slate-500 focus:outline-none font-light tracking-wide text-lg"
                        autoFocus
                    />
                    <button onClick={() => setOpen(false)} className="text-slate-500 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <Command.List className="max-h-[300px] overflow-y-auto p-2 no-scrollbar">
                    <Command.Empty className="py-6 text-center text-sm text-slate-500 font-light tracking-wide">
                        No results found.
                    </Command.Empty>

                    <Command.Group heading="Navigation" className="text-xs font-medium text-slate-500 px-2 py-3 tracking-widest uppercase [&_[cmdk-group-heading]]:mb-2">
                        <Command.Item
                            onSelect={() => runCommand(() => router.push("/"))}
                            className="flex items-center gap-3 px-3 py-3 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-xl cursor-pointer aria-selected:bg-white/5 aria-selected:text-white transition-colors"
                        >
                            <Home className="w-4 h-4 text-indigo-400" />
                            Dashboard
                        </Command.Item>
                        <Command.Item
                            onSelect={() => runCommand(() => router.push("/calendar"))}
                            className="flex items-center gap-3 px-3 py-3 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-xl cursor-pointer aria-selected:bg-white/5 aria-selected:text-white transition-colors"
                        >
                            <Calendar className="w-4 h-4 text-indigo-400" />
                            Academic Calendar
                        </Command.Item>
                        <Command.Item
                            onSelect={() => runCommand(() => router.push("/roadmap"))}
                            className="flex items-center gap-3 px-3 py-3 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-xl cursor-pointer aria-selected:bg-white/5 aria-selected:text-white transition-colors"
                        >
                            <Map className="w-4 h-4 text-indigo-400" />
                            Career Strategy
                        </Command.Item>
                    </Command.Group>

                    <Command.Group heading="Actions" className="text-xs font-medium text-slate-500 px-2 py-3 tracking-widest uppercase border-t border-white/5 [&_[cmdk-group-heading]]:mb-2 mt-1">
                        <Command.Item
                            onSelect={() => runCommand(() => alert("Goal creation module not configured yet."))}
                            className="flex items-center gap-3 px-3 py-3 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-xl cursor-pointer aria-selected:bg-white/5 aria-selected:text-white transition-colors"
                        >
                            <Activity className="w-4 h-4 text-slate-400" />
                            Add New Goal
                        </Command.Item>
                        {session && (
                            <Command.Item
                                onSelect={() => runCommand(() => router.push("/settings"))}
                                className="flex items-center gap-3 px-3 py-3 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-xl cursor-pointer aria-selected:bg-white/5 aria-selected:text-white transition-colors"
                            >
                                <Settings className="w-4 h-4 text-slate-400" />
                                User Settings
                            </Command.Item>
                        )}
                    </Command.Group>
                </Command.List>
            </Command>
        </div>
    );
}
