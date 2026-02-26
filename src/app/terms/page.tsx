import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsOfService() {
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-12 font-sans">
            <div className="max-w-3xl mx-auto mt-12 md:mt-20">
                <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-12">
                    <ArrowLeft className="w-4 h-4" /> Back to Home
                </Link>

                <h1 className="text-4xl md:text-5xl font-bold mb-8">Terms of Service</h1>
                <p className="text-slate-400 mb-8">Last updated: February 26, 2026</p>

                <div className="space-y-8 text-slate-300 leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
                        <p>By accessing and using StudentOS, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">2. User Accounts</h2>
                        <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must be a student or directly affiliated with an academic institution to use our core features effectively.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">3. Acceptable Use</h2>
                        <p>You agree not to use StudentOS for any unlawful purpose or in any way that interrupts, damages, or impairs the service. You may not distribute spam, malware, or engage in abusive behavior in any of the StudentOS communities.</p>
                    </section>
                </div>
            </div>
        </div>
    );
}
