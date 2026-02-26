"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, ShieldCheck, ArrowRight } from "lucide-react";
import Link from "next/link";
import JoinButton from "./JoinButton";

interface CommunityCardProps {
    community: {
        id: string;
        name: string;
        slug: string;
        description: string;
        icon: string;
        is_private: boolean;
        community_members?: { count: number }[];
    };
    isJoined: boolean;
    index: number;
}

export default function CommunityCard({ community, isJoined, index }: CommunityCardProps) {
    const initialCount = community.community_members?.[0]?.count ?? 0;
    const [optimisticJoined, setOptimisticJoined] = useState(isJoined);
    const [currentCount, setCurrentCount] = useState(initialCount);

    useEffect(() => {
        setOptimisticJoined(isJoined);
        setCurrentCount(initialCount);
    }, [isJoined, initialCount]);

    const handleJoinSuccess = () => {
        setOptimisticJoined(true);
        setCurrentCount(prev => prev + 1);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.4, ease: "easeOut" }}
            className="group relative flex flex-col justify-between glass-card p-6"
        >


            <div className="space-y-4 relative z-10 w-full mb-8">
                <div className="flex items-start justify-between w-full">
                    <div className="w-16 h-16 rounded-2xl bg-bg-main border border-border-muted flex items-center justify-center text-4xl shadow-inner relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span className="relative z-10">{community.icon}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-accent-soft px-3 py-1.5 rounded-full border border-accent/10 overflow-hidden">
                        <Users className="w-3.5 h-3.5 text-accent-primary" />
                        <AnimatePresence mode="popLayout">
                            <motion.span
                                key={currentCount}
                                initial={{ y: -20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: 20, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="text-xs font-bold tracking-wide text-accent-primary inline-block min-w-[12px]"
                            >
                                {currentCount}
                            </motion.span>
                        </AnimatePresence>
                    </div>
                </div>

                <div className="space-y-2">
                    <h3 className="text-xl font-bold text-text-main tracking-tight flex items-center gap-2">
                        {community.name}
                        {community.is_private && <ShieldCheck className="w-4 h-4 text-purple-400" />}
                    </h3>
                    <p className="text-sm text-text-muted leading-relaxed font-medium line-clamp-3">
                        {community.description}
                    </p>
                </div>
            </div>

            <div className="pt-4 border-t border-white/5 relative z-10 w-full mt-auto shrink-0 flex items-end">
                {optimisticJoined ? (
                    <Link
                        href={`/communities/${community.slug}`}
                        className="w-full"
                    >
                        <button className="w-full flex items-center justify-center gap-2 py-3 bg-accent-soft hover:bg-accent/20 text-accent-primary font-bold rounded-2xl transition-all border border-accent/10 group/btn">
                            Visit Space
                            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                    </Link>
                ) : (
                    <JoinButton
                        communityId={community.id}
                        communitySlug={community.slug}
                        className="w-full py-3"
                        onJoinSuccess={handleJoinSuccess}
                    />
                )}
            </div>
        </motion.div>
    );
}
