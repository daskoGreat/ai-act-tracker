'use client';

import { AnalysisResult } from '@/lib/types';

interface AnalysisSummaryCardProps {
    result: AnalysisResult;
    onReset: () => void;
}

export default function AnalysisSummaryCard({ result, onReset }: AnalysisSummaryCardProps) {
    const mailtoLink = `mailto:david.skoglund@logikfabriken.se?subject=EU AI Act Tracker - Analysresultat&body=${encodeURIComponent(
        `Hej! \n\nJag har gjort en skattning med EU AI Act Tracker och fick följande resultat:\n\n` +
        `Risknivå: ${result.riskLevel}\n` +
        `AI-mognad: ${result.maturityLevel}\n\n` +
        `Jag vill gärna prata mer om vad detta innebär för oss och hur vi kan gå vidare.`
    )}`;

    return (
        <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center animate-in zoom-in-95 duration-500 text-center px-4 md:px-0 py-12">
            <h2 className="text-[36px] md:text-[40px] font-bold text-white tracking-tight mb-12">
                Analys
            </h2>

            <div className="w-full p-10 md:p-12 bg-[#0B1224]/80 border border-white/10 rounded-[24px] backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden group">
                {/* Subtle glass effect */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />

                <div className="relative z-10">
                    {/* RISK LEVEL */}
                    <div className="space-y-3 mb-8">
                        <p className="text-white/40 uppercase tracking-[0.2em] text-[10px] md:text-xs font-semibold">
                            Risknivå
                        </p>
                        <h3 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
                            {result.riskLevel}
                        </h3>
                    </div>

                    {/* AI MATURITY */}
                    <div className="space-y-3 mb-10">
                        <p className="text-white/40 uppercase tracking-[0.2em] text-[10px] md:text-xs font-semibold">
                            AI-mognad
                        </p>
                        <h3 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
                            {result.maturityLevel}
                        </h3>
                    </div>

                    {/* CONTACT BUTTON */}
                    <div className="pt-8">
                        <a
                            href={mailtoLink}
                            className="inline-flex h-[48px] items-center justify-center px-10 text-base font-semibold text-[#0B1224] bg-white rounded-full hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-white/10 hover:-translate-y-0.5 active:scale-[0.98]"
                        >
                            Kontakta LOGIKFABRIKEN
                        </a>
                    </div>
                </div>
            </div>

            <button
                onClick={onReset}
                className="text-white/40 hover:text-white transition-colors p-4 mt-12 text-sm font-medium tracking-wide"
            >
                Gör en ny analys
            </button>

            {/* Subtle Footer Note */}
            <div className="mt-16 text-center space-y-3 opacity-40">
                <p className="text-white text-[10px] md:text-[11px] uppercase tracking-[0.3em] font-medium">
                    EU AI ACT TRACKER &copy; {new Date().getFullYear()}
                </p>
                <p className="text-[10px] md:text-[11px] font-semibold tracking-[0.2em] uppercase text-white">
                    POWERED BY <span style={{ color: '#BAAA5D' }}>LOGIKFABRIKEN</span>
                </p>
            </div>
        </div>
    );
}
