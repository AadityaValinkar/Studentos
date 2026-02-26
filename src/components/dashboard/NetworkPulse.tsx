"use client";
import { MessageSquare, Users, Briefcase, Zap } from "lucide-react";
import { motion } from "framer-motion";

export function NetworkPulse() {
    // These would ideally come from real-time community engagement logic
    const signals = [
        { id: 1, text: "18 students discussing Mid Sem", icon: MessageSquare, color: "text-amber-400" },
        { id: 2, text: "32 students tracking GATE 2026", icon: Users, color: "text-accent-primary" },
        { id: 3, text: "4 new internships added this week", icon: Briefcase, color: "text-emerald-400" },
        { id: 4, text: "Gaming tournament this Friday", icon: Zap, color: "text-purple-400" }
    ];

    return (
        <section className="space-y-6 pt-4">
            <div className="flex items-center gap-3 opacity-60">
                <div className="w-1.5 h-1.5 rounded-full bg-accent-primary animate-pulse" />
                <h2 className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Network Pulse</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {signals.map((signal, idx) => (
                    <motion.div
                        key={signal.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="glass-panel p-4 flex items-center gap-4 group hover:border-accent-primary/20 transition-all cursor-default"
                    >
                        <div className={`p-2 rounded-xl bg-bg-main border border-border-muted group-hover:scale-110 transition-transform ${signal.color}`}>
                            <signal.icon className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-medium text-text-muted group-hover:text-text-main transition-colors">
                            {signal.text}
                        </span>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
