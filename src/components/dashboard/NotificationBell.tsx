"use client";

import { useState, useEffect } from "react";
import { Bell, Inbox, Loader2 } from "lucide-react";
import NotificationBadge from "@/components/ui/notification-badge";
import { supabaseClient } from "@/lib/supabase-client";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface Notification {
    id: string;
    title: string;
    message: string;
    read: boolean;
    created_at: string;
}

interface NotificationBellProps {
    initialCount: number;
    userId: string;
}

export function NotificationBell({ initialCount, userId }: NotificationBellProps) {
    const [count, setCount] = useState(initialCount);
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchNotifications = async () => {
        setLoading(true);
        const { data, error } = await supabaseClient
            .from("notifications")
            .select("*")
            .eq("user_id", userId)
            .order("created_at", { ascending: false })
            .limit(10);

        if (!error && data) {
            setNotifications(data);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (isOpen) {
            fetchNotifications();
            if (count > 0) {
                markAllRead();
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    const markAsRead = async (id: string) => {
        const { error } = await supabaseClient
            .from("notifications")
            .update({ read: true })
            .eq("id", id);

        if (!error) {
            setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
            setCount(prev => Math.max(0, prev - 1));
        }
    };

    const markAllRead = async () => {
        const { error } = await supabaseClient
            .from("notifications")
            .update({ read: true })
            .eq("user_id", userId)
            .eq("read", false);

        if (!error) {
            setNotifications(notifications.map(n => ({ ...n, read: true })));
            setCount(0);
        }
    };

    return (
        <div className="relative">
            <NotificationBadge count={count} max={9} variant="count" position="top-right">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center cursor-pointer hover:bg-white/10 transition-all backdrop-blur-md shadow-lg active:scale-95 group relative overflow-hidden"
                >
                    <Bell className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors relative z-10" />
                </button>
            </NotificationBadge>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-[100]"
                            onClick={() => setIsOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute right-0 mt-6 w-[26rem] bg-bg-card border border-border-muted rounded-[2.5rem] shadow-2xl z-[110] overflow-hidden"
                        >
                            <div className="p-8 border-b border-border-muted flex items-center justify-between bg-bg-base/50 relative overflow-hidden">
                                {/* Background Decor (Dark Only) */}
                                <div className="absolute top-0 right-0 w-24 h-24 bg-accent-primary/5 rounded-full blur-2xl -mr-12 -mt-12 pointer-events-none hidden dark:block" />

                                <h3 className="text-lg font-bold text-text-primary flex items-center gap-3 relative z-10">
                                    Notifications
                                    {count > 0 && <span className="bg-accent-primary text-[10px] px-2.5 py-1 rounded-full text-white font-black uppercase tracking-widest">{count} New</span>}
                                </h3>
                                {count > 0 && (
                                    <button
                                        onClick={markAllRead}
                                        className="text-[10px] font-bold text-accent-primary hover:text-accent-primary/80 uppercase tracking-widest relative z-10"
                                    >
                                        Mark all as read
                                    </button>
                                )}
                            </div>

                            <div className="max-h-[24rem] overflow-y-auto">
                                {loading && (
                                    <div className="p-12 flex flex-col items-center justify-center text-zinc-500 gap-3">
                                        <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
                                        <p className="text-sm">Fetching alerts...</p>
                                    </div>
                                )}

                                {!loading && notifications.length === 0 && (
                                    <div className="p-16 flex flex-col items-center justify-center text-center space-y-4">
                                        <div className="w-16 h-16 rounded-[2rem] bg-bg-base border border-border-muted flex items-center justify-center shadow-inner">
                                            <Inbox className="w-8 h-8 text-text-muted opacity-20" strokeWidth={1.5} />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-bold text-text-primary tracking-tight">All caught up!</p>
                                            <p className="text-xs text-text-muted opacity-60 font-medium">No new notifications at this time.</p>
                                        </div>
                                    </div>
                                )}

                                {!loading && notifications.map((n) => (
                                    <div
                                        key={n.id}
                                        onClick={() => !n.read && markAsRead(n.id)}
                                        className={cn(
                                            "p-8 border-b border-border-muted/50 transition-all cursor-pointer group relative overflow-hidden",
                                            !n.read ? "bg-accent-soft/30 hover:bg-accent-soft/50" : "hover:bg-bg-base/50"
                                        )}
                                    >
                                        {!n.read && <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent-primary shadow-[0_0_10px_rgba(99,102,241,0.5)]" />}

                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className={cn(
                                                "text-sm font-bold tracking-tight",
                                                !n.read ? "text-text-primary" : "text-text-muted group-hover:text-text-primary"
                                            )}>
                                                {n.title}
                                            </h4>
                                            {!n.read && <div className="w-2 h-2 rounded-full bg-accent-primary animate-pulse" />}
                                        </div>
                                        <p className="text-xs text-text-muted leading-relaxed font-medium opacity-70 mb-4">{n.message}</p>
                                        <p className="text-[10px] text-text-muted font-black uppercase tracking-[0.2em] opacity-30 group-hover:opacity-60 transition-opacity">
                                            {format(new Date(n.created_at), "MMM d, yyyy")}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="p-5 bg-bg-base/80 backdrop-blur-sm border-t border-border-muted text-center">
                                <button className="text-[10px] font-bold text-text-muted hover:text-accent-primary uppercase tracking-[0.2em] transition-all opacity-40 hover:opacity-100">
                                    View full history &rarr;
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
