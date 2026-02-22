"use client";

import { useState, useEffect } from "react";
import { supabaseClient } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";
import { Loader2, UserCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function UsernameSetupModal({ isOpen }: { isOpen: boolean }) {
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (username.length < 3 || username.length > 20) {
            setError("Username must be between 3 and 20 characters.");
            return;
        }
        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            setError("Only letters, numbers, and underscores allowed.");
            return;
        }

        setLoading(true);
        const { data: { session } } = await supabaseClient.auth.getSession();

        if (!session?.user) {
            setError("Not authenticated. Please reload the page.");
            setLoading(false);
            return;
        }

        const { error: dbError } = await supabaseClient
            .from("profiles")
            .insert({
                id: session.user.id,
                global_username: username,
                avatar_url: session.user.user_metadata?.avatar_url || null,
            });

        if (dbError) {
            if (dbError.code === "23505") {
                setError("This alias is already taken.");
            } else {
                setError("An error occurred: " + dbError.message);
            }
            setLoading(false);
            return;
        }

        // Hard refresh to re-evaluate RootLayout session
        window.location.reload();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
                    >
                        {/* Decorative glow */}
                        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50"></div>

                        <div className="flex flex-col items-center text-center mb-8">
                            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-6">
                                <UserCircle className="w-8 h-8 text-indigo-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-white tracking-tight mb-2">Claim Your Identity</h2>
                            <p className="text-zinc-400 text-sm leading-relaxed max-w-sm">
                                Welcome to StudentOS Communities. Your identity is permanently protected. Pick a global alias for public discussions.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-medium select-none">@</span>
                                    <input
                                        type="text"
                                        placeholder="MidnightCoder"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        maxLength={20}
                                        className="w-full pl-9 pr-4 py-4 bg-white/5 border border-white/10 focus:border-indigo-500/50 focus:bg-white/10 rounded-2xl outline-none text-white transition-all placeholder:text-zinc-600 font-medium tracking-tight"
                                        disabled={loading}
                                        autoFocus
                                    />
                                </div>
                                {error && (
                                    <motion.p
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="text-sm text-red-400 font-medium px-1"
                                    >
                                        {error}
                                    </motion.p>
                                )}
                                <p className="text-xs text-zinc-500 px-1 font-medium">Names are permanent and cannot be changed later.</p>
                            </div>

                            <button
                                type="submit"
                                disabled={loading || username.length < 3}
                                className="w-full flex items-center justify-center gap-2 py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-white/5 disabled:text-zinc-500 text-white font-semibold rounded-2xl transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] disabled:shadow-none"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Enter StudentOS"}
                            </button>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
