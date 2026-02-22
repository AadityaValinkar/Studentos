import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
    console.warn("Missing Supabase environment variables for client.");
}

export const supabaseClient = createClient(supabaseUrl || "https://placeholder.supabase.co", supabaseKey || "placeholder_anon_key");
