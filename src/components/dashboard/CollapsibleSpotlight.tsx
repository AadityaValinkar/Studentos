"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import SpotlightCards from "@/components/ui/spotlight-cards";

export function CollapsibleSpotlight() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="flex relative h-full shrink-0 z-30">
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 450, opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: "circOut" }}
                        className="h-full border-r border-border-muted bg-bg-base overflow-hidden flex flex-col justify-center relative"
                    >
                        <div className="w-[450px] shrink-0 h-full overflow-y-auto no-scrollbar py-6 flex flex-col justify-center">
                            <SpotlightCards
                                heading="A Complete System"
                                eyebrow="Why StudentOS?"
                                className="bg-transparent"
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="absolute top-1/2 -right-4 -translate-y-1/2 w-8 h-18 bg-bg-card rounded-r-2xl border border-l-0 border-border-muted flex items-center justify-center text-text-muted hover:text-accent-primary transition-all z-40 group shadow-xl shadow-black/10 active:scale-95"
            >
                {isOpen ? (
                    <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" strokeWidth={3} />
                ) : (
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" strokeWidth={3} />
                )}
            </button>
        </div>
    );
}
