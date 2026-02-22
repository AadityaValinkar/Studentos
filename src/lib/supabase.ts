import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Ensure these exist so we get clear errors instead of cryptic failures
if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase environment variables. Check .env.local");
}

// We use the Service Role Key here exclusively for the Next.js server-side API routes 
// because we are managing users and overriding RLS directly from our trusted node server.
export const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false
    }
});
