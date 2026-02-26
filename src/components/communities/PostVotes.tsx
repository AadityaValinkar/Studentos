"use client";

import { useState } from "react";
import { ArrowBigUp } from "lucide-react";
import { supportPost } from "@/lib/actions/posts";
import { cn } from "@/lib/utils";

interface PostVotesProps {
    postId: string;
    initialCount: number;
    initialStatus: boolean; // true if current user supported
}

export default function PostVotes({ postId, initialCount, initialStatus }: PostVotesProps) {
    const [count, setCount] = useState(initialCount);
    const [isSupported, setIsSupported] = useState(initialStatus);
    const [isPending, setIsPending] = useState(false);

    const handleSupport = async () => {
        if (isPending) return;

        // Optimistic UI
        const newStatus = !isSupported;
        const newCount = newStatus ? count + 1 : count - 1;

        setIsSupported(newStatus);
        setCount(newCount);
        setIsPending(true);

        try {
            await supportPost(postId);
        } catch (error) {
            // Rollback on error
            setIsSupported(!newStatus);
            setCount(count);
            console.error("Support action failed:", error);
        } finally {
            setIsPending(false);
        }
    };

    return (
        <button
            onClick={handleSupport}
            disabled={isPending}
            className={cn(
                "flex items-center gap-1.5 transition-all text-sm font-bold",
                isSupported
                    ? "text-indigo-400"
                    : "text-slate-500 hover:text-white"
            )}
        >
            <ArrowBigUp className={cn("w-5 h-5", isSupported && "fill-current")} />
            <span>{count}</span>
        </button>
    );
}
