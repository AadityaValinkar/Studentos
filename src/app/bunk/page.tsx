"use client";
import { useState } from "react";
import { calculateBunkStats } from "@/lib/bunkCalculator";
import { Activity, ShieldCheck, AlertTriangle, AlertCircle } from "lucide-react";

export default function BunkCalculatorPage() {
    const [total, setTotal] = useState(150);
    const [attended, setAttended] = useState(120);
    const [target, setTarget] = useState(75);

    const stats = calculateBunkStats(total, attended, target);

    const getStatusIcon = () => {
        switch (stats.status) {
            case "Safe": return <ShieldCheck className="w-12 h-12 text-green-400" />;
            case "Warning": return <AlertTriangle className="w-12 h-12 text-orange-400" />;
            case "Critical": return <AlertCircle className="w-12 h-12 text-red-400" />;
        }
    };

    const getStatusColor = () => {
        switch (stats.status) {
            case "Safe": return "text-green-400 bg-green-500/10 border-green-500/20";
            case "Warning": return "text-orange-400 bg-orange-500/10 border-orange-500/20";
            case "Critical": return "text-red-400 bg-red-500/10 border-red-500/20";
        }
    };

    return (
        <div className="p-8 pb-20 max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <header className="mb-10 text-center">
                <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(99,102,241,0.15)]">
                    <Activity className="w-8 h-8 text-indigo-400" />
                </div>
                <h1 className="text-4xl font-black tracking-tight text-white mb-3">Attendance Strategy</h1>
                <p className="text-slate-400 text-lg">Calculate exactly how many classes you can afford to miss.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="glass-panel p-8 rounded-3xl space-y-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />

                    <h2 className="text-xl font-bold text-white relative z-10">Input Metrics</h2>

                    <div className="space-y-6 relative z-10">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Total Classes Conducted</label>
                            <input
                                type="number"
                                value={total}
                                onChange={(e) => setTotal(Math.max(0, Number(e.target.value)))}
                                className="w-full bg-[#151821] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Classes Attended by You</label>
                            <input
                                type="number"
                                value={attended}
                                onChange={(e) => setAttended(Math.max(0, Number(e.target.value)))}
                                className="w-full bg-[#151821] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2 flex justify-between">
                                <span>Target Percentage (%)</span>
                                <span className="text-indigo-400 font-bold">{target}%</span>
                            </label>
                            <div className="flex items-center gap-4 mt-4">
                                <input
                                    type="range"
                                    min="50" max="95" step="1"
                                    value={target}
                                    onChange={(e) => setTarget(Number(e.target.value))}
                                    className="w-full accent-indigo-500 cursor-pointer"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className={`glass-card p-8 rounded-3xl border flex items-center justify-between transition-colors duration-500 ${getStatusColor()}`}>
                        <div>
                            <p className="text-sm font-bold uppercase tracking-widest opacity-80 mb-2 flex items-center gap-2">
                                Status
                            </p>
                            <h3 className="text-3xl font-black mt-1 drop-shadow-sm">{stats.status}</h3>
                            <p className="mt-3 text-white/80 text-sm">
                                Current Attendance: <span className="font-bold text-white bg-black/20 px-2 py-1 rounded ml-1">{stats.currentPercentage}%</span>
                            </p>
                        </div>
                        <div className="drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                            {getStatusIcon()}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="glass-panel p-6 rounded-3xl text-center group hover:border-green-500/30 transition-all duration-300 hover:-translate-y-1">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Safe Bunks Left</p>
                            <div className="text-5xl font-black text-green-400 drop-shadow-[0_0_15px_rgba(74,222,128,0.2)]">
                                {stats.classesCanBunk}
                            </div>
                            <p className="text-xs text-slate-500 mt-4 pt-3 border-t border-white/5 line-clamp-1">To stay above {target}%</p>
                        </div>

                        <div className="glass-panel p-6 rounded-3xl text-center group hover:border-red-500/30 transition-all duration-300 hover:-translate-y-1">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Must Attend</p>
                            <div className="text-5xl font-black text-red-400 drop-shadow-[0_0_15px_rgba(248,113,113,0.2)]">
                                {stats.classesToAttend}
                            </div>
                            <p className="text-xs text-slate-500 mt-4 pt-3 border-t border-white/5 line-clamp-1">To reach {target}%</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
