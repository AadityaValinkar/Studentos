import { Target, Server, Smartphone, Monitor, Database, Terminal, Cpu, Globe } from "lucide-react";
import Link from "next/link";

const roadmaps = [
    { id: 'frontend', title: 'Frontend Developer', icon: Monitor, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    { id: 'backend', title: 'Backend Developer', icon: Server, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { id: 'devops', title: 'DevOps Engineer', icon: Terminal, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { id: 'full-stack', title: 'Full Stack', icon: Globe, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { id: 'android', title: 'Android Developer', icon: Smartphone, color: 'text-green-500', bg: 'bg-green-500/10' },
    { id: 'ios', title: 'iOS Developer', icon: Smartphone, color: 'text-slate-200', bg: 'bg-slate-500/10' },
    { id: 'postgresql', title: 'PostgreSQL', icon: Database, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
    { id: 'ai', title: 'Artificial Intelligence', icon: Cpu, color: 'text-purple-400', bg: 'bg-purple-500/10' },
];

export default function CareersHub() {
    return (
        <div className="p-8 pb-32 max-w-6xl mx-auto min-h-screen animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <header className="mb-12 mt-4 text-center">
                <div className="inline-flex items-center justify-center p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl mb-6">
                    <Target className="w-8 h-8 text-indigo-400" />
                </div>
                <h1 className="text-4xl md:text-5xl font-light tracking-wide text-white mb-4">
                    Career <span className="font-medium">Intelligence</span>
                </h1>
                <p className="text-slate-400 font-light tracking-wide max-w-2xl mx-auto">
                    Select a discipline to view standard industry roadmaps dynamically rendered from Roadmap.sh.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative z-10">
                {/* Ambient Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none -z-10" />

                {roadmaps.map((map) => {
                    const Icon = map.icon;
                    return (
                        <Link key={map.id} href={`/careers/${map.id}`}>
                            <div className="glass-card p-6 flex flex-col items-center justify-center text-center h-48 group hover:border-white/20 transition-all cursor-pointer">
                                <div className={`p-4 rounded-2xl mb-4 transition-transform group-hover:scale-110 group-hover:-translate-y-1 ${map.bg}`}>
                                    <Icon className={`w-8 h-8 ${map.color}`} strokeWidth={1.5} />
                                </div>
                                <h3 className="text-slate-200 font-light tracking-wide group-hover:text-white transition-colors">
                                    {map.title}
                                </h3>
                            </div>
                        </Link>
                    )
                })}
            </div>
        </div>
    );
}
