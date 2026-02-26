"use client";

import { useState, useEffect } from "react";
import { Briefcase, MapPin, Loader2, Sparkles, Navigation, Globe, Target } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";

// Our curated mock data identifying different sectors/roles
const OPPORTUNITIES = [
    {
        id: "1",
        title: "Agricultural Supply Chain Intern",
        company: "AgriTech Innovations",
        location: "Bagalkot / Hybrid",
        stipend: "15K/month",
        status: "Open",
        contactRef: "7020938597",
        tags: ["Logistics", "Sustainability", "Operations"],
        description: "Join us in revolutionizing the agricultural supply chain using modern logistical tracking.",
        url: "#"
    },
    {
        id: "2",
        title: "Frontend Engineering Intern",
        company: "NextGen Solutions",
        location: "Remote",
        stipend: "40K/month",
        status: "High Demand",
        contactRef: "7020938597",
        tags: ["React", "TypeScript", "Tailwind"],
        description: "Looking for an energetic frontend engineer to help build the future of our web platforms.",
        url: "#"
    },
    {
        id: "3",
        title: "Data Analysis Intern",
        company: "FinCloud Analytics",
        location: "Bangalore",
        stipend: "30K/month",
        status: "Closing Soon",
        contactRef: "7020938597",
        tags: ["Python", "SQL", "Dashboarding"],
        description: "Analyze vast amounts of financial data to extract actionable insights for our clients.",
        url: "#"
    },
    {
        id: "4",
        title: "Product Design (UI/UX)",
        company: "Creative Studio Alpha",
        location: "Remote",
        stipend: "25K/month",
        status: "Open",
        contactRef: "7020938597",
        tags: ["Figma", "Prototyping", "User Research"],
        description: "Design elegant, user-centric interfaces and conduct fundamental user research.",
        url: "#"
    }
];

export default function InternshipsGlobalPage() {
    const [jobs, setJobs] = useState<typeof OPPORTUNITIES>([]);
    const [selectedJob, setSelectedJob] = useState<typeof OPPORTUNITIES[0] | null>(null);
    const [isLoadingJobs, setIsLoadingJobs] = useState(true);

    useEffect(() => {
        async function loadJobs() {
            try {
                const res = await fetch("/api/internships/list");
                if (res.ok) {
                    const data = await res.json();
                    const mapped = data.map((d: {
                        id: number | string;
                        title?: string;
                        organization?: string;
                        locations_derived?: string[];
                        location_type?: string;
                        salary_raw?: { value?: { minValue?: number } };
                        seniority?: string;
                        linkedin_org_industry?: string;
                        linkedin_org_description?: string;
                        url?: string;
                    }) => ({
                        id: String(d.id),
                        title: d.title || "Internship Role",
                        company: d.organization || "Company",
                        location: (d.locations_derived && d.locations_derived[0]) || d.location_type || "Remote",
                        stipend: d.salary_raw?.value?.minValue ? `$${d.salary_raw.value.minValue}/hr` : "Unpaid / Varies",
                        status: d.seniority === "Internship" ? "Open" : "Active",
                        contactRef: "7020938597", // dummy to show CEDOK UI seamlessly
                        tags: [d.linkedin_org_industry || "Tech"].filter(Boolean),
                        description: d.linkedin_org_description || "No extensive description provided.",
                        url: d.url || "#"
                    }));
                    setJobs(mapped.length > 0 ? mapped : OPPORTUNITIES);
                } else {
                    setJobs(OPPORTUNITIES); // Fallback to mocks
                }
            } catch (e: unknown) {
                console.error(e);
                setJobs(OPPORTUNITIES);
            } finally {
                setIsLoadingJobs(false);
            }
        }
        loadJobs();
    }, []);

    const router = useRouter();

    const handleViewDetails = (job: typeof OPPORTUNITIES[0]) => {
        if (window.innerWidth < 1024) {
            router.push(`/internships/${job.id}`);
        } else {
            setSelectedJob(job);
        }
    };

    return (
        <div className="p-8 pb-32 max-w-7xl mx-auto min-h-screen animate-in fade-in slide-in-from-bottom-4 duration-1000 relative">

            {/* Ambient Glow */}
            <div className="absolute top-1/4 right-0 w-[800px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />

            <header className="mb-12 border-b border-white/5 pb-8 relative z-10 pt-4">
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                        <Globe className="w-8 h-8 text-emerald-400" strokeWidth={1.5} />
                    </div>
                    <h1 className="text-4xl font-light tracking-wide text-white">
                        Global <span className="font-medium text-emerald-400">Marketplace</span>
                    </h1>
                </div>
                <p className="text-slate-400 font-light tracking-wide max-w-2xl text-lg">
                    Discover high-impact opportunities. Select an internship to view its full details and securely apply.
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">

                {/* Left Side: The Global Grid */}
                <div className="lg:col-span-7 xl:col-span-8 space-y-6">
                    {isLoadingJobs ? (
                        <div className="flex justify-center items-center h-64">
                            <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                            {jobs.map((job) => (
                                <div
                                    key={job.id}
                                    onClick={() => handleViewDetails(job)}
                                    className={`glass-card p-6 rounded-2xl cursor-pointer transition-all duration-300 group ${selectedJob?.id === job.id
                                        ? 'border-emerald-500/40 bg-emerald-500/5 shadow-[0_0_30px_rgba(16,185,129,0.1)]'
                                        : 'hover:border-emerald-500/20 hover:-translate-y-1'
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-xl font-medium text-white group-hover:text-emerald-300 transition-colors leading-tight">
                                            {job.title}
                                        </h3>
                                        <span className={`text-[10px] font-bold px-3 py-1 uppercase tracking-wider rounded-md border whitespace-nowrap ml-4 ${job.status === 'Open' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                            job.status === 'High Demand' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                                'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                            }`}>
                                            {job.status}
                                        </span>
                                    </div>

                                    <p className="text-emerald-400/80 text-sm mb-6 flex items-center gap-2 font-medium tracking-wide">
                                        <Briefcase className="w-4 h-4" />
                                        {job.company}
                                    </p>

                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {job.tags.map(tag => (
                                            <span key={tag} className="px-2.5 py-1 rounded-md bg-white/5 border border-white/5 text-xs text-slate-300 font-light tracking-wider">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="flex items-center justify-between text-sm text-slate-400 border-t border-white/5 pt-4">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4" />
                                            <span className="font-light">{job.location}</span>
                                        </div>
                                        <div className="font-medium text-emerald-300 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                                            {job.stipend}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Side: Dynamic Details Panel */}
                <div className="lg:col-span-5 xl:col-span-4">
                    <div className="sticky top-8">
                        {/* Empty State */}
                        {!selectedJob && (
                            <div className="glass-panel p-12 text-center rounded-3xl flex flex-col items-center justify-center min-h-[400px]">
                                <Navigation className="w-12 h-12 text-slate-600 mb-6" strokeWidth={1} />
                                <h3 className="text-xl text-slate-300 font-light mb-2">Select an Opportunity</h3>
                                <p className="text-slate-500 font-light tracking-wide text-sm leading-relaxed">
                                    Click on any internship card to view the official details and proceed to the application.
                                </p>
                            </div>
                        )}

                        {/* Success State (Profile Data Rendered) */}
                        <AnimatePresence>
                            {selectedJob && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="glass-panel p-8 rounded-3xl border-emerald-500/20 shadow-2xl shadow-emerald-500/5 max-h-[calc(100vh-100px)] overflow-y-auto no-scrollbar"
                                >
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-6">
                                        <Sparkles className="w-3 h-3" />
                                        Opportunity Details
                                    </div>

                                    <div className="mb-8">
                                        <h2 className="text-2xl font-light text-white leading-tight mb-2">
                                            {selectedJob.company}
                                        </h2>
                                        <p className="text-sm text-slate-400">{selectedJob.title}</p>
                                    </div>

                                    <div className="space-y-6 text-sm">
                                        <div className="p-4 bg-black/20 rounded-xl border border-white/5 space-y-4">
                                            <p className="text-slate-300 font-light leading-relaxed whitespace-pre-wrap">
                                                {selectedJob.description}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs text-slate-500 uppercase tracking-widest mb-4 mt-6 font-bold">OS Integration</p>
                                            <div className="grid grid-cols-2 gap-3 mb-6">
                                                <button
                                                    onClick={() => {/* Logic to add to Goals */ }}
                                                    className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all group"
                                                >
                                                    <Target className="w-5 h-5 text-slate-400 group-hover:text-emerald-400 mb-2" />
                                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Track Goal</span>
                                                </button>
                                                <button
                                                    onClick={() => {/* Logic to add to Calendar */ }}
                                                    className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all group"
                                                >
                                                    <Navigation className="w-5 h-5 text-slate-400 group-hover:text-emerald-400 mb-2" />
                                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Set Deadline</span>
                                                </button>
                                            </div>

                                            <p className="text-xs text-slate-500 uppercase tracking-widest mb-2 font-bold">External Application</p>
                                            <a href={selectedJob.url} target="_blank" rel="noopener noreferrer" className="w-full bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl p-4 flex items-center justify-center gap-3 transition-colors shadow-[0_4px_20px_rgba(16,185,129,0.3)]">
                                                <Globe className="w-4 h-4" />
                                                <span className="font-medium tracking-wide">Apply on Official Site</span>
                                            </a>
                                        </div>

                                    </div>

                                </motion.div>
                            )}
                        </AnimatePresence>

                    </div>
                </div>
            </div>
        </div>
    );
}
