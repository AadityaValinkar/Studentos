"use client";

import { useState } from 'react';
import Sidebar from './Sidebar';
import MobileHeader from './MobileHeader';
import MobileSidebar from './MobileSidebar';
import BottomNav from './BottomNav';

interface ResponsiveNavWrapperProps {
    children: React.ReactNode;
}

export default function ResponsiveNavWrapper({ children }: ResponsiveNavWrapperProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="flex flex-col lg:flex-row h-screen w-full overflow-hidden relative z-10">
            {/* Desktop Sidebar */}
            <Sidebar />

            {/* Mobile/Tablet Content Area */}
            <div className="flex flex-col flex-1 h-full overflow-hidden">
                <MobileHeader onMenuClick={() => setIsMobileMenuOpen(true)} />
                <MobileSidebar
                    isOpen={isMobileMenuOpen}
                    onClose={() => setIsMobileMenuOpen(false)}
                />

                <main className="flex-1 relative focus:outline-none overflow-y-auto w-full pb-20 lg:pb-0">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 min-h-screen">
                        {children}
                    </div>
                </main>
            </div>
            <BottomNav />
        </div>
    );
}
