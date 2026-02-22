import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import CommunitiesClient from "./CommunitiesClient";

export const metadata = {
    title: "Communities | StudentOS",
    description: "Anonymous academic identity spaces.",
};

export default async function CommunitiesPage() {
    const supabase = createClient();

    // Redirect if not authenticated
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
        redirect("/login");
    }

    // Ensure user has a profile (setup modal handles this on RootLayout, 
    // but we need the profile ID for joining)
    const { data: profile } = await supabase
        .from("profiles")
        .select("id, global_username")
        .eq("id", session.user.id)
        .single();

    if (!profile) {
        // RootLayout modal should be handling this, return a loading/null state bridging the gap
        return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-zinc-400">Loading identity context...</div>;
    }

    // 1. Fetch all communities
    const { data: communities, error: commError } = await supabase
        .from("communities")
        .select("*")
        .order("member_count", { ascending: false });

    if (commError) {
        console.error("Failed to load communities:", commError);
    }

    // 2. Fetch memberships for this user
    const { data: memberships, error: memberError } = await supabase
        .from("community_members")
        .select("community_id")
        .eq("user_id", profile.id);

    if (memberError) {
        console.error("Failed to load memberships:", memberError);
    }

    // Create a Set of joined community IDs for O(1) lookup
    const joinedSet = new Set(memberships?.map(m => m.community_id) || []);

    return (
        <div className="min-h-screen bg-[#0a0a0a]">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />
            </div>

            <div className="relative z-10 px-4 py-8 md:px-8 max-w-7xl mx-auto space-y-12 pb-24">

                {/* Header Section */}
                <div className="space-y-4">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white flex items-center gap-4">
                        Communities
                        <span className="px-3 py-1 bg-white/10 text-white/70 text-sm font-semibold rounded-full border border-white/10">BETA</span>
                    </h1>
                    <p className="text-lg text-zinc-400 max-w-2xl leading-relaxed">
                        Anonymous, safely moderated spaces tailored for your campus. Post, ask doubts, and collaborate fully protected by your global alias <span className="text-indigo-400 font-semibold px-1 rounded-md bg-indigo-500/10 border border-indigo-500/20">@{profile.global_username}</span>.
                    </p>
                </div>

                {/* Main Client Content */}
                <CommunitiesClient
                    initialCommunities={communities || []}
                    initialJoinedIds={Array.from(joinedSet)}
                    userId={profile.id}
                />
            </div>
        </div>
    );
}
