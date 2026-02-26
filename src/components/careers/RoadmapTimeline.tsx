"use client";

import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface RoadmapNode {
    id: string;
    label: string;
    type: string;
    y: number;
}

interface RoadmapTimelineProps {
    title: string;
    nodes: RoadmapNode[];
}

export function RoadmapTimeline({ title, nodes }: RoadmapTimelineProps) {
    const formatTitle = (str: string) => {
        return str.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    return (
        <div className="p-8 pb-32 max-w-4xl mx-auto min-h-screen animate-in fade-in duration-1000">

            <Link href="/careers" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors mb-8 group">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm font-medium tracking-wide">Back to Careers</span>
            </Link>

            <header className="mb-16 text-center">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">
                    {formatTitle(title)} <span className="text-indigo-600 dark:text-indigo-400">Roadmap</span>
                </h1>
                <p className="text-slate-600 dark:text-slate-400 font-medium tracking-wide max-w-2xl mx-auto">
                    A strict chronological path to mastering this discipline, powered by open-source data.
                </p>
            </header>

            <div className="relative pt-12">
                {/* Center Line */}
                <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-slate-200 dark:bg-gradient-to-b dark:from-transparent dark:via-indigo-500/20 dark:to-transparent -translate-x-1/2" />

                <div className="space-y-16">
                    {nodes.map((node, i) => {
                        const isLeft = i % 2 === 0;
                        const isMainTopic = node.type === 'title';

                        return (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.5, delay: i % 5 * 0.1 }}
                                key={`${node.id}-${i}`}
                                className={`flex items-center justify-between w-full ${isLeft ? 'flex-row-reverse' : ''}`}
                            >
                                {/* Empty Spacer */}
                                <div className="w-5/12" />

                                {/* Center Node */}
                                <div className="z-10 flex items-center justify-center w-6 h-6 rounded-full bg-[#0B0B0D] border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.1)]">
                                    <div className={`w-2 h-2 rounded-full ${isMainTopic ? 'bg-indigo-400' : 'bg-slate-500'}`} />
                                </div>

                                {/* Content Card */}
                                <div className={`w-5/12 ${isLeft ? 'text-right pr-8' : 'pl-8'}`}>
                                    <div className={`glass-card p-5 group hover:border-indigo-600/30 dark:hover:border-indigo-500/30 transition-all cursor-default ${isMainTopic ? 'border-indigo-200 bg-indigo-50/50 dark:border-indigo-500/20 dark:bg-indigo-500/5' : ''}`}>
                                        <h4 className={`text-lg font-bold tracking-tight ${isMainTopic ? 'text-indigo-900 dark:text-indigo-100' : 'text-slate-900 dark:text-slate-300'}`}>
                                            {node.label}
                                        </h4>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
