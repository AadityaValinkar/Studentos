import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MonthNavigatorProps {
    currentDate: Date;
    onPrevMonth: () => void;
    onNextMonth: () => void;
    onToday: () => void;
}

export function MonthNavigator({ currentDate, onPrevMonth, onNextMonth, onToday }: MonthNavigatorProps) {
    const monthName = currentDate.toLocaleString('default', { month: 'long' });
    const year = currentDate.getFullYear();

    return (
        <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
                <button
                    onClick={onPrevMonth}
                    className="p-2 hover:bg-white/5 rounded-full transition-colors text-slate-400 hover:text-white"
                >
                    <ChevronLeft className="w-5 h-5" strokeWidth={1.5} />
                </button>

                <h2 className="text-2xl font-light text-white tracking-wide w-48 text-center">
                    {monthName} <span className="text-slate-500">{year}</span>
                </h2>

                <button
                    onClick={onNextMonth}
                    className="p-2 hover:bg-white/5 rounded-full transition-colors text-slate-400 hover:text-white"
                >
                    <ChevronRight className="w-5 h-5" strokeWidth={1.5} />
                </button>
            </div>

            <div className="flex items-center gap-3">
                <button
                    onClick={onToday}
                    className="px-4 py-2 text-sm font-light text-slate-300 bg-white/5 hover:bg-white/10 rounded-full transition-colors border border-white/10"
                >
                    Today
                </button>
            </div>
        </div>
    );
}
