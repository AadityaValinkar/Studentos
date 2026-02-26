"use client";

import { Globe, Navigation, Target, ArrowLeft, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";

// Mock data to match parent
const OPPORTUNITIES = [
    {
        id: "1",
        title: "Agricultural Supply Chain Intern",
        company: "AgriTech Innovations",
        location: "Bagalkot / Hybrid",
        stipend: "15K/month",
        status: "Open",
        description: "Join us in revolutionizing the agricultural supply chain using modern logistical tracking.",
        url: "#",
        tags: ["Logistics", "Sustainability", "Operations"]
    },
    {
        id: "2",
        title: "Frontend Engineering Intern",
        company: "NextGen Solutions",
        location: "Remote",
        stipend: "40K/month",
        status: "High Demand",
        description: "Looking for an energetic frontend engineer to help build the future of our web platforms.",
        url: "#",
        tags: ["React", "TypeScript", "Tailwind"]
    },
    {
        id: "3",
        title: "Data Analysis Intern",
        company: "FinCloud Analytics",
        location: "Bangalore",
        stipend: "30K/month",
        status: "Closing Soon",
        description: "Analyze vast amounts of financial data to extract actionable insights for our clients.",
        url: "#",
        tags: ["Python", "SQL", "Dashboarding"]
    },
    {
        id: "4",
        title: "Product Design (UI/UX)",
        company: "Creative Studio Alpha",
        location: "Remote",
        stipend: "25K/month",
        status: "Open",
        description: "Design elegant, user-centric interfaces and conduct fundamental user research.",
        url: "#",
        tags: ["Figma", "Prototyping", "User Research"]
    }
];

export default function InternshipDetailPage({ params }: { params: { id: string } }) {
    const { id } = params;
    const router = useRouter();
    const job = OPPORTUNITIES.find(j => j.id === id);

    if (!job) {
        return (
            <div className="p-8 text-center bg-[#0a0a0a] min-h-screen text-white flex flex-col items-center justify-center">
                <p className="text-slate-400 mb-6">Internship not found.</p>
                <button onClick={() => router.back()} className="text-emerald-400 font-bold">Go Back</button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-6 pb-32">
            <button
                onClick={() => router.back()}
                className="mb-8 flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
            >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back to Marketplace</span>
            </button>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel p-8 rounded-[2.5rem] border-emerald-500/20 shadow-2xl shadow-emerald-500/5"
            >
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-6">
                    <Sparkles className="w-3 h-3" />
                    Opportunity Details
                </div>

                <div className="mb-8">
                    <h1 className="text-3xl font-light leading-tight mb-2">
                        {job.company}
                    </h1>
                    <p className="text-slate-400 font-medium">{job.title}</p>
                </div>

                <div className="flex flex-wrap gap-2 mb-8">
                    {job.tags.map(tag => (
                        <span key={tag} className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 font-medium whitespace-nowrap">
                            {tag}
                        </span>
                    ))}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="p-4 rounded-3xl bg-white/5 border border-white/5 flex flex-col gap-1">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Stipend</span>
                        <span className="text-emerald-400 font-bold">{job.stipend}</span>
                    </div>
                    <div className="p-4 rounded-3xl bg-white/5 border border-white/5 flex flex-col gap-1">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Location</span>
                        <span className="text-slate-300 font-medium text-xs line-clamp-1">{job.location}</span>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="p-6 bg-black/20 rounded-[2rem] border border-white/5">
                        <p className="text-slate-300 font-light leading-relaxed whitespace-pre-wrap text-sm md:text-base">
                            {job.description}
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-xs text-slate-500 uppercase tracking-[0.2em] font-black">OS Integration</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <button className="flex flex-col items-center justify-center p-6 rounded-3xl bg-white/5 border border-white/10 active:border-emerald-500/30 active:bg-emerald-500/5 transition-all gap-3">
                                <Target className="w-6 h-6 text-slate-400" />
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Track Goal</span>
                            </button>
                            <button className="flex flex-col items-center justify-center p-6 rounded-3xl bg-white/5 border border-white/10 active:border-emerald-500/30 active:bg-emerald-500/5 transition-all gap-3">
                                <Navigation className="w-6 h-6 text-slate-400" />
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Set Deadline</span>
                            </button>
                        </div>

                        <a
                            href={job.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full bg-emerald-500 active:bg-emerald-400 text-white rounded-[1.5rem] py-5 px-6 flex items-center justify-center gap-3 transition-colors shadow-xl shadow-emerald-500/20"
                        >
                            <Globe className="w-5 h-5" />
                            <span className="font-bold tracking-wide">Apply on Official Site</span>
                        </a>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
