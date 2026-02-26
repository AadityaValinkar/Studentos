import { MessageSquare, FileText, Download, Bookmark, Loader2 } from "lucide-react";
import PostVotes from "./PostVotes";
import PostReactions from "./PostReactions";
import { savePost } from "@/lib/actions/posts";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

function getRelativeTime(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return format(date, "MMM d, yyyy");
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
    communities?: {
        name: string;
        slug: string;
    } | null;
    optimistic?: boolean;
}

interface PostFeedProps {
    posts: Post[];
    anonymousMode: boolean;
}

export default function PostFeed({ posts, anonymousMode }: PostFeedProps) {
    const [savingIds, setSavingIds] = useState<Set<string>>(new Set());

    const handleSave = async (postId: string) => {
        setSavingIds(prev => new Set(prev).add(postId));
        try {
            await savePost(postId);
        } catch (error) {
            console.error("Save failed:", error);
        } finally {
            setSavingIds(prev => {
                const next = new Set(prev);
                next.delete(postId);
                return next;
            });
        }
    };

    if (posts.length === 0) {
        return (
            <div className="flex-1 text-center py-20 bg-bg-card border border-border-muted rounded-[2rem] dark:backdrop-blur-md">
                <MessageSquare className="w-12 h-12 text-text-muted mx-auto mb-4 opacity-30" />
                <h2 className="text-xl font-bold text-text-main mb-2 tracking-tight">This space is quiet...</h2>
                <p className="text-text-muted max-w-sm mx-auto mb-6 font-medium">
                    Start the first discussion, ask a question, or share a resource.
                </p>
                <button
                    onClick={() => {
                        window.scrollTo({ top: 0, behavior: "smooth" });
                        const textarea = document.querySelector('textarea');
                        if (textarea) textarea.focus();
                    }}
                    className="px-6 py-2.5 bg-text-main text-bg-card text-sm font-bold rounded-xl hover:opacity-90 transition-all shadow-xl shadow-text-main/10"
                >
                    Create Post
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {posts.map((post) => {
                const displayName = anonymousMode ? "Anonymous Student" : (post.author?.global_username || "Unknown");
                const isImage = post.media_type?.startsWith("image/");
                const isPDF = post.media_type === "application/pdf";
                const isDoc = post.media_type?.includes("word");

                return (
                    <div
                        key={post.id}
                        className={cn(
                            "p-4 glass-card",
                            post.optimistic ? "animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out" : ""
                        )}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <h4 className="text-sm font-bold text-white tracking-tight">{displayName}</h4>
                                <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">
                                    {getRelativeTime(post.created_at)}
                                </span>
                            </div>

                            <button
                                onClick={() => handleSave(post.id)}
                                disabled={savingIds.has(post.id)}
                                className={cn(
                                    "p-1 rounded-lg transition-all",
                                    post.isSaved ? "bg-amber-500/10 text-amber-500" : "text-slate-500 hover:text-white"
                                )}
                            >
                                {savingIds.has(post.id) ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Bookmark className={cn("w-3.5 h-3.5", post.isSaved && "fill-current")} />}
                            </button>
                        </div>

                        {/* Content */}
                        <p className="text-slate-200 text-sm md:text-base leading-relaxed whitespace-pre-wrap mb-4 font-medium">
                            {post.content}
                        </p>

                        {/* Media Rendering */}
                        {post.media_url && (
                            <div className="mb-4 rounded-2xl overflow-hidden border border-border-muted bg-bg-main">
                                {isImage ? (
                                    <img
                                        src={post.media_url}
                                        alt="Post attachment"
                                        className="w-full max-h-[500px] object-contain"
                                    />
                                ) : isPDF ? (
                                    <div className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 transition-colors group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                                                <FileText className="w-5 h-5 text-red-500" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-text-main">Document (PDF)</span>
                                                <span className="text-xs text-text-muted font-medium opacity-60">Secure academic resource</span>
                                            </div>
                                        </div>
                                        <a
                                            href={post.media_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 bg-text-main/5 rounded-lg text-text-muted hover:text-text-main hover:bg-text-main/10 transition-all font-bold"
                                        >
                                            <Download className="w-4 h-4" />
                                        </a>
                                    </div>
                                ) : isDoc ? (
                                    <div className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 transition-colors group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                                                <FileText className="w-5 h-5 text-blue-500" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-semibold text-white">Word Document</span>
                                                <span className="text-xs text-zinc-500">Editable resource</span>
                                            </div>
                                        </div>
                                        <a
                                            href={post.media_url}
                                            download
                                            className="p-2 bg-white/5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-all"
                                        >
                                            <Download className="w-4 h-4" />
                                        </a>
                                    </div>
                                ) : null}
                            </div>
                        )}

                        {/* Footer Interactions */}
                        <div className="flex items-center gap-6 pt-2">
                            <PostVotes
                                postId={post.id}
                                initialCount={post.voteCount}
                                initialStatus={post.isSupported}
                            />

                            <button className="flex items-center gap-2 text-slate-400 hover:text-indigo-400 transition-all">
                                <MessageSquare className="w-4 h-4" />
                                <span className="text-xs font-bold">8</span>
                            </button>

                            <PostReactions
                                postId={post.id}
                                initialCounts={post.reactionCounts}
                                currentUserReaction={post.myReaction}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
