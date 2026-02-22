"use client";
import { SupabaseProvider } from "@/components/SupabaseProvider";
import { ThemeProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
            <SupabaseProvider>{children}</SupabaseProvider>
        </ThemeProvider>
    );
}
