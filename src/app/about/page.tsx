import Link from "next/link";
import { ArrowLeft, Github, Linkedin, Instagram } from "lucide-react";

export default function AboutUs() {
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-12 font-sans">
            <div className="max-w-3xl mx-auto mt-12 md:mt-20">
                <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-12">
                    <ArrowLeft className="w-4 h-4" /> Back to Home
                </Link>

                <h1 className="text-4xl md:text-5xl font-bold mb-8">About StudentOS</h1>

                <div className="space-y-8 text-slate-300 leading-relaxed">
                    <section>
                        <p className="text-lg">
                            StudentOS was built with a clear mission: to provide the ultimate academic operating system for students who want clarity, control, and connection throughout their college journey.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">The Vision</h2>
                        <p>
                            College life shouldn&apos;t be chaotic. Between managing attendance, assignments, CGPA, and career goals, students often feel overwhelmed. StudentOS is the unified control center designed to turn effort into opportunity by bridging productivity with a thriving social community layer.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">Built in Public</h2>
                        <p className="mb-6">
                            StudentOS is being built natively for students, by a student. I am building this platform openly to share insights, code, and continuous improvements.
                        </p>

                        <div className="flex gap-4">
                            <Link href="https://github.com/AadityaValinkar" target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
                                <Github className="w-5 h-5" />
                            </Link>
                            <Link href="https://www.linkedin.com/in/aaditya-valinkar-655356282/" target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
                                <Linkedin className="w-5 h-5" />
                            </Link>
                            <Link href="https://www.instagram.com/student_os_?igsh=MTlzZHNtZnd0YXB3Yw==" target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
                                <Instagram className="w-5 h-5" />
                            </Link>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
