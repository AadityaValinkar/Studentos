"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabaseClient } from "@/lib/supabase-client";
import { Users, ShieldCheck, ArrowRight, Loader2, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Community {
    id: string;
    name: string;
    description: string;
    icon: string;
    member_count: number;
    is_private: boolean;
}

interface CommunitiesClientProps {
    initialCommunities: Community[];
    initialJoinedIds: string[];
    userId: string;
}

export default function CommunitiesClient({ initialCommunities, initialJoinedIds, userId }: CommunitiesClientProps) {
    const [joinedIds, setJoinedIds] = useState<Set<string>>(new Set(initialJoinedIds));
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const router = useRouter();

    const handleJoin = async (communityId: string) => {
        setLoadingId(communityId);

        try {
            const { error } = await supabaseClient
                .from("community_members")
                .insert({
                    community_id: communityId,
                    user_id: userId,
                    // role defaults to 'member', community_alias defaults to null
                });

            if (error) {
                if (error.code === "23505") {
                    // Already joined, safe to update UI
                    setJoinedIds(prev => new Set(prev).add(communityId));
                } else {
                    console.error("Failed to join community:", error.message);
                }
            } else {
                setJoinedIds(prev => new Set(prev).add(communityId));

                // Optionally refetch user data or router.push to the community
                router.push(`/communities/${communityId}`);
            }
        } finally {
            setLoadingId(null);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 relative z-10 w-full">
            <AnimatePresence>
                {initialCommunities.map((community, index) => {
                    const isJoined = joinedIds.has(community.id);
                    const isJoining = loadingId === community.id;

                    return (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05, duration: 0.4, ease: "easeOut" }}
                            key={community.id}
                            className="group relative flex flex-col justify-between bg-zinc-900/40 backdrop-blur-xl border border-white/5 hover:border-indigo-500/30 rounded-3xl p-6 shadow-2xl overflow-hidden transition-all hover:shadow-[0_0_40px_rgba(79,70,229,0.15)]"
                        >
                            {/* Card Glow Highlight */}
                            <div className="absolute top-0 right-0 p-32 bg-indigo-500/10 blur-[100px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                            <div className="space-y-4 relative z-10 w-full mb-8">
                                <div className="flex items-start justify-between w-full">
                                    <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-4xl shadow-inner relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <span className="relative z-10">{community.icon}</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-full border border-white/5">
                                        <Users className="w-3.5 h-3.5 text-zinc-400" />
                                        <span className="text-xs font-semibold tracking-wide text-zinc-300">
                                            {community.member_count}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                                        {community.name}
                                        {community.is_private && <ShieldCheck className="w-4 h-4 text-purple-400" />}
                                    </h3>
                                    <p className="text-sm text-zinc-400 leading-relaxed font-medium line-clamp-3">
                                        {community.description}
                                    </p>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-white/5 relative z-10 w-full mt-auto shrink-0 flex items-end">
                                {isJoined ? (
                                    <Link
                                        href={`/communities/${community.id}`}
                                        className="w-full"
                                    >
                                        <button className="w-full flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-2xl transition-all border border-transparent hover:border-white/10 group/btn">
                                            Visit Space
                                            <ArrowRight className="w-4 h-4 text-zinc-400 group-hover/btn:text-white transition-colors group-hover/btn:translate-x-1" />
                                        </button>
                                    </Link>
                                ) : (
                                    <button
                                        onClick={() => handleJoin(community.id)}
                                        disabled={isJoining}
                                        className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-white/5 disabled:text-zinc-500 text-white font-semibold rounded-2xl transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] disabled:shadow-none"
                                    >
                                        {isJoining ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <>
                                                <Plus className="w-4 h-4" />
                                                Join Community
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </AnimatePresence>

            {/* Empty state fallback if script hasn't seeded yet */}
            {initialCommunities.length === 0 && (
                <div className="col-span-full py-24 flex flex-col items-center justify-center text-center space-y-4 border border-dashed border-white/10 rounded-3xl bg-white/5">
                    <Users className="w-12 h-12 text-zinc-500" />
                    <div className="space-y-1">
                        <h3 className="text-xl font-bold text-white tracking-tight">No Communities Yet</h3>
                        <p className="text-zinc-400 max-w-sm">
                            The administrator needs to run the pre-seeding SQL script to generate the default campus communities.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
