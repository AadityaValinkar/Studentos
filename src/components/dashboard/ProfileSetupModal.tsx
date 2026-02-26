"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    User,
    BarChart3,
    Briefcase,
    ArrowRight,
    CheckCircle2,
    Loader2
} from "lucide-react";
import { supabaseClient } from "@/lib/supabase-client";
import { cn } from "@/lib/utils";

interface ProfileSetupModalProps {
    isOpen: boolean;
    userId: string;
    onComplete: () => void;
}

const steps = [
    { id: 1, title: "Basic Info", icon: User },
    { id: 2, title: "Academic Stats", icon: BarChart3 },
    { id: 3, title: "Career Goals", icon: Briefcase },
];

export function ProfileSetupModal({ isOpen, userId, onComplete }: ProfileSetupModalProps) {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        full_name: "",
        semester: 1,
        cgpa: "",
        attendance: "",
        target_cgpa: "",
        primary_goal: "Software"
    });

    const goals = [
        "Software",
        "Core Engineering",
        "Higher Studies",
        "GATE / UPSC",
        "Entrepreneurship"
    ];

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const { error } = await supabaseClient
                .from("profiles")
                .update({
                    full_name: formData.full_name,
                    semester: parseInt(String(formData.semester)),
                    cgpa: parseFloat(formData.cgpa),
                    attendance: parseFloat(formData.attendance),
                    target_cgpa: parseFloat(formData.target_cgpa),
                    target_roles: [formData.primary_goal],
                    profile_completed: true,
                    semester_end_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // Default 90 days
                })
                .eq("id", userId);

            if (error) {
                console.error("Supabase Profile Update Error:", error);
                throw error;
            }

            // Create welcome notification
            const { error: notifyError } = await supabaseClient.from("notifications").insert({
                user_id: userId,
                title: "Welcome to StudentOS!",
                message: "Your academic profile is ready. Start tracking your momentum!",
            });

            if (notifyError) {
                console.error("Supabase Notification Insert Error:", notifyError);
            }

            onComplete();
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to save profile. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-bg-base/60 backdrop-blur-md p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="w-full max-w-2xl bg-bg-card border border-border-muted rounded-[2.5rem] overflow-hidden shadow-2xl relative"
            >
                {/* Background Decor (Dark Only) */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent-primary/5 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none hidden dark:block" />

                {/* Progress Header */}
                <div className="bg-bg-base/50 backdrop-blur-sm border-b border-border-muted p-8 md:p-10 relative z-10">
                    <div className="flex justify-between items-center mb-0">
                        <div>
                            <h2 className="text-2xl font-bold text-text-primary tracking-tight">Complete Your Profile</h2>
                            <p className="text-text-muted text-sm font-medium mt-1">Let&apos;s personalize your academic dashboard.</p>
                        </div>
                        <div className="flex gap-3">
                            {steps.map((s) => (
                                <div
                                    key={s.id}
                                    className={cn(
                                        "w-12 h-12 rounded-2xl flex items-center justify-center transition-all border",
                                        step === s.id
                                            ? "bg-accent-primary text-white border-accent-primary/50 shadow-lg shadow-accent-primary/20"
                                            : step > s.id
                                                ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                                : "bg-bg-card text-text-muted border-border-muted opacity-40"
                                    )}
                                >
                                    {step > s.id ? <CheckCircle2 className="w-6 h-6" /> : <s.icon className="w-5 h-5 font-bold" />}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="p-8 md:p-10 relative z-10">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] pl-1 opacity-60">Full Name</label>
                                    <input
                                        type="text"
                                        placeholder="John Doe"
                                        value={formData.full_name}
                                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                        className="w-full bg-bg-base border border-border-muted rounded-2xl p-5 text-text-primary focus:border-accent-primary focus:ring-1 focus:ring-accent-primary outline-none transition-all placeholder:text-text-muted/30 font-medium"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] pl-1 opacity-60">Current Semester</label>
                                    <select
                                        value={formData.semester}
                                        onChange={(e) => setFormData({ ...formData, semester: parseInt(e.target.value) })}
                                        className="w-full bg-bg-base border border-border-muted rounded-2xl p-5 text-text-primary focus:border-accent-primary focus:ring-1 focus:ring-accent-primary outline-none transition-all font-medium appearance-none"
                                    >
                                        {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                                            <option key={n} value={n} className="bg-bg-card">Semester {n}</option>
                                        ))}
                                    </select>
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="grid grid-cols-2 gap-6"
                            >
                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] pl-1 opacity-60">Current CGPA</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        placeholder="8.50"
                                        value={formData.cgpa}
                                        onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })}
                                        className="w-full bg-bg-base border border-border-muted rounded-2xl p-5 text-text-primary focus:border-accent-primary focus:ring-1 focus:ring-accent-primary outline-none transition-all placeholder:text-text-muted/30 font-medium"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] pl-1 opacity-60">Attendance %</label>
                                    <input
                                        type="number"
                                        placeholder="85"
                                        value={formData.attendance}
                                        onChange={(e) => setFormData({ ...formData, attendance: e.target.value })}
                                        className="w-full bg-bg-base border border-border-muted rounded-2xl p-5 text-text-primary focus:border-accent-primary focus:ring-1 focus:ring-accent-primary outline-none transition-all placeholder:text-text-muted/30 font-medium"
                                    />
                                </div>
                                <div className="col-span-2 space-y-3">
                                    <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] pl-1 opacity-60">Target CGPA</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        placeholder="9.00"
                                        value={formData.target_cgpa}
                                        onChange={(e) => setFormData({ ...formData, target_cgpa: e.target.value })}
                                        className="w-full bg-bg-base border border-border-muted rounded-2xl p-5 text-text-primary focus:border-accent-primary focus:ring-1 focus:ring-accent-primary outline-none transition-all placeholder:text-text-muted/30 font-medium"
                                    />
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-4"
                            >
                                <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] pl-1 opacity-60">Primary Career Goal</label>
                                <div className="grid grid-cols-1 gap-3">
                                    {goals.map((g) => (
                                        <button
                                            key={g}
                                            onClick={() => setFormData({ ...formData, primary_goal: g })}
                                            className={cn(
                                                "p-5 rounded-2xl border text-left transition-all font-bold text-sm tracking-tight",
                                                formData.primary_goal === g
                                                    ? "bg-accent-soft border-accent-primary text-accent-primary shadow-sm"
                                                    : "bg-bg-base border-border-muted text-text-muted hover:bg-bg-card hover:border-border-subtle"
                                            )}
                                        >
                                            {g}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="mt-12 flex justify-between items-center">
                        <button
                            onClick={() => step > 1 && setStep(step - 1)}
                            className={cn(
                                "text-text-muted font-bold text-[11px] uppercase tracking-[0.2em] px-6 py-4 hover:text-text-primary transition-colors",
                                step === 1 && "invisible"
                            )}
                        >
                            Back
                        </button>
                        <button
                            onClick={() => step < 3 ? setStep(step + 1) : handleSubmit()}
                            disabled={loading}
                            className="bg-accent-primary hover:bg-accent-primary/90 text-white px-10 py-5 rounded-2xl font-bold uppercase tracking-[0.1em] text-[11px] flex items-center gap-3 transition-all shadow-xl shadow-accent-primary/20 disabled:opacity-50 active:scale-95"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    {step === 3 ? "Complete Setup" : "Continue"}
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
