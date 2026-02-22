import { TimePressure } from "@/components/dashboard/TimePressure"
import { MomentumScore } from "@/components/dashboard/MomentumScore"
import { BunkCalculatorWidget } from "@/components/dashboard/BunkCalculatorWidget"
import { RealityCheck } from "@/components/dashboard/RealityCheck"

export default function Dashboard() {
  return (
    <div className="p-6 pb-20 max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 w-full">
      <header className="mb-12">
        <h1 className="text-3xl font-light tracking-tight text-slate-900 dark:text-white mb-2">Welcome back.</h1>
        <p className="text-slate-600 dark:text-slate-400 font-light text-sm">Your semester ends in <span className="text-indigo-500 font-medium">75 days</span>.</p>
      </header>

      {/* Time Pressure Engine (Full width) */}
      <TimePressure />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <MomentumScore />
        <BunkCalculatorWidget />
        <RealityCheck />
      </div>
    </div>
  )
}
