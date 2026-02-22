"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Settings, CreditCard, FileText, LogOut, User, Target, ChevronUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { signOut } from "@/lib/useSession";
import { AnimatePresence, motion } from "framer-motion";

interface Profile {
    name: string;
    email: string;
    avatar: string;
    subscription?: string;
    model?: string;
}

interface MenuItem {
    label: string;
    value?: string;
    href: string;
    icon: React.ReactNode;
}

const SAMPLE_PROFILE_DATA: Profile = {
    name: "Eugene An",
    email: "eugene@kokonutui.com",
    avatar: "https://ferf1mheo22r9ira.public.blob.vercel-storage.com/profile-mjss82WnWBRO86MHHGxvJ2TVZuyrDv.jpeg",
    subscription: "PRO",
    model: "Gemini 2.0 Flash",
};

interface ProfileDropdownProps extends React.HTMLAttributes<HTMLDivElement> {
    data?: Profile;
}

export default function ProfileDropdown({
    data = SAMPLE_PROFILE_DATA,
    className,
    ...props
}: ProfileDropdownProps) {
    const [isOpen, setIsOpen] = React.useState(false);
    const dropdownRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    const menuItems: MenuItem[] = [
        {
            label: "Edit Profile",
            href: "/settings?tab=profile",
            icon: <User className="w-4 h-4" />,
        },
        {
            label: "Set Goals",
            href: "/dashboard?action=set-goal",
            icon: <Target className="w-4 h-4" />,
        },
        {
            label: "Subscription",
            value: data.subscription,
            href: "/settings?tab=billing",
            icon: <CreditCard className="w-4 h-4" />,
        },
        {
            label: "Settings",
            href: "/settings",
            icon: <Settings className="w-4 h-4" />,
        },
        {
            label: "Help & Support",
            href: "/help",
            icon: <FileText className="w-4 h-4" />,
        },
    ];

    return (
        <div className={cn("relative w-full", className)} {...props} ref={dropdownRef}>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="absolute bottom-full left-0 mb-3 w-full p-2 bg-white/95 dark:bg-[#151821]/95 backdrop-blur-xl border border-zinc-200/50 dark:border-white/10 rounded-2xl shadow-2xl z-50 origin-bottom"
                    >
                        <div className="space-y-1">
                            {menuItems.map((item) => (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center justify-between p-2.5 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-xl transition-colors group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="text-zinc-400 dark:text-zinc-500 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors">
                                            {item.icon}
                                        </div>
                                        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200 group-hover:text-zinc-950 dark:group-hover:text-white transition-colors tracking-tight">
                                            {item.label}
                                        </span>
                                    </div>
                                    {item.value && (
                                        <span className={cn(
                                            "text-xs font-semibold px-2 py-0.5 rounded-md tracking-tight",
                                            item.label === "Model"
                                                ? "bg-indigo-50 text-indigo-500 dark:bg-indigo-500/10 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-500/10"
                                                : "bg-purple-50 text-purple-500 dark:bg-purple-500/10 dark:text-purple-400 border border-purple-200/50 dark:border-purple-500/10"
                                        )}>
                                            {item.value}
                                        </span>
                                    )}
                                </Link>
                            ))}
                        </div>

                        <div className="h-px bg-zinc-200 dark:bg-white/10 my-2" />

                        <button
                            type="button"
                            onClick={() => {
                                setIsOpen(false);
                                signOut();
                            }}
                            className="w-full flex items-center gap-3 p-2.5 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 rounded-xl transition-colors group border border-transparent hover:border-red-200 dark:hover:border-red-500/30"
                        >
                            <LogOut className="w-4 h-4 text-red-500 dark:text-red-400 group-hover:text-red-600 dark:group-hover:text-red-300" />
                            <span className="text-sm font-medium tracking-tight text-red-500 dark:text-red-400 group-hover:text-red-600 dark:group-hover:text-red-300">
                                Sign Out
                            </span>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "flex items-center gap-2 p-2 w-full border transition-all duration-200 focus:outline-none rounded-2xl",
                    isOpen
                        ? "bg-zinc-100 dark:bg-white/10 border-zinc-300 dark:border-white/20 shadow-inner"
                        : "bg-white/50 dark:bg-[#151821]/50 border-zinc-200 dark:border-white/10 hover:bg-zinc-50 dark:hover:bg-[#1f2330] hover:border-zinc-300 dark:hover:border-white/20 shadow-sm"
                )}
            >
                <div className="flex-1 min-w-0 pr-1 pl-1 text-left space-y-0.5">
                    <div className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 truncate">
                        {data.name}
                    </div>
                    <div className="text-xs font-medium tracking-tight text-zinc-500 dark:text-zinc-400 truncate">
                        {data.email}
                    </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                    <ChevronUp className={cn(
                        "w-3 h-3 text-zinc-400 transition-transform duration-200",
                        isOpen && "rotate-180 text-zinc-600 dark:text-zinc-200"
                    )} />
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-[1.5px] shadow-sm">
                        <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-zinc-900">
                            <Image
                                src={data.avatar}
                                alt={data.name}
                                width={36}
                                height={36}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </button>
        </div>
    );
}
