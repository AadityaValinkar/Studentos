import { createClient } from "@/lib/supabase-server";
import { notFound, redirect } from "next/navigation";
import { Users, ChevronDown } from "lucide-react";
import CommunityFeed from "./CommunityFeed";
import JoinButton from "@/components/communities/JoinButton";

export const metadata = {
    title: "Community | StudentOS",
    description: "Anonymous academic space for students",
};

interface CommunityPageProps {
    params: {
        slug: string;
    };
}

export default async function CommunityPage({ params }: CommunityPageProps) {
    const { slug } = params;
    const supabase = createClient();

    // 1. Authenticate user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (!user || authError) {
        redirect("/login");
    }

    // 2. Fetch the community by slug
    const { data: community, error: communityError } = await supabase
        .from("communities")
        .select("*")
        .eq("slug", slug)
        .single();

    if (communityError || !community) {
        return notFound();
    }

    // 3. Fetch user membership status
    const { data: membership } = await supabase
        .from("community_members")
        .select("community_alias")
        .eq("community_id", community.id)
        .eq("user_id", user.id)
        .single();

    const isMember = !!membership;

    const { count: memberCount } = await supabase
        .from("community_members")
        .select("*", { count: "exact", head: true })
        .eq("community_id", community.id);

    const { data: profile } = await supabase
        .from("profiles")
        .select("id, global_username")
        .eq("id", user.id)
        .single();

    // 4. Fetch posts with interactions
    let rawPosts: Record<string, unknown>[] = [];
    let fetchError: string | null = null;

    try {
        const { data, error } = await supabase
            .from("posts")
            .select(`
                id, content, media_path, media_type, created_at,
                author:profiles(id, global_username, avatar_url),
                post_votes(user_id),
                post_reactions(user_id, reaction_type),
                saved_posts(user_id)
            `)
            .eq("community_id", community.id)
            .eq("deleted", false)
            .order("created_at", { ascending: false });

        if (error) throw error;
        rawPosts = data || [];
    } catch (err: unknown) {
        console.error("Post Fetch Error:", err);
        fetchError = (err as Error).message;
    }

    // 5. Process posts (signed URLs and counts)
    const posts = await Promise.all((rawPosts).map(async (post: Record<string, unknown>) => {
        let signedUrl = null;
        if (post.media_path) {
            const { data } = await supabase.storage
                .from("community-media")
                .createSignedUrl(post.media_path as string, 3600); // 1 hour for SSR
            signedUrl = data?.signedUrl || null;
        }

        const voteCount = (post.post_votes as { user_id: string }[])?.length || 0;
        const isSupported = (post.post_votes as { user_id: string }[])?.some(v => v.user_id === user.id) || false;

        const reactionCounts: Record<string, number> = {};
        (post.post_reactions as { reaction_type: string }[])?.forEach(r => {
            reactionCounts[r.reaction_type] = (reactionCounts[r.reaction_type] || 0) + 1;
        });

        const myReaction = (post.post_reactions as { user_id: string, reaction_type: string }[])?.find(r => r.user_id === user.id)?.reaction_type || null;
        const isSaved = (post.saved_posts as { user_id: string }[])?.some(s => s.user_id === user.id) || false;

        return {
            ...post,
            author: Array.isArray(post.author) ? post.author[0] : post.author,
            media_url: signedUrl,
            voteCount,
            isSupported,
            reactionCounts,
            myReaction,
            isSaved
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any;
    }));

    return (
        <div className="min-h-screen bg-bg-main flex flex-col md:flex-row">
            {/* Ambient Background (Dark Only) */}
            <div className="fixed inset-0 pointer-events-none z-0 hidden dark:block">
                <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/10 blur-[150px] rounded-full" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-500/10 blur-[150px] rounded-full" />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 w-full relative z-10 flex flex-col min-h-screen overflow-hidden">

                {/* Community Banner & Header (Hybrid Structure) */}
                <div className="w-full bg-bg-card border-b border-border-muted pt-12">
                    <div className="w-full px-6 pb-6 lg:px-12 flex flex-col md:flex-row items-start md:items-end justify-between gap-6 max-w-[1600px] mx-auto">
                        {/* Left: Info */}
                        <div className="flex items-start gap-5">
                            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-bg-main border border-border-muted flex items-center justify-center text-4xl shrink-0 dark:backdrop-blur-md">
                                {community.icon}
                            </div>

                            <div className="flex flex-col justify-center min-h-[4rem] md:min-h-[5rem]">
                                <h1 className="text-3xl font-bold tracking-tight text-text-main mb-1">
                                    {community.name}
                                </h1>
                                <p className="text-text-muted text-sm max-w-2xl line-clamp-2 leading-relaxed mb-2 font-medium">
                                    {community.description}
                                </p>
                                <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest opacity-60">
                                    &bull; {memberCount || 0} members
                                </span>
                            </div>
                        </div>

                        {/* Right: Actions */}
                        <div className="flex flex-col items-end gap-3 shrink-0">
                            {!isMember ? (
                                <JoinButton communityId={community.id} communitySlug={community.slug} />
                            ) : (
                                <button className="px-5 py-2 bg-accent-soft text-accent-primary transition-all font-bold rounded-xl border border-accent/20 flex items-center gap-2 text-sm shadow-sm hover:shadow-md cursor-default">
                                    <Users className="w-4 h-4" />
                                    Joined
                                </button>
                            )}
                            <details className="group relative">
                                <summary className="text-[10px] font-bold text-text-muted uppercase tracking-widest hover:text-accent-primary cursor-pointer list-none flex items-center gap-1 transition-colors select-none">
                                    View Rules <ChevronDown className="w-3 h-3 group-open:rotate-180 transition-transform" />
                                </summary>
                                <div className="absolute right-0 top-full mt-2 w-64 p-4 bg-bg-card border border-border-muted rounded-2xl shadow-xl z-50 dark:backdrop-blur-xl">
                                    <h4 className="text-sm font-bold text-text-main mb-2 tracking-tight">Space Rules</h4>
                                    <ul className="text-xs text-text-muted space-y-2 flex flex-col font-medium">
                                        <li className="flex gap-2"><span className="text-accent-primary/60 font-bold">1.</span> Maintain academic integrity and respect.</li>
                                        <li className="flex gap-2"><span className="text-accent-primary/60 font-bold">2.</span> No spam, promotions, or irrelevant content.</li>
                                        <li className="flex gap-2"><span className="text-accent-primary/60 font-bold">3.</span> Use appropriate tags for resources.</li>
                                    </ul>
                                </div>
                            </details>
                        </div>
                    </div>
                </div>

                {/* Tabs & Content */}
                <div className="flex-1 w-full px-6 lg:px-12 py-8 flex flex-col max-w-[1600px] mx-auto overflow-y-auto">
                    <CommunityFeed
                        communityId={community.id}
                        communitySlug={community.slug}

                        isMember={isMember}
                        userProfile={{ id: profile?.id || "", global_username: profile?.global_username || "" }}
                        alias={membership?.community_alias || null}
                        posts={posts}
                        fetchError={fetchError}
                    />
                </div>
            </div>
        </div>
    );
}
