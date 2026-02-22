"use client";

import SpotlightCards from "@/components/ui/spotlight-cards";

export default function WhyOSPage() {
    return (
        <div className="p-8 pb-20 max-w-7xl mx-auto min-h-screen flex items-center justify-center animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <SpotlightCards
                heading="A Complete System"
                eyebrow="Why StudentOS?"
                className="bg-transparent max-w-5xl"
            />
        </div>
    );
}
