"use client";

import { motion } from "motion/react";
import Link from "next/link";
import {
    ArrowRight,
    CalendarDays,
    Clock,
    Target,
    TrendingUp,
    Briefcase,
    BookOpen,
    Gamepad2,
    MessageSquare,
    GraduationCap,
    Map,
    Award,
    BarChart,
    Github,
    Instagram,
    Linkedin
} from "lucide-react";
import { AnimatedGradientText } from "@/components/ui/animated-gradient-text";
import { FloatingPaths } from "@/components/ui/background-paths";

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden relative selection:bg-indigo-500/30 font-sans">

            <div className="absolute inset-0 z-0 bg-[#0a0a0a]">
                <FloatingPaths position={1} />
            </div>

            {/* Very minimal noise texture */}
            <div className="absolute inset-0 z-0 opacity-[0.10] mix-blend-overlay noise-overlay pointer-events-none" />

            {/* Moving Purple Gradient Glows */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[80vw] md:w-[60vw] h-[60vh] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none z-0"
            />

            <motion.div
                animate={{
                    y: [0, -50, 0],
                    opacity: [0.2, 0.4, 0.2],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                }}
                className="absolute top-0 right-0 w-[40vw] h-[40vh] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none z-0"
            />

            {/* Content Wrapper */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 flex flex-col min-h-screen">

                {/* Navigation */}
                <nav className="flex items-center justify-between py-8">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                        <Link href="/" className="group flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 border border-white/10 hover:border-indigo-500/50 hover:bg-indigo-500/10 transition-all duration-300">
                            <span className="font-bold text-lg tracking-tighter text-white group-hover:text-indigo-400 transition-colors">OS</span>
                        </Link>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
                    >
                        <Link href="/login" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                            Sign In
                        </Link>
                    </motion.div>
                </nav>

                {/* Hero Section */}
                <main className="flex-1 flex flex-col items-center mt-20 md:mt-32 pb-32">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="text-center w-full max-w-4xl mx-auto"
                    >
                        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-8">
                            Built for students who want clarity, control, and community.
                        </div>

                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white mb-6 leading-tight">
                            <AnimatedGradientText speed={4} colorFrom="#818cf8" colorTo="#c084fc">
                                Your Academic <br className="hidden md:block" /> Control Center.
                            </AnimatedGradientText>
                        </h1>

                        <p className="text-lg md:text-xl text-slate-400 font-normal max-w-2xl mx-auto leading-relaxed mb-12">
                            Plan smarter. Track performance. Stay connected with your campus.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link href="/login">
                                <motion.button
                                    whileHover={{ y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="px-8 py-4 bg-white text-black rounded-xl font-medium shadow-sm hover:shadow-indigo-500/25 transition-all flex items-center gap-2"
                                >
                                    Get Started
                                    <ArrowRight className="w-4 h-4" />
                                </motion.button>
                            </Link>

                            <Link href="/communities">
                                <motion.button
                                    whileHover={{ y: -2, backgroundColor: "rgba(255,255,255,0.08)" }}
                                    whileTap={{ scale: 0.98 }}
                                    className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-xl font-medium transition-all"
                                >
                                    Explore Communities
                                </motion.button>
                            </Link>
                        </div>
                    </motion.div>
                </main>

                {/* SECTION 1 - TIME */}
                <section className="py-24 md:py-32 w-full">
                    <div className="max-w-3xl mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">See your semester clearly.</h2>
                        <p className="text-slate-400 text-lg">Stay organized. Everything you need to manage your time, all in one place.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { title: "Countdown to exams", icon: <Clock className="w-6 h-6" /> },
                            { title: "Upcoming deadlines", icon: <Target className="w-6 h-6" /> },
                            { title: "Clean calendar", icon: <CalendarDays className="w-6 h-6" /> },
                            { title: "Daily focus view", icon: <Clock className="w-6 h-6" /> }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                className="bg-white/[0.02] border border-white/5 p-8 rounded-xl hover:bg-white/[0.04] transition-colors"
                            >
                                <div className="text-indigo-400 mb-6">{item.icon}</div>
                                <h3 className="text-white font-medium text-lg">{item.title}</h3>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* SECTION 2 - PERFORMANCE */}
                <section className="py-24 md:py-32 w-full border-t border-white/5">
                    <div className="max-w-3xl mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">Track what actually matters.</h2>
                        <p className="text-slate-400 text-lg">Stay on track. Short. Confident. Clear insights into your academic journey.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                            { title: "CGPA tracking", desc: "Monitor your grades and progress effortlessly.", icon: <TrendingUp className="w-6 h-6" /> },
                            { title: "Attendance insights", desc: "Stay above the margin with smart warnings.", icon: <BarChart className="w-6 h-6" /> },
                            { title: "Momentum score", desc: "Keep your productivity streak alive.", icon: <Target className="w-6 h-6" /> },
                            { title: "Goal progress", desc: "Turn long-term ambitions into daily actions.", icon: <Award className="w-6 h-6" /> }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                className="bg-white/[0.02] border border-white/5 p-8 rounded-xl flex items-start gap-6 hover:bg-white/[0.04] transition-colors"
                            >
                                <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-lg shrink-0">
                                    {item.icon}
                                </div>
                                <div>
                                    <h3 className="text-white font-medium text-xl mb-2">{item.title}</h3>
                                    <p className="text-slate-400">{item.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* SECTION 3 - CAMPUS LAYER */}
                <section className="py-24 md:py-32 w-full border-t border-white/5">
                    <div className="max-w-3xl mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">Built for your campus.</h2>
                        <p className="text-slate-400 text-lg">Stay connected. Find your people and collaborate on what you love.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { title: "Study communities", icon: <BookOpen className="w-6 h-6" /> },
                            { title: "Gaming groups", icon: <Gamepad2 className="w-6 h-6" /> },
                            { title: "Doubt discussions", icon: <MessageSquare className="w-6 h-6" /> },
                            { title: "Internships & placements", icon: <Briefcase className="w-6 h-6" /> }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                className="bg-white/[0.02] border border-white/5 p-8 rounded-xl hover:border-indigo-500/30 transition-colors group cursor-pointer"
                            >
                                <div className="text-slate-400 group-hover:text-indigo-400 transition-colors mb-6">{item.icon}</div>
                                <h3 className="text-white font-medium">{item.title}</h3>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* SECTION 4 - CAREER EDGE */}
                <section className="py-24 md:py-32 w-full border-t border-white/5">
                    <div className="max-w-3xl mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">Turn effort into opportunity.</h2>
                        <p className="text-slate-400 text-lg">Stay ahead. Prepare for the future with structured paths and resources.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                            { title: "Internship listings", desc: "Discover active opportunities tailored to your skills.", icon: <Briefcase className="w-6 h-6 text-indigo-400" /> },
                            { title: "Career roadmaps", desc: "Step-by-step guides for various career paths.", icon: <Map className="w-6 h-6 text-indigo-400" /> },
                            { title: "Skill requirements", desc: "Know exactly what the industry demands today.", icon: <Target className="w-6 h-6 text-indigo-400" /> },
                            { title: "Placement prep", desc: "Resources and timelines to get you ready for interviews.", icon: <GraduationCap className="w-6 h-6 text-indigo-400" /> }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                className="bg-white/[0.02] border border-white/5 p-8 rounded-xl flex items-start gap-6 hover:bg-white/[0.04] transition-colors"
                            >
                                <div className="p-3 bg-white/5 rounded-lg shrink-0">
                                    {item.icon}
                                </div>
                                <div>
                                    <h3 className="text-white font-medium text-xl mb-2">{item.title}</h3>
                                    <p className="text-slate-400">{item.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

            </div>

            {/* NEW FOOTER */}
            <footer className="w-full border-t border-white/10 bg-[#0a0a0a] pt-20 pb-8 px-6 relative z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-16">

                        {/* Brand Block */}
                        <div className="md:col-span-2 space-y-4">
                            <Link href="/" className="flex items-center gap-2 mb-6">
                                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                                    <span className="font-bold text-sm tracking-tighter text-white">OS</span>
                                </div>
                                <span className="font-bold text-lg text-white">StudentOS</span>
                            </Link>
                            <h3 className="text-white font-medium text-lg">Your academic control center.</h3>
                            <p className="text-slate-500 text-sm leading-relaxed max-w-sm">
                                The ultimate academic operating system for students who want clarity, control, and connection throughout their college journey.
                            </p>
                        </div>

                        {/* Platform */}
                        <div className="space-y-6">
                            <h4 className="text-white font-medium mb-6">Platform</h4>
                            <ul className="space-y-4">
                                <li><Link href="#features" className="text-slate-400 hover:text-white transition-colors text-sm">Features</Link></li>
                                <li><Link href="/communities" className="text-slate-400 hover:text-white transition-colors text-sm">Communities</Link></li>
                                <li><Link href="/dashboard" className="text-slate-400 hover:text-white transition-colors text-sm">Dashboard</Link></li>
                                <li><Link href="/roadmap" className="text-slate-400 hover:text-white transition-colors text-sm">Career Roadmaps</Link></li>
                            </ul>
                        </div>

                        {/* Built in Public */}
                        <div className="space-y-6">
                            <h4 className="text-white font-medium mb-6">Built in Public</h4>
                            <ul className="space-y-4">
                                <li><Link href="https://www.instagram.com/student_os_?igsh=MTlzZHNtZnd0YXB3Yw==" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm"><Instagram className="w-4 h-4" /> Instagram</Link></li>
                                <li><Link href="https://www.linkedin.com/in/aaditya-valinkar-655356282/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm"><Linkedin className="w-4 h-4" /> LinkedIn</Link></li>
                                <li><Link href="https://github.com/AadityaValinkar" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm"><Github className="w-4 h-4" /> GitHub</Link></li>
                            </ul>
                        </div>

                        {/* Contact & Legal */}
                        <div className="space-y-8">
                            <div>
                                <h4 className="text-white font-medium mb-6">Contact</h4>
                                <a href="mailto:broisprosomuch@gmail.com" className="text-slate-400 hover:text-white transition-colors text-sm">
                                    broisprosomuch@gmail.com
                                </a>
                            </div>
                            <div>
                                <h4 className="text-white font-medium mb-6">Legal</h4>
                                <ul className="space-y-4">
                                    <li><Link href="/privacy" className="text-slate-400 hover:text-white transition-colors text-sm">Privacy Policy</Link></li>
                                    <li><Link href="/terms" className="text-slate-400 hover:text-white transition-colors text-sm">Terms</Link></li>
                                    <li><Link href="/about" className="text-slate-400 hover:text-white transition-colors text-sm">About</Link></li>
                                </ul>
                            </div>
                        </div>

                    </div>

                    {/* Bottom Bar */}
                    <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-slate-500 text-sm">
                            © 2026 StudentOS. Built by Aaditya Valinkar.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
