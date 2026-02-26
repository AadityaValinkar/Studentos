"use client";

import { getDaysRemaining } from "@/lib/calculations";

import { AcademicMomentum } from "@/components/dashboard/AcademicMomentum";
import { MomentumScore } from "@/components/dashboard/MomentumScore";
import { BunkCalculatorWidget } from "@/components/dashboard/BunkCalculatorWidget";
import { RealityCheck } from "@/components/dashboard/RealityCheck";
import { GoalsSection } from "@/components/dashboard/GoalsSection";
import { NotificationBell } from "@/components/dashboard/NotificationBell";
import CompletionCard from "@/components/profile/CompletionCard";
import { UpcomingEventsWidget } from "@/components/dashboard/UpcomingEventsWidget";
import { NetworkPulse } from "@/components/dashboard/NetworkPulse";

interface DashboardClientProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    profile: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    user: any;
    unreadCount: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    initialTargets: any[];
    completeness: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    upcomingEvents: any[];
}

export default function DashboardClient({ profile, user, unreadCount, initialTargets, completeness, upcomingEvents }: DashboardClientProps) {
    const daysRemaining = profile?.semester_end_date ? getDaysRemaining(profile.semester_end_date) : null;

    return (
        <div className="font-body p-6 pb-20 max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 w-full relative">
            <header className="mb-12 flex justify-between items-start">
                <div>
                    <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-3">
                        Welcome back, <span className="text-gradient drop-shadow-sm">{profile?.full_name?.split(' ')[0] || profile?.global_username || 'Student'}</span>.
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400/80 font-medium text-base tracking-wide flex items-center gap-2">
                        {daysRemaining !== null ? (
                            <>
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                                Your semester ends in <span className="text-indigo-400 font-bold font-accent text-lg">{daysRemaining} days</span>.
                            </>
                        ) : (
                            <>
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                                Finish setting up your academic calendar to track deadlines.
                            </>
                        )}
                    </p>
                </div>

                <div className="pt-2">
                    <NotificationBell initialCount={unreadCount} userId={user.id} />
                </div>
            </header>

            {/* LAYER 1: TIME COMMAND (Primary Driver) */}
            <div className="flex flex-col gap-6 md:gap-12">
                <AcademicMomentum profile={profile} />
                <UpcomingEventsWidget initialEvents={upcomingEvents} userId={user.id} />

                <div className="md:hidden pt-4">
                    <CompletionCard percentage={completeness} />
                </div>
            </div>

            {/* LAYER 2: PERFORMANCE (Personal Status) */}
            <div className="flex flex-col gap-8 md:gap-12">
                <div className="hidden md:block">
                    <CompletionCard percentage={completeness} />
                </div>

                <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    <MomentumScore profile={profile} targets={initialTargets} />
                    <BunkCalculatorWidget />
                    <div className="md:col-span-2 lg:col-span-1">
                        <RealityCheck profile={profile} />
                    </div>
                </div>

                <div className="pt-4 md:pt-8 rounded-[2.5rem] overflow-hidden">
                    <GoalsSection initialTargets={initialTargets} userId={user.id} />
                </div>
            </div>

            {/* LAYER 3: NETWORK PULSE (FOMO Layer) */}
            <div className="pt-8 border-t border-white/5">
                <div className="max-w-md md:max-w-none">
                    <NetworkPulse />
                </div>
            </div>
        </div>
    );
}
