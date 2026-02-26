"use client";

import { useState } from "react";
import { MessageSquare, BookOpen, Briefcase, Calendar, Ghost, ShieldCheck, Zap, ShieldAlert } from "lucide-react";
import PostCreator from "@/components/communities/PostCreator";
import PostFeed from "@/components/communities/PostFeed";

interface CommunityFeedProps {
    communityId: string;
    communitySlug: string;
    isMember: boolean;
    userProfile: {
        id: string;
        global_username: string;
    };
    alias: string | null;
    posts: Post[];
    fetchError: string | null;
}

// Temporary basic post interface to quiet TS
interface Post {
    id: string;
    [key: string]: unknown;
}

export default function CommunityFeed({ communityId, communitySlug, isMember, userProfile, alias, posts, fetchError }: CommunityFeedProps) {
    const [activeTab, setActiveTab] = useState("Posts");
    const [anonymousMode, setAnonymousMode] = useState(false);
    const [localPosts, setLocalPosts] = useState<Post[]>(posts);

    const handleOptimisticPost = (tempPost: Record<string, unknown>) => {
        setLocalPosts(prev => [tempPost as unknown as Post, ...prev]);
    };

    const handleRollbackPost = (tempPostId: string) => {
        setLocalPosts(prev => prev.filter(p => p.id !== tempPostId));
    };

    const handlePostSuccess = (realPost: Record<string, unknown>, tempPostId: string) => {
        setLocalPosts(prev => prev.map(p => p.id === tempPostId ? realPost as unknown as Post : p));
    };

    const tabs = [
        { id: "Posts", icon: <MessageSquare className="w-4 h-4" /> },
        { id: "Resources", icon: <BookOpen className="w-4 h-4" /> },
        { id: "Placements", icon: <Briefcase className="w-4 h-4" /> },
        { id: "Events", icon: <Calendar className="w-4 h-4" /> },
    ];

    const currentName = anonymousMode
        ? (alias || "Anonymous Student")
        : userProfile.global_username;

    return (
        <div className="flex flex-col h-full w-full">
            {/* Action Bar / Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-border-muted pb-4">
                <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab.id
                                ? "bg-accent-soft text-accent-primary border border-accent/20"
                                : "text-text-muted hover:text-text-main hover:bg-accent-soft/30 border border-transparent"
                                }`}
                        >
                            {tab.icon}
                            {tab.id}
                        </button>
                    ))}
                </div>

                {isMember && (
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 shrink-0">
                        {/* Campus Identity Badge */}
                        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-accent-soft border border-accent/10 rounded-full">
                            <ShieldCheck className="w-3.5 h-3.5 text-accent-primary" />
                            <span className="text-[10px] font-bold text-accent-primary uppercase tracking-wider">
                                Verified Student - Parul University
                            </span>
                        </div>

                        {/* Identity Context */}
                        <div className="flex items-center gap-3 bg-bg-card px-4 py-2 rounded-2xl border border-border-muted">
                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-text-muted flex items-center gap-2">
                                    Posting as: <span className="text-accent-primary">@{currentName}</span>
                                </span>
                                <span className="text-[10px] text-text-muted flex items-center gap-1 font-bold uppercase tracking-tighter mt-0.5 opacity-60">
                                    <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
                                    120 Reputation
                                </span>
                            </div>

                            <div className="w-px h-8 bg-border-muted mx-1" />

                            <button
                                onClick={() => setAnonymousMode(!anonymousMode)}
                                className={`p-2 rounded-xl transition-all flex items-center gap-2 text-[10px] font-bold ${anonymousMode
                                    ? "bg-accent-primary text-white border border-accent/30 shadow-lg shadow-accent/20"
                                    : "bg-bg-main text-text-muted hover:text-text-main border border-border-muted"
                                    }`}
                                title="Toggle Anonymous Mode"
                            >
                                <Ghost className="w-4 h-4" />
                                {anonymousMode ? "ON" : "OFF"}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Content Area */}
            <div className="flex-1 w-full flex flex-col pt-4">
                {activeTab === "Posts" ? (
                    <>
                        <PostCreator
                            communityId={communityId}
                            communitySlug={communitySlug}
                            isMember={isMember}
                            authorAlias={alias}
                            authorUsername={userProfile.global_username}
                            anonymousMode={anonymousMode}
                            onOptimisticPost={handleOptimisticPost}
                            onRollbackPost={handleRollbackPost}
                            onPostSuccess={handlePostSuccess}
                        />

                        {fetchError ? (
                            <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-3xl text-center mb-8">
                                <ShieldAlert className="w-8 h-8 text-red-500 mx-auto mb-2" />
                                <h3 className="text-lg font-bold text-text-main mb-1 tracking-tight">Database Sync Required</h3>
                                <p className="text-text-muted text-sm mb-4 font-medium">
                                    The community infrastructure is not fully initialized.
                                    Please ensure you have run the <code className="text-accent-primary font-bold">communities_overhaul.sql</code> script.
                                </p>
                                <div className="bg-bg-main p-3 rounded-xl text-left font-mono text-xs text-red-500 break-all border border-red-500/10">
                                    Error: {fetchError}
                                </div>
                            </div>
                        ) : (
                            <PostFeed
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                posts={localPosts as any[]}
                                anonymousMode={anonymousMode}
                            />
                        )}
                    </>
                ) : (
                    <div className="flex-1 text-center py-20 bg-bg-card border border-border-muted rounded-[2rem] dark:backdrop-blur-md">
                        <MessageSquare className="w-12 h-12 text-text-muted mx-auto mb-4 opacity-30" />
                        <h2 className="text-xl font-bold text-text-main mb-2 tracking-tight">{activeTab}</h2>
                        <p className="text-text-muted max-w-md mx-auto font-medium">
                            This section is currently under construction.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
