"use client";

import { useState } from "react";
import { Target, Plus, Briefcase, GraduationCap, Code, Calendar, Loader2 } from "lucide-react";
import { supabaseClient } from "@/lib/supabase-client";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";

interface GoalsSectionProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    initialTargets: any[];
    userId: string;
}

export function GoalsSection({ initialTargets, userId }: GoalsSectionProps) {
    const [targets, setTargets] = useState(initialTargets);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [newGoal, setNewGoal] = useState({
        title: "",
        type: "skill",
        target_value: "",
        deadline: ""
    });

    const handleAddGoal = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabaseClient
                .from("academic_targets")
                .insert({
                    user_id: userId,
                    title: newGoal.title,
                    type: newGoal.type,
                    target_value: parseFloat(newGoal.target_value),
                    deadline: newGoal.deadline
                })
                .select()
                .single();

            if (error) throw error;
            setTargets([...targets, data]);
            setIsModalOpen(false);
            setNewGoal({ title: "", type: "skill", target_value: "", deadline: "" });
        } catch (error) {
            console.error("Error adding goal:", error);
        } finally {
            setLoading(false);
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'cgpa': return GraduationCap;
            case 'placement': return Briefcase;
            case 'internship': return Briefcase;
            case 'skill': return Code;
            default: return Target;
        }
    };

    return (
        <section className="space-y-6">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <Target className="w-6 h-6 text-accent-primary" strokeWidth={2.5} />
                    <h2 className="text-2xl font-bold text-text-primary tracking-tight">Your Goals</h2>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-12 h-12 rounded-2xl bg-accent-soft border border-accent-primary/20 flex items-center justify-center text-accent-primary hover:bg-accent-primary hover:text-white transition-all shadow-lg shadow-accent-primary/10 active:scale-95"
                >
                    <Plus className="w-6 h-6" strokeWidth={2.5} />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {targets.map((target, idx) => {
                    const Icon = getTypeIcon(target.type);
                    return (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            key={target.id}
                            className="glass-panel p-8 group hover:border-accent-primary/30 transition-all duration-500 relative overflow-hidden flex flex-col justify-between"
                        >
                            {/* Background Glow (Dark Only) */}
                            <div className="absolute top-0 right-0 w-24 h-24 bg-accent-primary/5 rounded-full blur-2xl pointer-events-none hidden dark:block" />
                            <div className="flex justify-between items-start mb-6 relative z-10">
                                <div className="p-4 bg-bg-base rounded-2xl border border-border-muted text-accent-primary shadow-sm">
                                    <Icon className="w-5 h-5" strokeWidth={2.5} />
                                </div>
                                <div className="text-right">
                                    <span className="text-[10px] uppercase tracking-[0.2em] text-text-muted font-bold opacity-40">
                                        {target.type}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-2 relative z-10">
                                <h3 className="text-xl font-bold text-text-primary tracking-tight">{target.title}</h3>
                                <div className="flex items-center gap-2 text-accent-primary/60 text-[10px] font-bold uppercase tracking-widest">
                                    <Calendar className="w-3.5 h-3.5" />
                                    {target.deadline && !isNaN(new Date(target.deadline).getTime()) ? format(new Date(target.deadline), "MMM d, yyyy") : 'No deadline'}
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-border-muted/50 flex items-end justify-between relative z-10">
                                <div className="space-y-1">
                                    <p className="text-[10px] uppercase tracking-[0.2em] text-text-muted font-bold opacity-40">Target Value</p>
                                    <p className="text-2xl font-black text-text-primary font-accent">{target.target_value || 'Active'}</p>
                                </div>
                                <div className="w-24 h-1.5 bg-bg-base rounded-full overflow-hidden border border-border-muted/20">
                                    <div className="h-full bg-accent-primary w-1/3 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Add Goal Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-bg-base/60 backdrop-blur-md p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="w-full max-w-lg bg-bg-card border border-border-muted rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative overflow-hidden"
                        >
                            {/* Background Decor (Dark Only) */}
                            <div className="absolute top-0 right-0 w-48 h-48 bg-accent-primary/5 rounded-full blur-[80px] -mr-24 -mt-24 pointer-events-none hidden dark:block" />

                            <h3 className="text-2xl font-bold text-text-primary mb-8 tracking-tight relative z-10">Add New Goal</h3>
                            <div className="space-y-6 relative z-10">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] pl-1 opacity-60">Goal Title</label>
                                    <input
                                        type="text"
                                        placeholder="Secure 8.5 CGPA"
                                        value={newGoal.title}
                                        onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                                        className="w-full bg-bg-base border border-border-muted rounded-2xl p-5 text-text-primary focus:border-accent-primary focus:ring-1 focus:ring-accent-primary outline-none transition-all placeholder:text-text-muted/30 font-medium"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] pl-1 opacity-60">Type</label>
                                        <select
                                            value={newGoal.type}
                                            onChange={(e) => setNewGoal({ ...newGoal, type: e.target.value })}
                                            className="w-full bg-bg-base border border-border-muted rounded-2xl p-5 text-text-primary focus:border-accent-primary focus:ring-1 focus:ring-accent-primary outline-none transition-all font-medium appearance-none"
                                        >
                                            <option value="skill" className="bg-bg-card">Skill</option>
                                            <option value="placement" className="bg-bg-card">Placement</option>
                                            <option value="cgpa" className="bg-bg-card">CGPA</option>
                                            <option value="internship" className="bg-bg-card">Internship</option>
                                        </select>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] pl-1 opacity-60">Target Value</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            placeholder="8.5"
                                            value={newGoal.target_value}
                                            onChange={(e) => setNewGoal({ ...newGoal, target_value: e.target.value })}
                                            className="w-full bg-bg-base border border-border-muted rounded-2xl p-5 text-text-primary focus:border-accent-primary focus:ring-1 focus:ring-accent-primary outline-none transition-all placeholder:text-text-muted/30 font-medium"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] pl-1 opacity-60">Deadline</label>
                                    <input
                                        type="date"
                                        value={newGoal.deadline}
                                        onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                                        className="w-full bg-bg-base border border-border-muted rounded-2xl p-5 text-text-primary focus:border-accent-primary focus:ring-1 focus:ring-accent-primary outline-none transition-all font-medium"
                                    />
                                </div>
                            </div>

                            <div className="mt-12 flex gap-4 relative z-10">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-8 py-5 rounded-2xl bg-bg-base border border-border-muted text-text-muted hover:text-text-primary font-bold uppercase tracking-[0.2em] text-[11px] transition-all active:scale-95"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAddGoal}
                                    disabled={loading || !newGoal.title}
                                    className="flex-1 px-8 py-5 rounded-2xl bg-accent-primary hover:bg-accent-primary/90 text-white font-bold uppercase tracking-[0.1em] text-[11px] transition-all shadow-xl shadow-accent-primary/20 disabled:opacity-50 active:scale-95 flex items-center justify-center gap-2"
                                >
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Goal"}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </section>
    );
}
