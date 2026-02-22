import { AlertTriangle } from 'lucide-react';

export function RealityCheck() {
    return (
        <div className="glass-card p-6 flex flex-col justify-between group h-full hover:border-black/10 dark:hover:border-white/20 transition-all border-l-4 border-l-orange-500 dark:border-l-orange-400 pointer-events-auto">
            <div className="flex justify-between items-start mb-6">
                <h3 className="font-light text-slate-700 dark:text-slate-300 flex items-center gap-2 tracking-wide">
                    <AlertTriangle className="w-4 h-4 text-orange-500 dark:text-orange-400 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                    Reality Check
                </h3>
            </div>

            <div className="flex-1 flex flex-col justify-center space-y-4">
                <div>
                    <h4 className="text-slate-900 dark:text-white text-base font-light mb-1">CGPA Drift Detected</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-light tracking-wide">
                        Trajectory suggests <span className="text-slate-900 dark:text-slate-300 font-normal">7.2</span>. You need an average of <span className="text-slate-900 dark:text-slate-300 font-normal">8.5</span> this semester to maintain application eligibility.
                    </p>
                </div>

                <div className="pt-4 border-t border-black/5 dark:border-white/5">
                    <p className="text-xs text-orange-600 dark:text-orange-300/80 leading-relaxed font-light tracking-wide">
                        <span className="text-orange-500 dark:text-orange-300/50 block mb-1 uppercase tracking-widest text-[10px]">Action required</span>
                        Focus heavily on Core AI & Data Structures this month.
                    </p>
                </div>
            </div>
        </div>
    );
}
