"use client";

import { supabaseClient } from "@/lib/supabase-client";
import BeamsBackground from "@/components/ui/beams-background";
import { useState } from "react";

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        await supabaseClient.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: typeof window !== "undefined" ? `${window.location.origin}/auth/callback?next=/dashboard` : undefined
            }
        });
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center">
            {/* Animated Background */}
            <BeamsBackground className="fixed inset-0 z-0" intensity="medium" />

            <div className="relative z-10 w-full flex items-center justify-center p-8">
                {/* Authentication panel */}
                <div className="flex flex-col items-start space-y-8 glass-panel p-10 md:p-14 rounded-3xl w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-1000 shadow-2xl">
                    <div className="space-y-3">
                        <div className="w-12 h-12 rounded-xl bg-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.6)] flex items-center justify-center mb-6">
                            <span className="text-white font-bold text-xl">OS</span>
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight text-white mb-2">
                            StudentOS
                        </h1>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Sign in to access your AI career roadmap, academic analytics, and strategic scheduling.
                        </p>
                    </div>

                    <button
                        onClick={handleGoogleLogin}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-3 bg-white hover:bg-zinc-100 text-zinc-900 font-semibold py-3.5 px-4 rounded-xl transition-all shadow-lg active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none"
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-zinc-900 border-t-transparent flex-shrink-0 animate-spin rounded-full" />
                        ) : (
                            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                        )}
                        {isLoading ? "Authenticating..." : "Continue with Google"}
                    </button>

                    <div className="w-full text-center mt-4">
                        <p className="text-xs text-slate-500">
                            By continuing, you are setting up your student profile. We use Google OAuth to safely retrieve your profile.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
