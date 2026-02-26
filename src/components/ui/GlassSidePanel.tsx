"use client";

import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";

interface GlassSidePanelProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export function GlassSidePanel({ isOpen, onClose, title, children }: GlassSidePanelProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={onClose}
                        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
                    />

                    {/* Sliding Panel */}
                    <motion.div
                        initial={{ x: "100%", opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: "100%", opacity: 0 }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-full max-w-md z-[60] bg-white dark:glass-panel border-l border-slate-200 dark:border-white/10 shadow-[-8px_0_32px_rgba(0,0,0,0.08)] dark:shadow-2xl flex flex-col"
                    >
                        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-white/5 shrink-0">
                            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">{title}</h2>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-full bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                            {children}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
