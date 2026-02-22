"use client";

import { useSupabase } from "@/components/SupabaseProvider";

// This is a wrapper around useSupabase to maintain NextAuth's `useSession` signature
// This prevents having to do massive refactoring in all UI components immediately.
export function useSession() {
    const { session, user, isLoading } = useSupabase();

    if (isLoading) {
        return { data: null, status: "loading" as const };
    }

    if (!session || !user) {
        return { data: null, status: "unauthenticated" as const };
    }

    return {
        data: {
            user: {
                id: user.id,
                email: user.email,
                name: user.user_metadata?.full_name || user.email?.split('@')[0],
                image: user.user_metadata?.avatar_url,
            },
            expires: new Date((session.expires_at || 0) * 1000).toISOString(),
        },
        status: "authenticated" as const,
    };
}

export async function signOut(options?: { callbackUrl?: string }) {
    const { supabaseClient } = await import('@/lib/supabase-client');
    await supabaseClient.auth.signOut();
    if (options?.callbackUrl && typeof window !== "undefined") {
        window.location.href = options.callbackUrl;
    } else {
        window.location.reload();
    }
}
