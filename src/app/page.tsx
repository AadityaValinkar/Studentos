"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { Timer, TrendingUp, CalendarDays } from "lucide-react";

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden relative selection:bg-indigo-500/30">

            {/* Subtle Star/Noise Texture Background (Using global CSS class) */}
            <div className="absolute inset-0 z-0 opacity-40 mix-blend-overlay noise-overlay pointer-events-none" />

            {/* Soft Radial Indigo Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vh] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none z-0" />

            <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 flex flex-col min-h-screen">

                {/* Navigation / Header */}
                <nav className="flex items-center justify-between py-8">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="flex items-center gap-2"
                    >
                        {/* The Interactive OS Logo */}
                        <Link href="/" className="group flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 border border-white/10 hover:border-indigo-500/50 hover:bg-indigo-500/10 transition-all duration-300 shadow-[0_0_15px_rgba(99,102,241,0)] hover:shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                            <span className="font-bold text-lg tracking-tighter text-white group-hover:text-indigo-400 transition-colors">OS</span>
                        </Link>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                    >
                        <Link href="/login" className="text-sm font-light text-slate-400 hover:text-white transition-colors">
                            Sign In
                        </Link>
                    </motion.div>
                </nav>

                {/* Hero Section */}
                <main className="flex-1 flex flex-col justify-center items-center text-center mt-12 pb-24">

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    >
                        {/* Large Centered OS Badge */}
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white/5 border border-white/10 mb-8 shadow-[0_0_30px_rgba(255,255,255,0.03)] backdrop-blur-xl">
                            <span className="font-bold text-3xl tracking-tighter text-white">OS</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-light tracking-tight text-white mb-6">
                            Your Academic <br />
                            <span className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-indigo-400">Operating System</span>
                        </h1>

                        <p className="text-xl text-slate-400 font-light max-w-2xl mx-auto leading-relaxed tracking-wide mb-12">
                            Stop drifting. <br className="md:hidden" />
                            See your semester clearly. <br className="md:hidden" />
                            Make smarter academic decisions.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <Link href="/login">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    transition={{ duration: 0.2 }}
                                    className="px-8 py-4 bg-white text-black rounded-2xl font-medium tracking-wide shadow-[0_0_40px_rgba(255,255,255,0.15)] hover:shadow-[0_0_40px_rgba(255,255,255,0.25)] transition-shadow"
                                >
                                    Get Started
                                </motion.button>
                            </Link>

                            <Link href="/dashboard">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    transition={{ duration: 0.2 }}
                                    className="px-8 py-4 bg-white/5 backdrop-blur-md border border-white/10 text-white rounded-2xl font-light tracking-wide hover:bg-white/10 transition-colors"
                                >
                                    Explore Demo
                                </motion.button>
                            </Link>
                        </div>
                    </motion.div>

                    {/* Features / USP Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-32 max-w-5xl"
                    >

                        {/* USP Block 1 */}
                        <div className="group bg-white/[0.02] border border-white/5 rounded-3xl p-8 hover:bg-white/[0.04] hover:border-white/10 transition-all duration-500 backdrop-blur-sm">
                            <Timer className="w-6 h-6 text-indigo-400 mb-6 group-hover:scale-110 transition-transform duration-500 stroke-[1.5]" />
                            <h3 className="text-lg font-medium text-white mb-3 tracking-wide">Time Pressure Engine</h3>
                            <p className="text-slate-400 font-light text-sm leading-relaxed">
                                Know exactly how much time you have left.
                            </p>
                        </div>

                        {/* USP Block 2 */}
                        <div className="group bg-white/[0.02] border border-white/5 rounded-3xl p-8 hover:bg-white/[0.04] hover:border-white/10 transition-all duration-500 backdrop-blur-sm">
                            <TrendingUp className="w-6 h-6 text-indigo-400 mb-6 group-hover:scale-110 transition-transform duration-500 stroke-[1.5]" />
                            <h3 className="text-lg font-medium text-white mb-3 tracking-wide">Momentum Score</h3>
                            <p className="text-slate-400 font-light text-sm leading-relaxed">
                                Track your real academic performance.
                            </p>
                        </div>

                        {/* USP Block 3 */}
                        <div className="group bg-white/[0.02] border border-white/5 rounded-3xl p-8 hover:bg-white/[0.04] hover:border-white/10 transition-all duration-500 backdrop-blur-sm">
                            <CalendarDays className="w-6 h-6 text-indigo-400 mb-6 group-hover:scale-110 transition-transform duration-500 stroke-[1.5]" />
                            <h3 className="text-lg font-medium text-white mb-3 tracking-wide">Smart Semester Planner</h3>
                            <p className="text-slate-400 font-light text-sm leading-relaxed">
                                No more missing deadlines.
                            </p>
                        </div>

                    </motion.div>

                    {/* Social Proof & Final CTA */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 1 }}
                        className="w-full mt-32 mb-16 text-center"
                    >
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-500 font-medium mb-16">
                            Built for engineering students
                        </p>

                        <h2 className="text-3xl font-light tracking-tight text-white mb-8">
                            Take control of your semester.
                        </h2>

                        <Link href="/login">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="px-8 py-4 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-2xl font-light tracking-wide hover:bg-indigo-500/30 transition-colors shadow-[0_0_30px_rgba(99,102,241,0.1)] hover:shadow-[0_0_30px_rgba(99,102,241,0.2)]"
                            >
                                Start Free
                            </motion.button>
                        </Link>
                    </motion.div>

                </main>
            </div>
        </div>
    );
}
