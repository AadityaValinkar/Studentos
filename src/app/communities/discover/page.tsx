import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import DiscoverClient from "./DiscoverClient";

export const metadata = {
    title: "Discover | StudentOS",
    description: "Find new communities and trending posts.",
};

export default async function DiscoverPage() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Determine memberships
    const { data: memberships } = await supabase
        .from("community_members")
        .select("community_id")
        .eq("user_id", user.id);

    const joinedSet = new Set(memberships?.map(m => m.community_id) || []);

    // Fetch popular or random posts
    const { data: rawPosts } = await supabase
        .from("posts")
        .select(`
            id, content, media_path, media_type, created_at,
            author:profiles(id, global_username, avatar_url),
            communities(name, slug),
            post_votes(user_id),
            post_reactions(user_id, reaction_type),
            saved_posts(user_id)
        `)
        .eq("deleted", false)
        .order("created_at", { ascending: false })
        .limit(30);

    // Process posts
    const posts = await Promise.all((rawPosts || []).map(async (post) => {
        let signedUrl = null;
        if (post.media_path) {
            const { data } = await supabase.storage
                .from("community-media")
                .createSignedUrl(post.media_path, 3600);
            signedUrl = data?.signedUrl || null;
        }

        const voteCount = post.post_votes?.length || 0;
        const isSupported = post.post_votes?.some((v: { user_id: string }) => v.user_id === user.id) || false;

        const reactionCounts: Record<string, number> = {};
        post.post_reactions?.forEach((r: { reaction_type: string }) => {
            reactionCounts[r.reaction_type] = (reactionCounts[r.reaction_type] || 0) + 1;
        });

        const myReaction = post.post_reactions?.find((r: { user_id: string, reaction_type: string }) => r.user_id === user.id)?.reaction_type || null;
        const isSaved = post.saved_posts?.some((s: { user_id: string }) => s.user_id === user.id) || false;

        return {
            ...post,
            author: Array.isArray(post.author) ? post.author[0] : post.author,
            communities: Array.isArray(post.communities) ? post.communities[0] : post.communities,
            media_url: signedUrl,
            voteCount,
            isSupported,
            reactionCounts,
            myReaction,
            isSaved
        };
    }));

    // Fetch communities
    const { data: communities } = await supabase
        .from("communities")
        .select("*")
        .order("member_count", { ascending: false });

    return (
        <DiscoverClient
            initialCommunities={communities || []}
            posts={posts || []}
            joinedSetIds={Array.from(joinedSet)}
        />
    );
}
