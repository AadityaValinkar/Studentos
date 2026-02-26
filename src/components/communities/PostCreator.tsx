"use client";

import { useState } from "react";

import { Loader2, Send, Paperclip, X, User } from "lucide-react";

interface PostCreatorProps {
    communityId: string;
    communitySlug: string;
    isMember: boolean;
    authorAlias: string | null;
    authorUsername: string;
    anonymousMode: boolean;
    onOptimisticPost?: (tempPost: Record<string, unknown>) => void;
    onRollbackPost?: (tempPostId: string) => void;
    onPostSuccess?: (realPost: Record<string, unknown>, tempPostId: string) => void;
}

export default function PostCreator({ communityId, communitySlug, isMember, authorAlias, authorUsername, anonymousMode, onOptimisticPost, onRollbackPost, onPostSuccess }: PostCreatorProps) {
    const [content, setContent] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    // uploadProgress and router are omitted as they are unused.

    const currentName = anonymousMode ? (authorAlias || "Anonymous Student") : authorUsername;

    if (!isMember) {
        return (
            <div className="mb-8 p-5 glass-card border-dashed flex flex-col gap-3 group opacity-80">
                <div className="flex items-start gap-4 opacity-60 pointer-events-none">
                    <div className="w-10 h-10 rounded-full bg-accent-soft text-accent-primary font-bold flex items-center justify-center shrink-0 border border-accent/10">
                        <User className="w-4 h-4" />
                    </div>
                    <div className="flex-1 flex flex-col gap-2">
                        <textarea
                            disabled
                            placeholder="Join this space to share your thoughts."
                            className="w-full bg-transparent border-none text-text-main focus:ring-0 resize-none h-20 placeholder:text-text-muted mt-2 text-sm md:text-base outline-none cursor-not-allowed"
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between border-t border-border-muted pt-4 mt-2">
                    <div className="flex items-center gap-3 opacity-60">
                        <span className="text-xs text-text-muted font-bold uppercase tracking-tight">
                            Posting is restricted to members
                        </span>
                    </div>
                </div>
            </div>
        );
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            if (selectedFile.size > 10 * 1024 * 1024) {
                alert("File too large (Max 10MB)");
                return;
            }
            setFile(selectedFile);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting) return; // Prevent double submission
        if (!content.trim() && !file) return;

        setIsSubmitting(true);
        const tempPostId = "temp-" + Date.now();
        const currentContent = content; // store it in case we need to rollback

        // 1. Optimistic Update
        const optimisticPost = {
            id: tempPostId,
            content: currentContent.trim(),
            created_at: new Date().toISOString(),
            user_id: "optimistic",
            community_id: communityId,
            voteCount: 0,
            reactionCounts: {},
            myReaction: null,
            isSupported: false,
            authorAlias: anonymousMode ? (authorAlias || "Anonymous Student") : authorUsername,
            authorUsername: authorUsername,
            media_url: file ? URL.createObjectURL(file) : null,
            optimistic: true // flag for UI animations
        };

        if (onOptimisticPost) onOptimisticPost(optimisticPost);

        // Clear UI immediately for instant feel
        setContent("");
        if (file) setFile(null); // Keep original file for actual upload

        try {
            let mediaPath = null;
            let mediaType = null;

            // 2. Upload file if exists
            if (file) {
                const formData = new FormData();
                formData.append("file", file);
                formData.append("communityId", communityId);
                formData.append("communitySlug", communitySlug);

                const uploadRes = await fetch("/api/posts/upload", {
                    method: "POST",
                    body: formData,
                });

                if (!uploadRes.ok) {
                    const err = await uploadRes.json();
                    throw new Error(err.error || "Upload failed");
                }

                const uploadData = await uploadRes.json();
                mediaPath = uploadData.path;
                mediaType = uploadData.type;
            }

            // 3. Create real post
            const res = await fetch("/api/posts/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    communityId,
                    content: currentContent.trim(),
                    mediaPath,
                    mediaType
                }),
            });

            const data = await res.json();

            if (res.ok) {
                if (onPostSuccess) onPostSuccess(data.post, tempPostId);
                // We intentionally DO NOT router.refresh() here to preserve scroll position
                // and keep our smooth local state transitions intact.
            } else {
                throw new Error(data.error || "Failed to post");
            }
        } catch (error: unknown) {
            console.error("Post error:", error);
            setContent(currentContent); // Restore text
            if (onRollbackPost) onRollbackPost(tempPostId);
            alert(`Post Error: ${(error as Error).message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mb-8 p-5 glass-card flex flex-col gap-3 focus-within:shadow-xl focus-within:border-accent/40 group">
            <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-accent-soft text-accent-primary font-bold flex items-center justify-center shrink-0 border border-accent/20 group-focus-within:border-accent/40 transition-colors">
                    {currentName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 flex flex-col gap-2 group-focus-within:ring-0">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        disabled={isSubmitting}
                        placeholder="Share something valuable with this community..."
                        className="w-full bg-transparent border-none text-text-main focus:ring-0 resize-none h-20 placeholder:text-text-muted mt-2 text-sm md:text-base outline-none disabled:opacity-50 transition-opacity duration-150"
                    />

                    {file && (
                        <div className="flex items-center gap-2 p-2 bg-bg-main border border-border-muted rounded-xl self-start">
                            <span className="text-xs text-text-muted max-w-[200px] truncate font-medium">{file.name}</span>
                            <button
                                type="button"
                                onClick={() => setFile(null)}
                                className="text-text-muted hover:text-text-main transition-colors"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex items-center justify-between border-t border-border-muted pt-4 mt-2">
                <div className="flex items-center gap-3">
                    <label className="cursor-pointer p-2 rounded-xl bg-bg-main border border-border-muted hover:bg-border-muted transition-all text-text-muted hover:text-text-main group/btn">
                        <Paperclip className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                        <input
                            type="file"
                            className="hidden"
                            onChange={handleFileChange}
                            accept="image/*,application/pdf,.doc,.docx"
                        />
                    </label>
                    <span className="text-[10px] text-text-muted font-bold uppercase tracking-widest hidden md:block">
                        Posting securely as <strong className="text-accent-primary">@{currentName}</strong>
                    </span>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting || (!content.trim() && !file)}
                    className="px-6 py-2 bg-text-main text-bg-card font-bold rounded-xl hover:opacity-90 disabled:bg-accent-soft disabled:text-text-muted transition-all duration-150 flex items-center gap-2"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Posting...
                        </>
                    ) : (
                        <>
                            Post
                            <Send className="w-3.5 h-3.5" />
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
