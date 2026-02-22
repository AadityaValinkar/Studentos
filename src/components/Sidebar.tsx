"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Calendar, Map, Activity, Layers, Settings, LogIn, Info, Target, Sun, Moon, Users } from 'lucide-react';
import { useSession } from "@/lib/useSession";
import { motion } from "motion/react";
import ProfileDropdown from './ui/profile-dropdown';
import AnimatedToggle from './ui/animated-toggle';
import { useTheme } from 'next-themes';
import Image from 'next/image';

export default function Sidebar() {
    const { data: session, status } = useSession();

    useEffect(() => {
        console.log("UI SESSION STATUS:", status);
        console.log("UI USER:", session?.user);
    }, [status, session]);
    const [isExpanded, setIsExpanded] = useState(false);
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const navItems = [
        { icon: Home, label: 'Dashboard', href: '/dashboard' },
        { icon: Calendar, label: 'Calendar', href: '/calendar' },
        { icon: Target, label: 'Careers', href: '/careers' },
        { icon: Map, label: 'Campus Map', href: '/map' },
        { icon: Activity, label: 'Bunk Calc', href: '/bunk' },
        { label: "Internships", href: "/internships", icon: Layers },
        { label: "Communities", href: "/communities", icon: Users },
        { label: "Why OS", href: "/why-os", icon: Info },
        { label: "Settings", href: "/settings", icon: Settings },
    ];

    const pathname = usePathname();
    const isPublicRoute = pathname === '/' || pathname === '/login';

    if (isPublicRoute) {
        return null;
    }

    return (
        <motion.div
            initial={false}
            animate={{
                width: isExpanded ? 240 : 80,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="h-[calc(100vh-2rem)] my-4 ml-4 hidden md:flex flex-col relative z-40 shrink-0"
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
        >
            <div className="flex-1 w-full bg-white/50 dark:bg-black/40 backdrop-blur-xl border border-black/10 dark:border-white/20 rounded-3xl flex flex-col p-4 shadow-[0_8px_32px_rgba(0,0,0,0.05)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden relative">

                {/* Header / Logo */}
                <div className="flex items-center gap-3 px-2 py-4 mb-8 h-12 shrink-0 overflow-hidden">
                    <Link href="/" className="w-8 h-8 rounded-xl bg-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.6)] flex flex-shrink-0 items-center justify-center hover:bg-indigo-400 transition-colors cursor-pointer group">
                        <span className="text-white font-bold text-sm group-hover:scale-110 transition-transform">OS</span>
                    </Link>
                    <motion.span
                        animate={{ opacity: isExpanded ? 1 : 0, display: isExpanded ? "block" : "none" }}
                        transition={{ duration: 0.2 }}
                        className="text-xl font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap"
                    >
                        StudentOS
                    </motion.span>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="flex items-center gap-3 px-3 py-3 rounded-2xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-all group relative"
                            >
                                <Icon className="w-5 h-5 flex-shrink-0 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors" />

                                <motion.span
                                    animate={{ opacity: isExpanded ? 1 : 0, display: isExpanded ? "block" : "none" }}
                                    className="whitespace-nowrap"
                                >
                                    {item.label}
                                </motion.span>

                                {/* Tooltip for collapsed state */}
                                {!isExpanded && (
                                    <div className="absolute left-14 px-3 py-1.5 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-xl border border-black/10 dark:border-white/10 transition-opacity">
                                        {item.label}
                                    </div>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer (Profile/Login) */}
                <div className="mt-auto pt-4 border-t border-white/5 flex flex-col gap-4">
                    {/* Theme Toggle */}
                    {mounted && (
                        <div className={isExpanded ? "flex justify-center" : "hidden"}>
                            <AnimatedToggle
                                checked={theme === 'dark'}
                                onChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                                variant="icon"
                                icons={{
                                    on: <Moon className="w-3 h-3" />,
                                    off: <Sun className="w-3 h-3" />
                                }}
                            />
                        </div>
                    )}

                    {session?.user ? (
                        <div className={isExpanded ? "block" : "hidden"}>
                            <ProfileDropdown
                                data={{
                                    name: session.user.name || "Student",
                                    email: session.user.email || "",
                                    avatar: session.user.image || "https://ferf1mheo22r9ira.public.blob.vercel-storage.com/profile-mjss82WnWBRO86MHHGxvJ2TVZuyrDv.jpeg",
                                    subscription: "PRO",
                                    model: "Gemini 1.5 Flash"
                                }}
                            />
                        </div>
                    ) : (
                        <div className={isExpanded ? "block" : "hidden"}>
                            <Link
                                href="/login"
                                className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-2xl p-3 flex items-center justify-center gap-2 transition-colors font-medium text-sm"
                            >
                                <LogIn className="w-4 h-4" />
                                Sign In
                            </Link>
                        </div>
                    )}

                    {/* Collapsed Avatar/Login Icon */}
                    {!isExpanded && (
                        <div className="flex justify-center group relative cursor-pointer pt-2">
                            <div className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-center hover:bg-black/10 dark:hover:bg-white/10 transition-colors overflow-hidden relative">
                                {session?.user?.image ? (
                                    <Image src={session.user.image} alt="User" fill sizes="40px" className="object-cover" />
                                ) : (
                                    <UserIcon />
                                )}
                            </div>
                            <div className="absolute left-14 px-3 py-1.5 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-xl border border-black/10 dark:border-white/10 transition-opacity">
                                {session?.user ? "Profile" : "Sign In"}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

function UserIcon() {
    return <LogIn className="w-4 h-4 text-slate-400" />
}
