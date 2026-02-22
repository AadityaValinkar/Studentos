"use client";
import { useState } from "react";
import { generateRoadmap } from "./actions";
import { Map, Loader2, Sparkles, BookOpen } from "lucide-react";

export default function RoadmapPage() {
    const [loading, setLoading] = useState(false);
    const [roadmap, setRoadmap] = useState<Array<{ step: string, title: string, description: string, resources: string[] }>>([]);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        collegeTier: "Tier 3",
        branch: "Computer Science",
        destination: "MS in US (Top 50 Univ)",
    });

    const handleGenerate = async () => {
        setLoading(true);
        setError("");
        setRoadmap([]);

        try {
            const res = await generateRoadmap(formData.collegeTier, formData.branch, formData.destination);
            if (res.success) {
                setRoadmap(res.data);
            } else {
                setError(res.error || "Failed to generate");
            }
        } catch {
            setError("An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 pb-20 max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <header className="mb-10 flex items-center justify-between border-b border-white/5 pb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-2 flex items-center gap-3">
                        <Sparkles className="w-8 h-8 text-indigo-400" />
                        AI Career Roadmap
                    </h1>
                    <p className="text-slate-400 max-w-xl text-sm leading-relaxed">
                        Powered by Gemini. Generate a brutally honest, actionable path to your goal based on your current reality.
                    </p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="glass-panel p-6 rounded-2xl h-fit sticky top-8">
                    <h3 className="font-semibold text-white mb-6">Current Reality</h3>

                    <div className="space-y-4 text-sm">
                        <div>
                            <label className="block text-slate-400 mb-1.5">College Background</label>
                            <select
                                value={formData.collegeTier}
                                onChange={(e) => setFormData({ ...formData, collegeTier: e.target.value })}
                                className="w-full bg-[#151821] border border-white/10 rounded-lg px-3 py-2.5 text-white focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-shadow"
                            >
                                <option>Tier 1 (IIT/NIT/BITS)</option>
                                <option>Tier 2 (Good State Govt/Pvt)</option>
                                <option>Tier 3 (Local Pvt)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-slate-400 mb-1.5">Branch</label>
                            <input
                                type="text"
                                value={formData.branch}
                                onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                                className="w-full bg-[#151821] border border-white/10 rounded-lg px-3 py-2.5 text-white focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-shadow"
                            />
                        </div>

                        <div>
                            <label className="block text-slate-400 mb-1.5">Ultimate Goal</label>
                            <input
                                type="text"
                                value={formData.destination}
                                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                                className="w-full bg-[#151821] border border-white/10 rounded-lg px-3 py-2.5 text-white focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-shadow"
                            />
                        </div>
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={loading}
                        className="w-full mt-8 bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-3 rounded-xl transition-all flex items-center justify-center gap-2 group shadow-[0_0_15px_rgba(99,102,241,0.2)] hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] disabled:opacity-50 disabled:pointer-events-none"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Map className="w-4 h-4 group-hover:scale-110 transition-transform" />}
                        {loading ? "Aligning Stars..." : "Generate Strategy"}
                    </button>

                    {error && <p className="text-red-400 text-xs mt-4 bg-red-500/10 p-3 rounded-lg border border-red-500/20">{error}</p>}
                </div>

                <div className="lg:col-span-2 space-y-6 relative">
                    {roadmap.length > 0 ? (
                        <div className="relative border-l-2 border-indigo-500/30 ml-4 space-y-8 pb-8 animate-in fade-in slide-in-from-right-4 duration-700">
                            {roadmap.map((step, idx) => (
                                <div key={idx} className="relative pl-8">
                                    <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]" />

                                    <div className="glass-card p-6 rounded-2xl hover:border-indigo-500/30 transition-colors duration-300 group">
                                        <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">{step.step}</span>
                                        <h4 className="text-xl font-bold text-white mt-1 mb-3 group-hover:text-indigo-300 transition-colors">{step.title}</h4>
                                        <p className="text-sm text-slate-400 leading-relaxed mb-6">{step.description}</p>

                                        <div className="bg-[#151821]/80 rounded-xl p-4 border border-white/5">
                                            <h5 className="flex items-center gap-2 text-xs font-semibold text-slate-300 mb-3 uppercase tracking-wider">
                                                <BookOpen className="w-3.5 h-3.5 text-indigo-400" /> Key Actions & Resources
                                            </h5>
                                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                {step.resources?.map((res: string, rIdx: number) => (
                                                    <li key={rIdx} className="text-xs text-slate-400 flex items-center gap-2">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500/50 flex-shrink-0" />
                                                        <span className="truncate" title={res}>{res}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 border border-dashed border-white/10 rounded-2xl bg-[#1e2230]/10">
                            <Sparkles className="w-12 h-12 text-indigo-500/30 mb-4" />
                            <h3 className="text-lg font-medium text-slate-300 mb-2">Strategy Canvas Empty</h3>
                            <p className="text-sm text-slate-500 max-w-sm">Enter your current reality and destination on the left to generate a brutally honest, personalized timeline.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
