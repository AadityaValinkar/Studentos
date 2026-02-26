import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";
import { calculateCompleteness } from "@/lib/profile-utils";

export default async function DashboardPage() {
  const supabase = createClient();

  // 1. Get Session
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  // 2. Fetch Profile
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    console.error("Profile fetch error:", profileError);
    // Even if no profile, we let them through to minimal dash
  }

  // 3. Calculate Completeness
  const completeness = profile ? calculateCompleteness(profile) : 0;

  // 4. Fetch Notifications (unread count)
  const { count: unreadCount } = await supabase
    .from("notifications")
    .select("*", { count: 'exact', head: true })
    .eq("user_id", user.id)
    .eq("read", false);

  // 5. Fetch Targets
  const { data: targets } = await supabase
    .from("academic_targets")
    .select("*")
    .eq("user_id", user.id);

  // 6. Fetch Upcoming Events
  const today = new Date().toISOString().split('T')[0];
  const { data: upcomingEvents } = await supabase
    .from("user_events")
    .select("*")
    .eq("user_id", user.id)
    .gte("start_date", today)
    .order("start_date", { ascending: true })
    .limit(3);

  return (
    <DashboardClient
      profile={profile}
      user={user}
      unreadCount={unreadCount || 0}
      initialTargets={targets || []}
      completeness={completeness}
      upcomingEvents={upcomingEvents || []}
    />
  );
}
