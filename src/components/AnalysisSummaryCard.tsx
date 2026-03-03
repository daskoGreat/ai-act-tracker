'use client';

import { AnalysisResult } from '@/lib/types';

interface AnalysisSummaryCardProps {
    result: AnalysisResult;
    onReset: () => void;
}

export default function AnalysisSummaryCard({ result, onReset }: AnalysisSummaryCardProps) {
    const mailtoLink = `mailto:david.skoglund@greatit.se?subject=EU AI Act Tracker - Analysresultat&body=${encodeURIComponent(
        `Hej! \n\nJag har gjort en skattning med EU AI Act Tracker och fick följande resultat:\n\n` +
        `Risknivå: ${result.riskLevel}\n` +
        `AI-mognad: ${result.maturityLevel}\n\n` +
        `Jag vill gärna prata mer om vad detta innebär för oss och hur vi kan gå vidare.`
    )}`;

    return (
        <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center space-y-12 animate-in zoom-in-95 duration-500 text-center px-4 md:px-0 py-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                Analys
            </h2>

            <div className="w-full p-10 md:p-14 bg-slate-900/40 border border-white/5 rounded-[40px] backdrop-blur-xl shadow-2xl relative overflow-hidden group">
                {/* Subtle glass effect */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />

                <div className="space-y-16 relative z-10">
                    {/* RISK LEVEL */}
                    <div className="space-y-3">
                        <p className="text-gray-500 uppercase tracking-[0.3em] text-[10px] md:text-xs font-bold">
                            Risknivå
                        </p>
                        <h3 className="text-2xl md:text-4xl font-semibold text-white tracking-tight">
                            {result.riskLevel}
                        </h3>
                    </div>

                    {/* Divider */}
                    <div className="w-24 h-px bg-white/5 mx-auto" />

                    {/* AI MATURITY */}
                    <div className="space-y-3">
                        <p className="text-gray-500 uppercase tracking-[0.3em] text-[10px] md:text-xs font-bold">
                            AI-mognad
                        </p>
                        <h3 className="text-2xl md:text-4xl font-semibold text-white tracking-tight">
                            {result.maturityLevel}
                        </h3>
                    </div>

                    {/* CONTACT BUTTON */}
                    <div className="pt-8">
                        <a
                            href={mailtoLink}
                            className="inline-flex min-h-[64px] items-center justify-center px-12 py-5 text-lg font-semibold text-black bg-white rounded-full hover:bg-gray-100 transition-all duration-300 shadow-xl hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:scale-[1.02] active:scale-[0.98]"
                        >
                            Kontakta Great IT
                        </a>
                    </div>
                </div>
            </div>

            <button
                onClick={onReset}
                className="text-gray-500 hover:text-white transition-colors p-4 mt-8 font-medium tracking-wide"
            >
                Gör en ny analys
            </button>
        </div>
    );
}
