"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus } from "lucide-react";

interface JoinButtonProps {
    communityId: string;
    communitySlug: string;
    className?: string; // allow overrides
    label?: string;
    onJoinSuccess?: () => void;
}

export default function JoinButton({ communityId, className, label = "Join Community", onJoinSuccess }: JoinButtonProps) {
    const [isJoining, setIsJoining] = useState(false);
    const router = useRouter();

    const handleJoin = async () => {
        setIsJoining(true);

        try {
            const res = await fetch("/api/community/join", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ communityId }),
            });

            if (res.ok) {
                if (onJoinSuccess) {
                    onJoinSuccess();
                }
                // Force a hard refresh or next router refresh to pull new server state
                // This will make the dynamic page re-evaluate user membership status
                router.refresh();
            } else {
                const data = await res.json();
                console.error("Failed to join:", data.error);
            }
        } catch (error) {
            console.error("Join error:", error);
        } finally {
            setIsJoining(false);
        }
    };

    return (
        <button
            onClick={handleJoin}
            disabled={isJoining}
            className={`flex items-center justify-center gap-2 px-6 py-2.5 bg-accent-primary hover:bg-accent-primary/90 disabled:bg-accent-soft disabled:text-text-muted text-white font-bold rounded-2xl transition-all shadow-[0_8px_20px_-8px_rgba(99,102,241,0.5)] hover:shadow-[0_12px_24px_-8px_rgba(99,102,241,0.7)] disabled:shadow-none ${className}`}
        >
            {isJoining ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
                <>
                    <Plus className="w-4 h-4" />
                    {label}
                </>
            )}
        </button>
    );
}
