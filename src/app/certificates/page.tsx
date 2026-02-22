"use client";

import { useState } from "react";
import { Layers, ShieldCheck, Loader2, AlertCircle } from "lucide-react";

export default function CertificatesPage() {
    const [docId, setDocId] = useState("");
    const [fullName, setFullName] = useState("");
    const [dob, setDob] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccessMsg(null);

        try {
            const res = await fetch("/api/nsdc/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ docId, fullName, dob })
            });

            if (!res.ok) {
                const errData = await res.json();
                setError(errData.errorDescription || "Failed to verify certificate.");
                setIsLoading(false);
                return;
            }

            // Handle successful PDF Blob download
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `NSDC_Certificate_${docId}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);

            setSuccessMsg("Certificate successfully verified and downloaded!");

        } catch (err: unknown) {
            console.error(err);
            setError("A network error occurred while verifying the certificate.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-8 pb-32 max-w-5xl mx-auto min-h-screen animate-in fade-in slide-in-from-bottom-4 duration-1000 relative">

            {/* Ambient Glow */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />

            <header className="mb-12 text-center pt-8">
                <div className="inline-flex items-center justify-center p-4 bg-white/5 border border-white/10 rounded-3xl mb-6 shadow-xl shadow-black/50">
                    <Layers className="w-10 h-10 text-indigo-400" strokeWidth={1.5} />
                </div>
                <h1 className="text-4xl md:text-5xl font-light tracking-wide text-white mb-4">
                    Skill <span className="font-medium">Verification</span>
                </h1>
                <p className="text-slate-400 font-light tracking-wide max-w-xl mx-auto leading-relaxed">
                    Verify and download your official National Skill Development Corporation (NSDC) certificates securely via DigiLocker API Setu.
                </p>
            </header>

            <div className="max-w-xl mx-auto">
                <div className="glass-panel p-8 md:p-10 relative overflow-hidden group">

                    {/* Subtle Sheen */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                    <form onSubmit={handleVerify} className="space-y-6 relative z-10">

                        <div className="space-y-2">
                            <label className="text-sm font-light tracking-wide text-slate-300 ml-1">Document ID (DOCID)</label>
                            <input
                                type="text"
                                required
                                value={docId}
                                onChange={(e) => setDocId(e.target.value)}
                                placeholder="e.g. oqnh4snyv3yndrnd"
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all font-light tracking-wide"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-light tracking-wide text-slate-300 ml-1">Full Name</label>
                            <input
                                type="text"
                                required
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="As printed on certificate"
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all font-light tracking-wide"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-light tracking-wide text-slate-300 ml-1">Date of Birth</label>
                            <input
                                type="text"
                                required
                                value={dob}
                                onChange={(e) => setDob(e.target.value)}
                                placeholder="DD-MM-YYYY"
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all font-light tracking-wide"
                            />
                            <p className="text-xs text-slate-500 ml-1 mt-2 tracking-wide">Must strictly follow DD-MM-YYYY format</p>
                        </div>

                        {error && (
                            <div className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3 animate-in slide-in-from-top-2">
                                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                                <div className="text-sm text-red-200 font-light leading-relaxed">
                                    {error}
                                </div>
                            </div>
                        )}

                        {successMsg && (
                            <div className="mt-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 flex items-start gap-3 animate-in slide-in-from-top-2">
                                <ShieldCheck className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                                <div className="text-sm text-green-200 font-light leading-relaxed">
                                    {successMsg}
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full mt-8 bg-indigo-500 hover:bg-indigo-400 text-white rounded-xl px-4 py-4 flex items-center justify-center gap-2 transition-colors font-medium tracking-wide disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(99,102,241,0.2)]"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Verifying with NSDC...
                                </>
                            ) : (
                                <>
                                    <ShieldCheck className="w-5 h-5" />
                                    Verify & Download
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
