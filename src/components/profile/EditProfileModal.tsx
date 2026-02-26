"use client";

import { useState } from "react";
import { X, Save, Loader2, CheckCircle2, User, GraduationCap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { supabaseClient as supabase } from "@/lib/supabase-client";

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    initialData: any;
    userId: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onUpdate: (data: any) => void;
}

export function EditProfileModal({ isOpen, onClose, initialData, userId, onUpdate }: EditProfileModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const [formData, setFormData] = useState({
        full_name: initialData?.full_name || "",
        global_username: initialData?.global_username || "",
        avatar_url: initialData?.avatar_url || "https://api.dicebear.com/8.x/avataaars/svg?seed=Felix",
        bio: initialData?.bio || "",
        branch: initialData?.branch || "",
        semester: initialData?.semester || 1,
    });

    const avatars = [
        { id: 1, svg: "https://api.dicebear.com/8.x/avataaars/svg?seed=Felix", alt: "Felix" },
        { id: 2, svg: "https://api.dicebear.com/8.x/avataaars/svg?seed=Robert", alt: "Robert" },
        { id: 3, svg: "https://api.dicebear.com/8.x/avataaars/svg?seed=Jane", alt: "Jane" },
        { id: 4, svg: "https://api.dicebear.com/8.x/avataaars/svg?seed=Pat", alt: "Pat" },
    ];

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const { error } = await supabase
                .from("profiles")
                .update({
                    full_name: formData.full_name,
                    global_username: formData.global_username,
                    avatar_url: formData.avatar_url,
                    bio: formData.bio,
                    branch: formData.branch,
                    semester: parseInt(formData.semester.toString()),
                })
                .eq("id", userId);

            if (error) throw error;

            onUpdate({ ...initialData, ...formData });
            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
                onClose();
            }, 1000);

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error("Profile save error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-2xl"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-2xl bg-bg-card border border-border-muted rounded-[2.5rem] shadow-2xl overflow-hidden dark:backdrop-blur-3xl"
                    >
                        <form onSubmit={handleSave} className="flex flex-col h-full max-h-[90vh]">
                            {/* Header */}
                            <div className="p-8 border-b border-border-muted flex items-center justify-between">
                                <div className="space-y-1">
                                    <h2 className="text-xl font-bold text-text-main tracking-tight">Personalize Profile</h2>
                                    <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest opacity-60">Update your identity and academic info.</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="p-2 text-text-muted hover:text-text-main transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Body (Scrollable) */}
                            <div className="p-8 overflow-y-auto space-y-8 no-scrollbar">
                                {/* Success Overlay */}
                                <AnimatePresence>
                                    {showSuccess && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="absolute inset-0 z-50 bg-bg-card/90 flex flex-col items-center justify-center space-y-4 dark:backdrop-blur-xl"
                                        >
                                            <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center">
                                                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                                            </div>
                                            <p className="text-emerald-500 font-bold uppercase tracking-[0.2em] text-xs">Profile Saved</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Identity Section */}
                                <section className="space-y-6">
                                    <div className="flex items-center gap-2 text-accent-primary">
                                        <User className="w-4 h-4" />
                                        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em]">Identity</h3>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                                        {/* Avatar Selection */}
                                        <div className="space-y-4 flex flex-col items-center">
                                            <div className="w-24 h-24 rounded-full p-0.5 bg-gradient-to-br from-accent-primary to-indigo-500/40">
                                                <div className="w-full h-full rounded-full overflow-hidden bg-bg-main shadow-inner">
                                                    <img src={formData.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                {avatars.map((ava) => (
                                                    <button
                                                        key={ava.id}
                                                        type="button"
                                                        onClick={() => setFormData({ ...formData, avatar_url: ava.svg })}
                                                        className={cn(
                                                            "w-8 h-8 rounded-full overflow-hidden border-2 transition-all",
                                                            formData.avatar_url === ava.svg ? "border-accent-primary" : "border-transparent opacity-40 hover:opacity-100"
                                                        )}
                                                    >
                                                        <img src={ava.svg} alt={ava.alt} className="w-full h-full object-cover" />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest pl-1 opacity-60">Display Name</label>
                                                <input
                                                    type="text"
                                                    value={formData.full_name}
                                                    onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                                                    className="w-full bg-bg-main border border-border-muted rounded-xl px-4 py-2.5 text-sm text-text-main focus:ring-1 focus:ring-accent-primary/30 transition-all outline-none font-bold"
                                                    placeholder="e.g. Felix Doe"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest pl-1 opacity-60">Custom Alias (@)</label>
                                                <input
                                                    type="text"
                                                    value={formData.global_username}
                                                    onChange={e => setFormData({ ...formData, global_username: e.target.value })}
                                                    className="w-full bg-bg-main border border-border-muted rounded-xl px-4 py-2.5 text-sm text-text-main focus:ring-1 focus:ring-accent-primary/30 transition-all outline-none font-bold"
                                                    placeholder="username"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest pl-1 opacity-60">Bio (Tagline)</label>
                                        <textarea
                                            value={formData.bio}
                                            onChange={e => setFormData({ ...formData, bio: e.target.value })}
                                            className="w-full bg-bg-main border border-border-muted rounded-xl px-4 py-2.5 text-sm text-text-main focus:ring-1 focus:ring-accent-primary/30 transition-all outline-none resize-none h-20 font-medium"
                                            placeholder="Write a short tagline..."
                                        />
                                    </div>
                                </section>

                                {/* Academic Section */}
                                <section className="space-y-6">
                                    <div className="flex items-center gap-2 text-accent-primary">
                                        <GraduationCap className="w-4 h-4" />
                                        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em]">Academic</h3>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2 col-span-2 md:col-span-1">
                                            <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest pl-1 opacity-60">Branch</label>
                                            <input
                                                type="text"
                                                value={formData.branch}
                                                onChange={e => setFormData({ ...formData, branch: e.target.value })}
                                                className="w-full bg-bg-main border border-border-muted rounded-xl px-4 py-2.5 text-sm text-text-main focus:ring-1 focus:ring-accent-primary/30 transition-all outline-none font-bold"
                                                placeholder="e.g. Computer Engineering"
                                            />
                                        </div>
                                        <div className="space-y-2 col-span-2 md:col-span-1">
                                            <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest pl-1 opacity-60">Semester</label>
                                            <select
                                                value={formData.semester}
                                                onChange={e => setFormData({ ...formData, semester: parseInt(e.target.value) })}
                                                className="w-full bg-bg-main border border-border-muted rounded-xl px-4 py-2.5 text-sm text-text-main focus:ring-1 focus:ring-accent-primary/30 transition-all outline-none appearance-none font-bold"
                                            >
                                                {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s} value={s} className="bg-bg-card">Semester {s}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                </section>
                            </div>

                            {/* Footer */}
                            <div className="p-8 border-t border-border-muted bg-bg-main flex items-center justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-6 py-2.5 text-[10px] font-bold text-text-muted hover:text-text-main transition-colors uppercase tracking-widest"
                                >
                                    Discard
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex items-center gap-2 bg-text-main text-bg-card px-8 py-2.5 rounded-xl font-bold transition-all disabled:opacity-50 shadow-xl shadow-text-main/10 hover:opacity-90"
                                >
                                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    Update Profile
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
