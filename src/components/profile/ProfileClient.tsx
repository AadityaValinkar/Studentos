"use client";

import { useState } from "react";
import {
    User,
    Target,
    Users,
    ArrowRight,
    ExternalLink,
    Mail,
    MapPin,
    Calendar as CalendarIcon,
    Edit3
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { EditProfileModal } from "./EditProfileModal";
import { calculateCompleteness } from "@/lib/profile-utils";

interface ProfileClientProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    initialProfile: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    user: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    memberships: any[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    targets: any[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    nextEvent: any;
}

type TabType = "overview" | "communities" | "goals" | "activity";

export function ProfileClient({ initialProfile, user, memberships, targets, nextEvent }: ProfileClientProps) {
    const [activeTab, setActiveTab] = useState<TabType>("overview");
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [profile, setProfile] = useState(initialProfile);

    const tabs = [
        { id: "overview", label: "Overview", icon: User },
        { id: "communities", label: "Communities", icon: Users },
        { id: "goals", label: "Goals", icon: Target },
    ];

    return (
        <div className="p-6 pb-20 max-w-5xl mx-auto w-full animate-in fade-in duration-700 space-y-8">
            {/* Header Section */}
            <header className="glass-panel p-8 md:p-10 relative overflow-hidden group">
                {/* Background Decor (Dark Only) */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent-primary/5 rounded-full blur-3xl -mr-32 -mt-32 hidden dark:block" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-primary/5 rounded-full blur-3xl -ml-32 -mb-32 hidden dark:block" />

                <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
                    {/* Avatar */}
                    <div className="relative group/avatar">
                        <div className="w-32 h-32 rounded-[2rem] overflow-hidden p-1 bg-gradient-to-br from-accent-primary/50 to-indigo-500/20 shadow-2xl transition-transform duration-500 group-hover/avatar:scale-105">
                            <img
                                src={profile?.avatar_url || `https://api.dicebear.com/8.x/avataaars/svg?seed=${user.email}`}
                                alt="Profile"
                                className="w-full h-full object-cover rounded-[1.8rem] bg-bg-main"
                            />
                        </div>
                        {/* Status Dot */}
                        <div className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-emerald-500 border-4 border-bg-card shadow-lg" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 space-y-4">
                        <div className="space-y-1">
                            <h1 className="text-3xl font-bold text-text-main tracking-tight">
                                {profile?.full_name || "New Student"}
                            </h1>
                            <p className="text-accent-primary font-bold text-lg tracking-wide uppercase italic opacity-80">
                                @{profile?.global_username || user.email.split('@')[0]}
                            </p>
                        </div>

                        {profile?.bio && (
                            <p className="text-text-muted max-w-xl text-sm leading-relaxed font-medium italic">
                                {'"'}{profile.bio}{'"'}
                            </p>
                        )}

                        <div className="flex flex-wrap gap-4 pt-2 justify-center md:justify-start">
                            <div className="flex items-center gap-1.5 text-text-muted text-[10px] font-bold uppercase tracking-widest bg-bg-main px-3 py-1.5 rounded-full border border-border-muted shadow-sm group/badge hover:border-accent-primary/30 transition-colors">
                                <Mail className="w-3 h-3 text-accent-primary" />
                                {user.email}
                            </div>
                            {profile?.branch && (
                                <div className="flex items-center gap-1.5 text-text-muted text-[10px] font-bold uppercase tracking-widest bg-bg-main px-3 py-1.5 rounded-full border border-border-muted shadow-sm group/badge hover:border-accent-primary/30 transition-colors">
                                    <MapPin className="w-3 h-3 text-accent-primary" />
                                    {profile.branch} &bull; Sem {profile.semester}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 shrink-0">
                        <button
                            onClick={() => setIsEditModalOpen(true)}
                            className="flex items-center gap-2 bg-text-main text-bg-card px-5 py-2.5 rounded-xl font-bold transition-all active:scale-95 shadow-xl shadow-text-main/10 text-sm hover:opacity-90"
                        >
                            <Edit3 className="w-4 h-4" />
                            Edit Profile
                        </button>
                    </div>
                </div>
            </header>

            {/* Tabs Navigation */}
            <nav className="flex items-center gap-2 p-1 bg-bg-card rounded-2xl border border-border-muted w-fit shadow-premium dark:backdrop-blur-md">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as TabType)}
                            className={cn(
                                "flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all relative overflow-hidden",
                                isActive
                                    ? "text-bg-card"
                                    : "text-text-muted hover:text-text-main"
                            )}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-text-main"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <Icon className={cn("w-4 h-4 relative z-10", isActive ? "text-bg-card" : "text-text-muted")} />
                            <span className="relative z-10">{tab.label}</span>
                        </button>
                    );
                })}
            </nav>

            {/* Tab Content */}
            <main className="min-h-[400px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                    >
                        {activeTab === "overview" && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Completeness Bar (Subtle) */}
                                {(() => {
                                    const percentage = calculateCompleteness(profile);
                                    if (percentage >= 70) return null;
                                    return (
                                        <div className="md:col-span-2 glass-panel p-6 border-accent-primary/20 bg-accent-soft flex items-center justify-between gap-6 group">
                                            <div className="space-y-1">
                                                <h4 className="text-[10px] font-bold text-accent-primary uppercase tracking-[0.2em] flex items-center gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-accent-primary animate-pulse" />
                                                    Profile Setup
                                                </h4>
                                                <p className="text-[10px] text-text-muted font-bold uppercase opacity-60">Add more details to unlock full academic insights.</p>
                                            </div>
                                            <div className="flex-1 max-w-xs space-y-2">
                                                <div className="flex justify-between text-[10px] font-bold text-accent-primary uppercase tracking-tighter">
                                                    <span>{percentage}% Complete</span>
                                                </div>
                                                <div className="h-1 bg-accent-primary/10 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${percentage}%` }}
                                                        className="h-full bg-accent-primary"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })()}

                                {/* Summary Card */}
                                <div className="glass-panel p-6 space-y-4">
                                    <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] pl-1 opacity-60">Summary</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 bg-bg-main rounded-[1.5rem] border border-border-muted shadow-sm hover:border-accent-primary/20 transition-colors">
                                            <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest mb-1 opacity-60">Communities</p>
                                            <p className="text-2xl font-light text-text-main">{memberships.length}</p>
                                        </div>
                                        <div className="p-4 bg-bg-main rounded-[1.5rem] border border-border-muted shadow-sm hover:border-accent-primary/20 transition-colors">
                                            <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest mb-1 opacity-60">Active Goals</p>
                                            <p className="text-2xl font-light text-text-main">{targets.length}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Next Event Card */}
                                {nextEvent ? (
                                    <div className="glass-panel p-6 border-accent-primary/20 bg-accent-soft relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                                            <CalendarIcon className="w-12 h-12 text-accent-primary" />
                                        </div>
                                        <div className="space-y-4 relative z-10">
                                            <h3 className="text-[10px] font-bold text-accent-primary uppercase tracking-[0.2em] pl-1">Next Big Event</h3>
                                            <div>
                                                <h4 className="text-xl font-bold text-text-main tracking-tight">{nextEvent.title}</h4>
                                                <p className="text-accent-primary font-bold text-[10px] uppercase tracking-widest opacity-60">
                                                    {format(new Date(nextEvent.start_date), "MMMM do, yyyy")}
                                                </p>
                                            </div>
                                            <Link href="/calendar" className="text-[10px] text-accent-primary font-bold uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all">
                                                View in Calendar <ArrowRight className="w-3 h-3" />
                                            </Link>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="glass-panel p-6 border-dashed border-border-muted flex flex-col items-center justify-center text-center space-y-2">
                                        <p className="text-text-muted text-sm font-medium italic opacity-60">No upcoming events scheduled.</p>
                                        <Link href="/calendar" className="text-[10px] text-accent-primary font-bold uppercase tracking-widest hover:underline">Schedule one now</Link>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === "communities" && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {memberships.length > 0 ? memberships.map((m: { community_id: string; communities: { icon?: string; name: string; slug: string; community_members?: { count: number }[] } }) => (
                                    <div key={m.community_id} className="glass-panel p-5 flex items-center justify-between group hover:bg-bg-main transition-all border-border-muted shadow-sm">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-accent-soft border border-accent/10 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform dark:backdrop-blur-md">
                                                {m.communities.icon || "🏛️"}
                                            </div>
                                            <div className="space-y-0.5">
                                                <h4 className="font-bold text-text-main tracking-tight group-hover:text-accent-primary transition-colors uppercase text-sm">
                                                    {m.communities.name}
                                                </h4>
                                                <p className="text-[10px] text-text-muted font-bold uppercase tracking-[0.2em] opacity-60">
                                                    {m.communities.community_members?.[0]?.count ?? 0} Members
                                                </p>
                                            </div>
                                        </div>
                                        <Link
                                            href={`/communities/${m.communities.slug}`}
                                            className="p-2 bg-text-main/5 rounded-lg text-text-muted hover:text-text-main hover:bg-text-main/10 transition-all shadow-sm"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                        </Link>
                                    </div>
                                )) : (
                                    <div className="col-span-full py-12 text-center space-y-4 grayscale opacity-30">
                                        <Users className="w-12 h-12 mx-auto text-text-muted" />
                                        <p className="text-text-muted text-sm font-medium">You haven&apos;t joined any communities yet.</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === "goals" && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {targets.length > 0 ? targets.map((target) => (
                                    <div key={target.id} className="glass-panel p-6 space-y-4 group transition-all border-border-muted hover:border-accent-primary/20 shadow-sm">
                                        <div className="flex justify-between items-start">
                                            <h4 className="font-bold text-text-main tracking-tight text-lg">{target.title}</h4>
                                            <span className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] opacity-60 border border-border-muted px-2 py-0.5 rounded-full">
                                                {target.type}
                                            </span>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-text-muted opacity-60">
                                                <span>Progress</span>
                                                <span>{target.target_value ? `${target.target_value}` : 'Active'}</span>
                                            </div>
                                            <div className="w-full h-1.5 bg-bg-main rounded-full overflow-hidden border border-border-muted">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: "35%" }}
                                                    className="h-full bg-accent-primary/50"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="col-span-full py-12 text-center space-y-4 grayscale opacity-30">
                                        <Target className="w-12 h-12 mx-auto text-text-muted" />
                                        <p className="text-text-muted text-sm font-medium">No goals tracked yet.</p>
                                    </div>
                                )}
                            </div>
                        )}


                    </motion.div>
                </AnimatePresence>
            </main>

            {/* Edit Modal */}
            <EditProfileModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                initialData={profile}
                userId={user.id}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onUpdate={(newProfile: any) => setProfile(newProfile)}
            />
        </div>
    );
}
