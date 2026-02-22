import { SupabaseProvider } from "@/components/SupabaseProvider";
import { ThemeProvider } from "next-themes";
import { type Session } from "@supabase/supabase-js";

export function Providers({ children, initialSession }: { children: React.ReactNode, initialSession: Session | null }) {
    return (
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
            <SupabaseProvider initialSession={initialSession}>{children}</SupabaseProvider>
        </ThemeProvider>
    );
}
