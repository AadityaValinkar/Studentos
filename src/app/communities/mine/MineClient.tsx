"use client";

import { Users, Layers } from "lucide-react";
import CommunityCard from "@/components/communities/CommunityCard";
import Link from "next/link";

interface Community {
    id: string;
    name: string;
    slug: string;
    description: string;
    icon: string;
    member_count: number;
    is_private: boolean;
}

interface MineClientProps {
    joinedCommunities: Community[];
}

export default function MineClient({ joinedCommunities }: MineClientProps) {
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />
            </div>

            <div className="relative z-10 px-4 py-8 md:px-8 max-w-7xl mx-auto space-y-12 pb-24">
                <div className="space-y-4">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white flex items-center gap-4">
                        My Communities
                        <Layers className="w-8 h-8 text-indigo-400" />
                    </h1>
                    <p className="text-lg text-zinc-400 max-w-2xl leading-relaxed">
                        Spaces you are actively participating in.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {joinedCommunities.length > 0 ? (
                        joinedCommunities.map((community, index) => (
                            <CommunityCard
                                key={community.id}
                                community={community}
                                isJoined={true}
                                index={index}
                            />
                        ))
                    ) : (
                        <div className="col-span-full py-24 flex flex-col items-center justify-center text-center space-y-6 border border-dashed border-white/10 rounded-3xl bg-white/5">
                            <Users className="w-16 h-16 text-zinc-600 opacity-50" />
                            <div className="space-y-2">
                                <h3 className="text-2xl font-bold text-white tracking-tight">You haven&apos;t joined any spaces yet</h3>
                                <p className="text-zinc-500 max-w-sm mx-auto">
                                    Browse the discover tab to find communities that match your interests or create your own.
                                </p>
                            </div>
                            <Link href="/communities/discover">
                                <button className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-2xl transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)]">
                                    Discover Communities
                                </button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
