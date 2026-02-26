import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { ProfileClient } from "@/components/profile/ProfileClient";

export default async function ProfilePage() {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        redirect("/login");
    }

    // 1. Fetch Profile
    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    // 2. Fetch Joined Communities (with community details)
    const { data: memberships } = await supabase
        .from("community_members")
        .select(`
            community_id,
            communities (
                id,
                name,
                slug,
                description,
                icon,
                community_members(count)
            )
        `)
        .eq("user_id", user.id);

    // 3. Fetch Goals/Targets
    const { data: targets } = await supabase
        .from("academic_targets")
        .select("*")
        .eq("user_id", user.id);

    // 4. Fetch Upcoming Events (for highlight)
    const todayStr = new Date().toISOString().split('T')[0];
    const { data: upcomingEvents } = await supabase
        .from("user_events")
        .select("*")
        .eq("user_id", user.id)
        .gte("start_date", todayStr)
        .order("start_date", { ascending: true })
        .limit(1);

    return (
        <ProfileClient
            initialProfile={profile}
            user={user}
            memberships={memberships || []}
            targets={targets || []}
            nextEvent={upcomingEvents?.[0] || null}
        />
    );
}
