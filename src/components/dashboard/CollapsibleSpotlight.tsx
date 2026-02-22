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
                        className="h-full border-r border-[#1e2230] bg-[#0c0d12] overflow-hidden flex flex-col justify-center relative"
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
                className="absolute top-1/2 -right-4 -translate-y-1/2 w-8 h-16 bg-[#1e2230] rounded-r-xl border border-l-0 border-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors z-40 group shadow-lg"
            >
                {isOpen ? (
                    <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
                ) : (
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                )}
            </button>
        </div>
    );
}
