"use client";

import { supabaseClient } from "@/lib/supabase-client";
import BeamsBackground from "@/components/ui/beams-background";
import { useState } from "react";
import AuthButton from "@/components/auth/AuthButton";
import { Mail, Phone, ChevronLeft, Loader2, ShieldAlert, Smartphone, CheckCircle2, Send, LogIn, UserPlus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import AnimatedOTPInput from "@/components/ui/otp-input";

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [view, setView] = useState<"options" | "email" | "phone">("options");
    const [authMode, setAuthMode] = useState<"login" | "register">("login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [otp, setOtp] = useState("");
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [authMessage, setAuthMessage] = useState<{ type: "success" | "error", text: string } | null>(null);

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        try {
            const { error } = await supabaseClient.auth.signInWithOAuth({
                provider: "google",
                options: {
                    redirectTo: typeof window !== "undefined" ? `${window.location.origin}/auth/callback?next=/dashboard` : undefined
                }
            });
            if (error) throw error;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            setAuthMessage({ type: "error", text: error.message });
        } finally {
            setIsLoading(false);
        }
    };

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) return;
        setIsLoading(true);
        setAuthMessage(null);

        try {
            if (authMode === "login") {
                const { error } = await supabaseClient.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                window.location.href = "/dashboard";
            } else {
                const { error } = await supabaseClient.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
                    }
                });
                if (error) throw error;
                setAuthMessage({
                    type: "success",
                    text: "Registration successful! Check your email to confirm your account (if confirmation is enabled)."
                });
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            setAuthMessage({ type: "error", text: error.message });
        } finally {
            setIsLoading(false);
        }
    };

    const handlePhoneSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!phoneNumber) return;
        setIsLoading(true);
        setAuthMessage(null);

        try {
            const res = await fetch("/api/auth/otp/send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phoneNumber })
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error);

            setIsOtpSent(true);
            setAuthMessage({ type: "success", text: "OTP sent to your phone!" });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            setAuthMessage({ type: "error", text: error.message });
        } finally {
            setIsLoading(false);
        }
    };

    const handleOtpComplete = async (code: string) => {
        setIsLoading(true);
        setAuthMessage(null);

        try {
            const res = await fetch("/api/auth/otp/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phoneNumber, code })
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error);

            setAuthMessage({ type: "success", text: "Phone verified! Signing you in..." });

            // Redirect or show success
            setTimeout(() => {
                window.location.href = "/dashboard";
            }, 1500);

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            setAuthMessage({ type: "error", text: error.message });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-[#050505] overflow-hidden">
            <BeamsBackground className="fixed inset-0 z-0" intensity="medium" />

            {/* Ambient Orbs */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full animate-pulse" />

            <div className="relative z-10 w-full flex items-center justify-center p-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center space-y-8 glass-panel p-8 md:p-12 rounded-[2.5rem] w-full max-w-md shadow-2xl border border-white/10 bg-black/40 backdrop-blur-3xl"
                >
                    {/* Header */}
                    <div className="flex flex-col items-center text-center space-y-4 w-full">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-2xl flex items-center justify-center mb-2 rotate-3 hover:rotate-0 transition-transform duration-500">
                            <span className="text-white font-black text-2xl tracking-tighter">OS</span>
                        </div>

                        <div className="space-y-1">
                            <h1 className="text-3xl font-black tracking-tighter text-white">
                                {view === "options"
                                    ? "Welcome to StudentOS"
                                    : view === "email"
                                        ? (authMode === "login" ? "Sign In" : "Create Account")
                                        : isOtpSent ? "Verify OTP" : "Enter Phone"}
                            </h1>
                            <p className="text-zinc-500 text-sm font-medium">
                                {view === "options"
                                    ? "Connect with a world of academic productivity."
                                    : view === "email"
                                        ? (authMode === "login" ? "Enter your credentials to continue." : "Set up your secure account.")
                                        : isOtpSent
                                            ? `Enter the 6-digit code sent to ${phoneNumber}`
                                            : "We'll send a 6-digit verification code."}
                            </p>
                        </div>
                    </div>

                    <div className="w-full relative min-h-[340px]">
                        <AnimatePresence mode="wait">
                            {view === "options" ? (
                                <motion.div
                                    key="options"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="space-y-3 w-full"
                                >
                                    <AuthButton
                                        onClick={handleGoogleLogin}
                                        disabled={isLoading}
                                        icon={
                                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                            </svg>
                                        }
                                        providerIcon={<div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />}
                                    >
                                        Continue with Google
                                    </AuthButton>

                                    <div className="grid grid-cols-2 gap-3">
                                        <AuthButton
                                            onClick={() => {
                                                setAuthMode("login");
                                                setView("email");
                                            }}
                                            variant="glass"
                                            className="px-2"
                                            icon={<LogIn className="w-4 h-4" />}
                                        >
                                            Login
                                        </AuthButton>
                                        <AuthButton
                                            onClick={() => {
                                                setAuthMode("register");
                                                setView("email");
                                            }}
                                            variant="glass-subtle"
                                            className="px-2"
                                            icon={<UserPlus className="w-4 h-4" />}
                                        >
                                            Sign Up
                                        </AuthButton>
                                    </div>

                                    <AuthButton
                                        onClick={() => setView("phone")}
                                        variant="glass-subtle"
                                        icon={<Phone className="w-4 h-4" />}
                                    >
                                        Phone Access
                                    </AuthButton>

                                    <div className="pt-4 text-center">
                                        <p className="text-[10px] text-zinc-600 leading-relaxed max-w-[280px] mx-auto uppercase tracking-widest font-bold">
                                            By continuing, you agree to our <span className="text-zinc-400 hover:text-indigo-400 cursor-pointer">User Agreement</span> and <span className="text-zinc-400 hover:text-indigo-400 cursor-pointer">Privacy Policy</span>.
                                        </p>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="form"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="w-full flex flex-col space-y-4"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <button
                                            onClick={() => {
                                                setView("options");
                                                setAuthMessage(null);
                                                setIsOtpSent(false);
                                                setOtp("");
                                            }}
                                            className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-wider p-2 rounded-xl hover:bg-white/5"
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                            Back
                                        </button>

                                        {view === "email" && (
                                            <button
                                                onClick={() => setAuthMode(authMode === "login" ? "register" : "login")}
                                                className="text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:text-indigo-300 transition-colors"
                                            >
                                                Switch to {authMode === "login" ? "Register" : "Login"}
                                            </button>
                                        )}
                                    </div>

                                    {view === "email" ? (
                                        <form onSubmit={handleAuth} className="space-y-4">
                                            <div className="space-y-3">
                                                <div className="relative group">
                                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600 group-focus-within:text-indigo-400 transition-colors" />
                                                    <input
                                                        type="email"
                                                        placeholder="name@example.com"
                                                        required
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                        className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all shadow-inner"
                                                    />
                                                </div>

                                                <div className="relative group">
                                                    <ShieldAlert className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600 group-focus-within:text-indigo-400 transition-colors" />
                                                    <input
                                                        type="password"
                                                        placeholder="Your password"
                                                        required
                                                        value={password}
                                                        onChange={(e) => setPassword(e.target.value)}
                                                        className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all shadow-inner"
                                                    />
                                                </div>
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={isLoading || !email || !password}
                                                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-2xl transition-all shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.98]"
                                            >
                                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                                                {authMode === "login" ? "Sign In" : "Register Account"}
                                            </button>
                                        </form>
                                    ) : (
                                        <div className="space-y-6">
                                            {!isOtpSent ? (
                                                <form onSubmit={handlePhoneSubmit} className="space-y-4">
                                                    <div className="relative group">
                                                        <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600 group-focus-within:text-indigo-400 transition-colors" />
                                                        <input
                                                            type="tel"
                                                            placeholder="+91 999 999 9999"
                                                            required
                                                            value={phoneNumber}
                                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                                            className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all shadow-inner"
                                                        />
                                                    </div>

                                                    <button
                                                        type="submit"
                                                        disabled={isLoading || !phoneNumber}
                                                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-2xl transition-all shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.98]"
                                                    >
                                                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-4 h-4" />}
                                                        Send OTP
                                                    </button>
                                                </form>
                                            ) : (
                                                <div className="flex flex-col items-center space-y-6 animate-in zoom-in-95 duration-300">
                                                    <AnimatedOTPInput
                                                        maxLength={6}
                                                        value={otp}
                                                        onChange={setOtp}
                                                        onComplete={handleOtpComplete}
                                                    />
                                                    <div className="flex flex-col items-center gap-2">
                                                        <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Didn&apos;t receive code?</p>
                                                        <button
                                                            onClick={handlePhoneSubmit}
                                                            className="text-xs text-indigo-400 hover:text-indigo-300 font-bold transition-colors"
                                                        >
                                                            Resend OTP
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {authMessage && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={cn(
                                                "p-4 rounded-2xl border text-sm flex items-center gap-3",
                                                authMessage.type === "success" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-red-500/10 border-red-500/20 text-red-400"
                                            )}
                                        >
                                            {authMessage.type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
                                            <span className="leading-tight">{authMessage.text}</span>
                                        </motion.div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="pt-4 border-t border-white/5 w-full text-center">
                        <p className="text-xs text-zinc-500 font-medium">
                            {authMode === "login" ? "First time here?" : "Already have an account?"}{" "}
                            <span
                                onClick={() => {
                                    setAuthMode(authMode === "login" ? "register" : "login");
                                    if (view === "options") setView("email");
                                }}
                                className="text-white hover:text-indigo-400 cursor-pointer transition-colors font-bold"
                            >
                                {authMode === "login" ? "Sign up securely" : "Sign in instead"}
                            </span>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
