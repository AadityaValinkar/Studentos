"use client";

import { useState } from "react";
import { Users } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import CommunityCard from "@/components/communities/CommunityCard";

interface Community {
    id: string;
    name: string;
    slug: string;
    description: string;
    icon: string;
    is_private: boolean;
    community_members?: { count: number }[];
}

interface CommunitiesClientProps {
    initialCommunities: Community[];
    initialJoinedIds: string[];
}

export default function CommunitiesClient({ initialCommunities, initialJoinedIds }: CommunitiesClientProps) {
    const [joinedIds] = useState<Set<string>>(new Set(initialJoinedIds));

    // Sort communities by new member count logic
    const sortedCommunities = [...initialCommunities].sort((a, b) => {
        const countA = a.community_members?.[0]?.count ?? 0;
        const countB = b.community_members?.[0]?.count ?? 0;
        return countB - countA;
    });

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 relative z-10 w-full">
            <AnimatePresence>
                {sortedCommunities.map((community, index) => {
                    const isJoined = joinedIds.has(community.id);

                    return (
                        <CommunityCard
                            key={community.id}
                            community={community}
                            isJoined={isJoined}
                            index={index}
                        />
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
