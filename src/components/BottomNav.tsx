"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Calendar, Users, Layers, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function BottomNav() {
    const pathname = usePathname();
    const isPublicRoute = pathname === '/' || pathname === '/login';

    if (isPublicRoute) return null;

    const navItems = [
        { icon: Home, label: 'Home', href: '/dashboard' },
        { icon: Calendar, label: 'Calendar', href: '/calendar' },
        { icon: Users, label: 'Social', href: '/communities' },
        { icon: Layers, label: 'Career', href: '/internships' },
        { icon: User, label: 'Profile', href: '/profile' },
    ];

    return (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-zinc-950/80 backdrop-blur-xl border-t border-white/10 px-2 pb-safe-area-inset-bottom">
            <div className="flex items-center justify-around h-16 max-w-md mx-auto">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center justify-center gap-1 flex-1 min-w-0 transition-all duration-200 py-1",
                                isActive ? "text-indigo-400" : "text-slate-500 lg:hover:text-slate-300"
                            )}
                        >
                            <div className={cn(
                                "p-1.5 rounded-xl transition-all duration-200",
                                isActive ? "bg-indigo-500/10" : ""
                            )}>
                                <Icon className={cn("w-6 h-6", isActive ? "stroke-[2.5px]" : "stroke-2")} />
                            </div>
                            <span className={cn(
                                "text-[10px] font-bold uppercase tracking-tight",
                                isActive ? "opacity-100" : "opacity-60"
                            )}>
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
