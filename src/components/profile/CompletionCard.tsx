"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";


interface CompletionCardProps {
    percentage: number;
}

export default function CompletionCard({ percentage }: CompletionCardProps) {
    if (percentage >= 70) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden group"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent blur-3xl group-hover:opacity-100 transition-opacity duration-1000 opacity-50" />

            <div className="relative glass-panel p-8 rounded-[2.5rem] border border-white/10 bg-white/5 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                    <div className="w-20 h-20 rounded-3xl bg-indigo-500/20 flex items-center justify-center relative group-hover:scale-110 transition-transform duration-500">
                        <Sparkles className="w-10 h-10 text-indigo-400" />
                        <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-[10px] font-bold text-white shadow-lg">
                            {percentage}%
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h3 className="font-heading text-xl font-bold text-white tracking-tight">Complete Your Profile</h3>
                        <p className="text-zinc-400 text-sm max-w-sm">
                            Unlock personalized insights and community features by completing your academic profile.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col items-center md:items-end gap-4 w-full md:w-auto">
                    <div className="w-full md:w-64 h-3 bg-white/5 rounded-full overflow-hidden border border-white/5 p-[2px]">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full relative"
                        >
                            <div className="absolute inset-0 bg-white/20 animate-pulse" />
                        </motion.div>
                    </div>

                    <Link
                        href="/profile"
                        className="group/btn flex items-center gap-2 bg-white text-black px-8 py-3 rounded-2xl font-bold transition-all hover:bg-zinc-200 active:scale-95 shadow-xl shadow-white/5"
                    >
                        Update Profile
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}
