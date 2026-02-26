"use client";

import { useState } from "react";
import { reactToPost } from "@/lib/actions/posts";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
const REACTION_MAP = {
    profound: { label: "Insight", emoji: "💡", color: "text-amber-400" },
    applicable: { label: "Applied", emoji: "🎯", color: "text-red-400" },
    comprehensive: { label: "Resource", emoji: "📚", color: "text-blue-400" }
} as const;

type ReactionType = keyof typeof REACTION_MAP;

interface ReactionCounts {
    [key: string]: number;
}

interface PostReactionsProps {
    postId: string;
    initialCounts: ReactionCounts;
    currentUserReaction: string | null;
}

export default function PostReactions({ postId, initialCounts, currentUserReaction }: PostReactionsProps) {
    const [counts, setCounts] = useState<ReactionCounts>(initialCounts);
    const [myReaction, setMyReaction] = useState<string | null>(currentUserReaction);
    const [isPending, setIsPending] = useState(false);
    const [showSelector, setShowSelector] = useState(false);

    const handleReact = async (type: ReactionType) => {
        if (isPending) return;

        // Optimistic UI
        const prevReaction = myReaction;
        const newReaction = prevReaction === type ? null : type;

        const newCounts = { ...counts };

        // Remove old count
        if (prevReaction && newCounts[prevReaction]) {
            newCounts[prevReaction] = Math.max(0, newCounts[prevReaction] - 1);
        }

        // Add new count
        if (newReaction) {
            newCounts[newReaction] = (newCounts[newReaction] || 0) + 1;
        }

        setMyReaction(newReaction);
        setCounts(newCounts);
        setIsPending(true);
        setShowSelector(false);

        try {
            await reactToPost(postId, type);
        } catch (error) {
            // Rollback
            setMyReaction(prevReaction);
            setCounts(initialCounts);
            console.error("Reaction failed:", error);
        } finally {
            setIsPending(false);
        }
    };

    // Filter reactions with counts > 0 or it's my reaction
    const activeReactions = (Object.keys(REACTION_MAP) as ReactionType[]).filter(
        type => (counts[type] || 0) > 0 || myReaction === type
    );

    return (
        <div className="flex items-center gap-3 flex-wrap relative">
            {activeReactions.slice(0, 5).map(type => {
                const reaction = REACTION_MAP[type];
                const count = counts[type] || 0;
                const isMine = myReaction === type;

                return (
                    <button
                        key={type}
                        onClick={() => handleReact(type)}
                        disabled={isPending}
                        className={cn(
                            "flex items-center gap-1 transition-all duration-200",
                            isMine ? "text-white" : "text-slate-500 hover:text-slate-300"
                        )}
                        title={reaction.label}
                    >
                        <span className="text-[14px] leading-none">{reaction.emoji}</span>
                        <span className="text-xs font-bold">{count}</span>
                    </button>
                );
            })}

            <button
                onClick={() => setShowSelector(!showSelector)}
                className="text-slate-600 hover:text-white transition-all duration-200"
            >
                <Plus className="w-4 h-4" />
            </button>

            {showSelector && (
                <div className="absolute bottom-full left-0 mb-2 p-1.5 bg-zinc-900 border border-white/10 rounded-2xl shadow-xl flex items-center gap-1 z-50 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-2 duration-200">
                    {(Object.keys(REACTION_MAP) as ReactionType[]).map(type => {
                        const reaction = REACTION_MAP[type];
                        return (
                            <button
                                key={type}
                                onClick={() => handleReact(type)}
                                className={cn(
                                    "p-2 rounded-xl transition-all duration-200 hover:bg-white/10 hover:scale-105",
                                    myReaction === type && "bg-white/15 shadow-sm"
                                )}
                                title={reaction.label}
                            >
                                <span className="text-lg leading-none">{reaction.emoji}</span>
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
