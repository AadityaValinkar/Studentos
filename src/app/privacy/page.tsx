import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-12 font-sans">
            <div className="max-w-3xl mx-auto mt-12 md:mt-20">
                <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-12">
                    <ArrowLeft className="w-4 h-4" /> Back to Home
                </Link>

                <h1 className="text-4xl md:text-5xl font-bold mb-8">Privacy Policy</h1>
                <p className="text-slate-400 mb-8">Last updated: February 26, 2026</p>

                <div className="space-y-8 text-slate-300 leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">1. Information We Collect</h2>
                        <p>We collect information you provide directly to us when you create an account, update your profile, use StudentOS features, or communicate with us. This includes your name, email address, academic details, and any other data you choose to provide.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Your Information</h2>
                        <p>We use the information we collect to operate, maintain, and provide the features of StudentOS. We also use it to communicate with you about updates, resolve support issues, and improve our services.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">3. Data Security</h2>
                        <p>StudentOS implements security measures designed to protect your information from unauthorized access, disclosure, or destruction. We use industry-standard encryption and security protocols.</p>
                    </section>
                </div>
            </div>
        </div>
    );
}
