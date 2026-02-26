"use client";

import { useState } from "react";
import { supabaseClient } from "@/lib/supabase-client";
import { motion, AnimatePresence } from "framer-motion";
import ProfileSetup from "./profile-setup";

export function UsernameSetupModal({ isOpen }: { isOpen: boolean }) {
    const [error, setError] = useState("");

    const handleComplete = async (data: { username: string; avatarId: number; avatarUrl: string }) => {
        setError("");

        const { data: { user } } = await supabaseClient.auth.getUser();

        if (!user) {
            setError("Not authenticated. Please reload the page.");
            return;
        }

        const { error: dbError } = await supabaseClient
            .from("profiles")
            .insert({
                id: user.id,
                global_username: data.username,
                avatar_url: data.avatarUrl,
            });

        if (dbError) {
            if (dbError.code === "23505") {
                setError("This alias is already taken.");
            } else {
                setError("An error occurred: " + dbError.message);
            }
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
                        className="w-full max-w-md relative"
                    >
                        {error && (
                            <div className="absolute -top-12 left-0 right-0 bg-red-500/10 border border-red-500/20 text-red-500 font-medium px-4 py-2 rounded-xl text-center text-sm backdrop-blur-md">
                                {error}
                            </div>
                        )}
                        <ProfileSetup onComplete={handleComplete} />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
