"use client";

/**
 * @author: @dorianbaffier
 * @description: Avatar Picker
 * @version: 2.0.0
 * @date: 2026-02-22
 * @license: MIT
 * @website: https://kokonutui.com
 * @github: https://github.com/kokonut-labs/kokonutui
 */

import type { Variants } from "framer-motion";
import { Check, ChevronRight } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Avatar {
    id: number;
    svg: string;
    alt: string;
}

// RGB values for the per-avatar color ring on the stage
const AVATAR_RGB: Record<number, string> = {
    1: "255, 0, 91",
    2: "255, 125, 16",
    3: "255, 0, 91",
    4: "137, 252, 179",
};

const avatars: Avatar[] = [
    {
        id: 1,
        svg: "https://api.dicebear.com/8.x/avataaars/svg?seed=Felix",
        alt: "Avatar 1",
    },
    {
        id: 2,
        svg: "https://api.dicebear.com/8.x/avataaars/svg?seed=Robert",
        alt: "Avatar 2",
    },
    {
        id: 3,
        svg: "https://api.dicebear.com/8.x/avataaars/svg?seed=Jane",
        alt: "Avatar 3",
    },
    {
        id: 4,
        svg: "https://api.dicebear.com/8.x/avataaars/svg?seed=Pat",
        alt: "Avatar 4",
    },
];

interface ProfileSetupProps {
    onComplete?: (data: { username: string; avatarId: number; avatarUrl: string; }) => void;
    className?: string;
}

const containerVariants: Variants = {
    initial: { opacity: 0 },
    animate: {
        opacity: 1,
        transition: { staggerChildren: 0.06, delayChildren: 0.05 },
    },
};

const thumbnailVariants: Variants = {
    initial: { opacity: 0, y: 6 },
    animate: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.28, ease: "easeOut" },
    },
};

export default function ProfileSetup({
    onComplete,
    className,
}: ProfileSetupProps) {
    const [selectedAvatar, setSelectedAvatar] = useState<Avatar>(avatars[0]);
    const [username, setUsername] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const shouldReduceMotion = useReducedMotion();

    const handleAvatarSelect = (avatar: Avatar) => {
        if (avatar.id === selectedAvatar.id) return;
        setSelectedAvatar(avatar);
    };

    const handleSubmit = () => {
        if (username.trim() && onComplete) {
            onComplete({
                username: username.trim(),
                avatarId: selectedAvatar.id,
                avatarUrl: selectedAvatar.svg,
            });
        }
    };

    const isValid = username.trim().length >= 3;
    const showError = username.trim().length > 0 && username.trim().length < 3;
    const rgb = AVATAR_RGB[selectedAvatar.id];

    return (
        <Card
            className={cn(
                "relative mx-auto w-full border-border bg-black/80 backdrop-blur-3xl text-white border-white/10 rounded-3xl",
                className
            )}
        >
            <CardContent className="p-8">
                <div className="space-y-8">
                    {/* Header */}
                    <div className="space-y-1 text-center">
                        <h2 className="font-semibold text-2xl tracking-tight text-white mb-2">
                            Claim Your Identity
                        </h2>
                        <p className="text-zinc-400 text-sm max-w-[250px] mx-auto">
                            Your identity is permanent. Pick a global alias for public discussions.
                        </p>
                    </div>

                    {/* Avatar Stage */}
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative h-40 w-40">
                            <motion.div
                                animate={{
                                    boxShadow: `0 0 0 2px rgba(${rgb}, 0.55), 0 6px 24px rgba(${rgb}, 0.18)`,
                                }}
                                aria-hidden="true"
                                className="pointer-events-none absolute inset-0 rounded-full"
                                transition={
                                    shouldReduceMotion
                                        ? { duration: 0 }
                                        : { duration: 0.45, ease: "easeOut" }
                                }
                            />

                            <div className="relative h-full w-full overflow-hidden rounded-full bg-indigo-500/10 flex items-center justify-center">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={selectedAvatar.id}
                                        animate={{ opacity: 1 }}
                                        className="absolute inset-0 flex items-center justify-center"
                                        exit={{ opacity: 0 }}
                                        initial={{ opacity: 0 }}
                                        transition={
                                            shouldReduceMotion
                                                ? { duration: 0 }
                                                : { duration: 0.2, ease: "easeOut" }
                                        }
                                    >
                                        <img src={selectedAvatar.svg} alt={selectedAvatar.alt} className="w-full h-full object-cover" />
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.span
                                animate={{ opacity: 1 }}
                                className="text-[11px] tracking-[0.12em] text-zinc-500 font-bold uppercase"
                                exit={{ opacity: 0 }}
                                initial={{ opacity: 0 }}
                                key={selectedAvatar.id}
                                transition={
                                    shouldReduceMotion
                                        ? { duration: 0 }
                                        : { duration: 0.16, ease: "easeOut" }
                                }
                            >
                                {selectedAvatar.alt}
                            </motion.span>
                        </AnimatePresence>

                        <motion.div
                            animate="animate"
                            className="flex gap-3"
                            initial="initial"
                            variants={containerVariants}
                        >
                            {avatars.map((avatar) => {
                                const isSelected = selectedAvatar.id === avatar.id;
                                return (
                                    <motion.button
                                        aria-label={`Select ${avatar.alt}`}
                                        aria-pressed={isSelected}
                                        className={cn(
                                            "relative h-14 w-14 overflow-hidden rounded-full border bg-black/20 transition-[opacity,box-shadow] duration-200 ease-out",
                                            isSelected
                                                ? "border-indigo-500 opacity-100 ring-2 ring-indigo-500/50 ring-offset-2 ring-offset-[#0a0a0a]"
                                                : "border-white/10 opacity-50 hover:opacity-100"
                                        )}
                                        key={avatar.id}
                                        onClick={() => handleAvatarSelect(avatar)}
                                        type="button"
                                        variants={thumbnailVariants}
                                        whileHover={shouldReduceMotion ? {} : { scale: 1.06 }}
                                        whileTap={shouldReduceMotion ? {} : { scale: 0.94 }}
                                    >
                                        <div className="absolute inset-0 flex items-center justify-center bg-indigo-500/5">
                                            <img src={avatar.svg} alt={avatar.alt} className="w-full h-full object-cover" />
                                        </div>
                                        {isSelected && (
                                            <div className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-500">
                                                <Check aria-hidden="true" className="h-2.5 w-2.5 text-white" />
                                            </div>
                                        )}
                                    </motion.button>
                                );
                            })}
                        </motion.div>
                    </div>

                    <div className="space-y-6 pt-4">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between px-1">
                                <label className="font-semibold text-zinc-300 text-sm" htmlFor="username">
                                    Global Alias
                                </label>
                                <span
                                    className={cn(
                                        "text-xs tabular-nums transition-colors duration-200 ease-out font-medium",
                                        username.length >= 18
                                            ? "text-amber-500"
                                            : "text-zinc-500"
                                    )}
                                >
                                    {username.length}/20
                                </span>
                            </div>

                            <div className="relative">
                                <Input
                                    autoComplete="username"
                                    className={cn(
                                        "h-14 pl-10 text-base bg-white/5 border border-white/10 text-white placeholder:text-zinc-600 rounded-2xl focus-visible:ring-indigo-500 focus:border-indigo-500/50",
                                        showError && "border-red-500/50 focus-visible:ring-red-500"
                                    )}
                                    id="username"
                                    maxLength={20}
                                    name="username"
                                    onBlur={() => setIsFocused(false)}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                                    onFocus={() => setIsFocused(true)}
                                    placeholder="MidnightCoder"
                                    spellCheck={false}
                                    type="text"
                                    value={username}
                                />
                                <span className={cn(
                                    "absolute left-4 top-1/2 -translate-y-1/2 font-medium transition-colors",
                                    isFocused ? "text-white" : "text-zinc-500"
                                )}>@</span>
                            </div>

                            <AnimatePresence>
                                {showError && (
                                    <motion.p
                                        animate={{ opacity: 1, y: 0 }}
                                        className="ml-1 text-xs text-red-400 font-medium"
                                        exit={{ opacity: 0, y: -4 }}
                                        initial={{ opacity: 0, y: -4 }}
                                        role="alert"
                                        transition={{ duration: 0.15, ease: "easeOut" }}
                                    >
                                        Alias must be at least 3 characters
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </div>

                        <Button
                            className="group h-14 w-full text-base font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.3)] disabled:opacity-50 disabled:shadow-none"
                            disabled={!isValid}
                            onClick={handleSubmit}
                            type="button"
                        >
                            Enter StudentOS
                            <ChevronRight
                                aria-hidden="true"
                                className="ml-2 h-5 w-5 transition-transform duration-200 ease-out group-hover:translate-x-1"
                            />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
