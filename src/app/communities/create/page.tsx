"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { supabaseClient } from "@/lib/supabase-client";

export default function CreateCommunityPage() {
    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [description, setDescription] = useState("");
    const [icon, setIcon] = useState("📚");
    const [isPrivate, setIsPrivate] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            const { data: { user } } = await supabaseClient.auth.getUser();
            if (!user) throw new Error("Not authenticated");

            // 1. Create Community
            const { data: community, error: createError } = await supabaseClient
                .from("communities")
                .insert({
                    name,
                    slug,
                    description,
                    icon,
                    is_private: isPrivate,
                    created_by: user.id
                })
                .select()
                .single();

            if (createError) {
                if (createError.code === "23505") {
                    throw new Error("A community with this slug or name already exists.");
                }
                throw createError;
            }

            // 2. Automatically join the creator as a member
            if (community) {
                await supabaseClient.from("community_members").insert({
                    community_id: community.id,
                    user_id: user.id,
                    role: 'admin'
                });

                router.push(`/communities/${community.slug}`);
                router.refresh();
            }

        } catch (err: unknown) {
            console.error(err);
            setError((err as Error).message || "Failed to create community");
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-12">
            <Link href="/communities" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors w-max mb-8">
                <ArrowLeft className="w-4 h-4" />
                Back to Communities
            </Link>

            <div className="max-w-xl bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-2xl">
                <h1 className="text-3xl font-bold tracking-tight mb-2">Create Community</h1>
                <p className="text-zinc-400 mb-8">Launch a new space for students to collaborate.</p>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-zinc-300">Name</label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
                            }}
                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                            placeholder="e.g. Machine Learning Club"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-zinc-300">URL Slug</label>
                        <input
                            type="text"
                            required
                            value={slug}
                            onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                            placeholder="machine-learning-club"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-zinc-300">Description</label>
                        <textarea
                            required
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all resize-none h-24"
                            placeholder="What is this community about?"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-zinc-300">Emoji Icon</label>
                            <input
                                type="text"
                                maxLength={2}
                                value={icon}
                                onChange={(e) => setIcon(e.target.value)}
                                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500 text-center text-xl outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2 flex flex-col justify-end">
                            <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl border border-white/5 hover:bg-white/5 transition-colors">
                                <input
                                    type="checkbox"
                                    checked={isPrivate}
                                    onChange={(e) => setIsPrivate(e.target.checked)}
                                    className="w-5 h-5 rounded bg-black/50 border-white/10 text-indigo-500 focus:ring-indigo-500/20"
                                />
                                <span className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                                    <ShieldCheck className="w-4 h-4 text-purple-400" />
                                    Private
                                </span>
                            </label>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting || !name || !slug}
                        className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all disabled:bg-white/10 disabled:text-zinc-500 flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Community"}
                    </button>
                </form>
            </div>
        </div>
    );
}
