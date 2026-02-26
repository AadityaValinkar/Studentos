"use client";

import { useState } from "react";
import { Search, Compass, TrendingUp } from "lucide-react";
import CommunityCard from "@/components/communities/CommunityCard";
import PostFeed from "@/components/communities/PostFeed";
import { Input } from "@/components/ui/input";

interface Community {
    id: string;
    name: string;
    slug: string;
    description: string;
    icon: string;
    member_count: number;
    is_private: boolean;
}

interface Post {
    id: string;
    content: string;
    media_url: string | null;
    media_type: string | null;
    created_at: string;
    voteCount: number;
    isSupported: boolean;
    reactionCounts: Record<string, number>;
    myReaction: string | null;
    isSaved: boolean;
    author: {
        id: string;
        global_username: string;
        avatar_url: string | null;
    } | null;
    communities: {
        name: string;
        slug: string;
    } | null;
}

interface DiscoverClientProps {
    initialCommunities: Community[];
    posts: Post[];
    joinedSetIds: string[];
}

export default function DiscoverClient({ initialCommunities, posts, joinedSetIds }: DiscoverClientProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const joinedSet = new Set(joinedSetIds);

    const filteredCommunities = initialCommunities.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />
            </div>

            <div className="relative z-10 px-4 py-8 md:px-8 max-w-7xl mx-auto space-y-12 pb-24">
                {/* Header & Search */}
                <div className="space-y-6">
                    <div className="space-y-2">
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white flex items-center gap-4">
                            Discover
                            <Compass className="w-8 h-8 text-indigo-400" />
                        </h1>
                        <p className="text-lg text-zinc-400 max-w-2xl leading-relaxed">
                            Explore trending posts and find new campus spaces to join.
                        </p>
                    </div>

                    <div className="relative max-w-md group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" />
                        <Input
                            type="text"
                            placeholder="Search communities..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 h-14 bg-white/5 border-white/10 rounded-2xl focus:border-indigo-500/50 focus:bg-white/10 transition-all text-white placeholder:text-zinc-600"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left Column: Post Feed (Random/Trending) */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="w-5 h-5 text-emerald-400" />
                            <h2 className="text-xl font-bold text-white tracking-tight">Global Feed</h2>
                        </div>
                        <PostFeed posts={posts} anonymousMode={false} />
                    </div>

                    {/* Right Column: Suggested Communities */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 mb-2">
                            <Compass className="w-5 h-5 text-indigo-400" />
                            <h2 className="text-xl font-bold text-white tracking-tight">Communities</h2>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            {filteredCommunities.length > 0 ? (
                                filteredCommunities.map((community, index) => (
                                    <CommunityCard
                                        key={community.id}
                                        community={community}
                                        isJoined={joinedSet.has(community.id)}
                                        index={index}
                                    />
                                ))
                            ) : (
                                <div className="p-8 text-center bg-zinc-900/40 border border-white/5 rounded-3xl">
                                    <p className="text-zinc-500">No communities found for &quot;{searchQuery}&quot;</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
