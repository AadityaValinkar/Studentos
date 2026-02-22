"use client";

import { useSession, signOut } from "@/lib/useSession";
import Image from "next/image";
import { User, Shield, Monitor } from "lucide-react";

export default function SettingsPage() {
    const { data: session } = useSession();

    return (
        <div className="p-8 pb-20 max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <header className="mb-10">
                <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Settings</h1>
                <p className="text-slate-400">Manage your profile, preferences, and system behavior.</p>
            </header>

            <div className="space-y-8">
                {/* Account Section */}
                <section>
                    <h2 className="text-xl font-semibold tracking-tight text-white mb-4 flex items-center gap-2">
                        <User className="w-5 h-5 text-indigo-400" />
                        Account Details
                    </h2>
                    <div className="glass-panel p-6 rounded-2xl space-y-6">
                        <div className="flex items-center gap-6">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 p-1 shrink-0">
                                <div className="w-full h-full bg-[#12141c] rounded-full overflow-hidden flex items-center justify-center">
                                    {session?.user?.image ? (
                                        <Image src={session.user.image} alt="Profile" width={80} height={80} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-xl font-bold text-white shrink-0">
                                            {session?.user?.name?.[0]?.toUpperCase() || "S"}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-medium text-white">{session?.user?.name || "Student"}</h3>
                                <p className="text-slate-400 mb-3">{session?.user?.email || "No email provided"}</p>
                                <button className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-white font-medium transition-colors">
                                    Change Avatar
                                </button>
                            </div>
                        </div>

                        <div className="border-t border-white/5 pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase text-slate-500">Display Name</label>
                                <input
                                    type="text"
                                    defaultValue={session?.user?.name || ""}
                                    className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 transition-colors"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase text-slate-500">Email Address</label>
                                <input
                                    type="email"
                                    defaultValue={session?.user?.email || ""}
                                    disabled
                                    className="w-full bg-black/20 border border-white/5 rounded-xl px-4 py-3 text-slate-400 cursor-not-allowed"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Preferences Section */}
                <section>
                    <h2 className="text-xl font-semibold tracking-tight text-white mb-4 flex items-center gap-2">
                        <Monitor className="w-5 h-5 text-emerald-400" />
                        Preferences
                    </h2>
                    <div className="glass-panel rounded-2xl divide-y divide-white/5">
                        <div className="p-6 flex items-center justify-between">
                            <div>
                                <h3 className="font-medium text-white">Dark Theme</h3>
                                <p className="text-sm text-slate-400">StudentOS is currently locked in dark theme for maximum focus.</p>
                            </div>
                            <div className="w-12 h-6 bg-indigo-500 rounded-full relative cursor-pointer">
                                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                            </div>
                        </div>
                        <div className="p-6 flex items-center justify-between">
                            <div>
                                <h3 className="font-medium text-white">Push Notifications</h3>
                                <p className="text-sm text-slate-400">Receive alerts when your academic momentum drops.</p>
                            </div>
                            <div className="w-12 h-6 bg-white/10 rounded-full relative cursor-pointer">
                                <div className="absolute left-1 top-1 w-4 h-4 bg-slate-400 rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Danger Zone */}
                <section>
                    <h2 className="text-xl font-semibold tracking-tight text-red-400 mb-4 flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        Danger Zone
                    </h2>
                    <div className="border border-red-500/20 bg-red-500/5 rounded-2xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-medium text-white">Sign Out of StudentOS</h3>
                                <p className="text-sm text-slate-400">Securely end your session on this device.</p>
                            </div>
                            <button
                                onClick={() => signOut()}
                                className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg font-medium transition-colors"
                            >
                                Sign Out
                            </button>
                        </div>
                        <div className="border-t border-red-500/10 mt-6 pt-6 flex items-center justify-between">
                            <div>
                                <h3 className="font-medium text-white">Delete Account</h3>
                                <p className="text-sm text-slate-500">Permanently delete your data and predictive models.</p>
                            </div>
                            <button className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                                Delete Account
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
