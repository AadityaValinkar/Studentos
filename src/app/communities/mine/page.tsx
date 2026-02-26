import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import MineClient from "./MineClient";

export const metadata = {
    title: "My Communities | StudentOS",
    description: "Spaces you have joined.",
};

export default async function MyCommunitiesPage() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Fetch joined communities
    const { data: memberships, error } = await supabase
        .from("community_members")
        .select(`
            community_id,
            communities (*)
        `)
        .eq("user_id", user.id);

    if (error) {
        console.error("Failed to load memberships:", error);
    }

    const joinedCommunities = memberships?.map(m => m.communities).filter(Boolean) || [];

    return (
        <MineClient
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            joinedCommunities={joinedCommunities as any[]}
        />
    );
}
