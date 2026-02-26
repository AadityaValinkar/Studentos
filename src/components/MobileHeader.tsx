"use client";

import { Menu } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface MobileHeaderProps {
    onMenuClick: () => void;
}

export default function MobileHeader({ onMenuClick }: MobileHeaderProps) {
    const pathname = usePathname();
    const isPublicRoute = pathname === '/' || pathname === '/login';

    if (isPublicRoute) return null;

    return (
        <div className="lg:hidden px-4 pt-4 pb-2 sticky top-0 z-50 mt-safe">
            <header className="
                backdrop-blur-xl 
                bg-white/5 dark:bg-white/5 
                border border-white/10 dark:border-white/10 
                rounded-3xl 
                px-5 py-4 
                flex items-center justify-between 
                shadow-2xl shadow-black/20
            ">
                <div className="flex items-center gap-3">
                    <Link href="/dashboard" className="w-10 h-10 rounded-2xl bg-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.4)] flex items-center justify-center transition-transform active:scale-95">
                        <span className="text-white font-black text-xs tracking-tighter">stOS</span>
                    </Link>
                    <div className="flex flex-col -gap-1">
                        <span className="text-sm font-black tracking-tight text-white uppercase">StudentOS</span>
                        <span className="text-[10px] font-bold text-indigo-400/80 uppercase tracking-widest leading-none">V2.0.4</span>
                    </div>
                </div>

                <button
                    onClick={onMenuClick}
                    className="p-2 -mr-1 text-slate-400 active:text-white transition-colors flex items-center justify-center"
                    aria-label="Open menu"
                >
                    <div className="bg-white/5 p-2 rounded-xl border border-white/5">
                        <Menu className="w-5 h-5 text-slate-300" />
                    </div>
                </button>
            </header>
        </div>
    );
}
