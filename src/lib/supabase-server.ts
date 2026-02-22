import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export function createClient() {
    console.log("SERVER URL:", process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log("SERVER KEY:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "EXISTS" : "MISSING")

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co",
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder_anon_key",
        {
            cookies: {
                getAll() {
                    return cookies().getAll()
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookies().set(name, value, options)
                        )
                    } catch {
                    }
                },
            }
        }
    )
}
