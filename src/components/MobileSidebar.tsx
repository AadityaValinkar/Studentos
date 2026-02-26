"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Calendar, Activity, Layers, Settings, LogIn, Info, Target, Users, Search, Plus, X } from 'lucide-react';
import { useSession } from "@/lib/useSession";
import { motion, AnimatePresence } from "motion/react";
import ProfileDropdown from './ui/profile-dropdown';
import { supabaseClient } from '@/lib/supabase-client';
import { calculateCompleteness, ProfileData } from '@/lib/profile-utils';

interface MobileSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
    const { data: session, status } = useSession();
    const [completeness, setCompleteness] = useState(0);
    const pathname = usePathname();

    useEffect(() => {
        const fetchCompleteness = async () => {
            if (session?.user?.id) {
                const { data } = await supabaseClient
                    .from('profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();

                if (data) {
                    setCompleteness(calculateCompleteness(data as ProfileData));
                }
            }
        };

        if (status === 'authenticated') {
            fetchCompleteness();
        }
    }, [session?.user?.id, status]);

    useEffect(() => {
        // Close sidebar on navigation
        onClose();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname]);

    const navItems = [
        { icon: Home, label: 'Dashboard', href: '/dashboard' },
        { icon: Calendar, label: 'Calendar', href: '/calendar' },
        { icon: Target, label: 'Careers', href: '/careers' },
        { icon: Activity, label: 'Bunk Calc', href: '/bunk' },
        { label: "Internships", href: "/internships", icon: Layers },
        { label: "Communities", href: "/communities", icon: Users },
        { label: "Why OS", href: "/why-os", icon: Info },
        { label: "Settings", href: "/settings", icon: Settings },
    ];

    const isCommunitiesRoute = pathname.startsWith('/communities');

    const communityNavItems = [
        { icon: Home, label: 'Back to Dashboard', href: '/dashboard' },
        { icon: Users, label: 'Feed', href: '/communities' },
        { icon: Search, label: 'Discover', href: '/communities/discover' },
        { icon: Layers, label: 'My Communities', href: '/communities/mine' },
        { icon: Plus, label: 'Create Community', href: '/communities/create' },
    ];

    const currentNavItems = isCommunitiesRoute ? communityNavItems : navItems;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: "-100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "-100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed inset-y-0 left-0 w-[280px] bg-zinc-950 border-r border-white/10 z-[70] lg:hidden flex flex-col"
                    >
                        <div className="p-6 flex items-center justify-between border-b border-white/5">
                            <div className="flex items-center gap-3">
                                <Link href="/" className="w-8 h-8 rounded-xl bg-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.6)] flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">OS</span>
                                </Link>
                                <span className="text-lg font-bold tracking-tight text-white">StudentOS</span>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 -mr-2 text-slate-400 hover:text-white transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
                            {currentNavItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.href;

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`flex items-center gap-4 px-4 py-4 rounded-2xl text-base font-semibold transition-all min-h-[56px] ${isActive
                                            ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                                            : "text-slate-400 hover:text-white hover:bg-white/5"
                                            }`}
                                    >
                                        <Icon className={`w-6 h-6 ${isActive ? "text-indigo-400" : ""}`} />
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </nav>

                        <div className="p-4 border-t border-white/5">
                            {session?.user ? (
                                <ProfileDropdown
                                    data={{
                                        name: session.user.name || "Student",
                                        email: session.user.email || "",
                                        avatar: session.user.image || "https://ferf1mheo22r9ira.public.blob.vercel-storage.com/profile-mjss82WnWBRO86MHHGxvJ2TVZuyrDv.jpeg",
                                        subscription: "PRO",
                                        model: "Gemini 1.5 Flash"
                                    }}
                                    percentage={completeness}
                                />
                            ) : (
                                <Link
                                    href="/login"
                                    className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-2xl p-4 flex items-center justify-center gap-2 transition-colors font-medium min-h-[48px]"
                                >
                                    <LogIn className="w-5 h-5" />
                                    Sign In
                                </Link>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
