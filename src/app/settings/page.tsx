"use client";

import { useSession, signOut } from "@/lib/useSession";
import { Shield, Monitor } from "lucide-react";

export default function SettingsPage() {
    useSession();

    return (
        <div className="p-8 pb-20 max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <header className="mb-10">
                <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Settings</h1>
                <p className="text-slate-400">Manage your profile, preferences, and system behavior.</p>
            </header>

            <div className="space-y-8">
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
