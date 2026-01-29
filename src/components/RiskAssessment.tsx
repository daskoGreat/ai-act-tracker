'use client';

import { useState } from 'react';
import { RiskRequest, CombinedResponse, QuestionType } from '@/lib/types';

interface Question {
    id: string;
    text: string;
    type: QuestionType;
    category: string;
    answerOptions: string[];
}

const QUESTIONS: Question[] = [
    // DEL 1: Indikation på AI Act-risknivå
    {
        id: 'q1',
        text: 'Påverkar AI hur individer bedöms, väljs eller prioriteras? (t.ex. rekrytering, urval, kundbedömning, tillgång till tjänster)',
        type: 'risk',
        category: 'Del 1: Risknivå',
        answerOptions: ['Ja', 'Nej', 'Vet inte']
    },
    {
        id: 'q2',
        text: 'Kan AI-användningen få tydliga konsekvenser om något blir fel? (t.ex. felaktiga beslut om individer, regelbrott, affärspåverkan eller förtroendeskada)',
        type: 'risk',
        category: 'Del 1: Risknivå',
        answerOptions: ['Ja', 'I viss utsträckning', 'Nej']
    },
    {
        id: 'q3',
        text: 'Är verksamheten beroende av att AI-funktionen fungerar korrekt i vardagen? (t.ex. centrala affärsflöden, riskbedömning, drift- eller beslutsstöd)',
        type: 'risk',
        category: 'Del 1: Risknivå',
        answerOptions: ['Ja', 'Nej', 'Vet inte']
    },
    {
        id: 'q4',
        text: 'Hur används AI i beslutsprocessen?',
        type: 'risk',
        category: 'Del 1: Risknivå',
        answerOptions: ['Stödjande', 'Del av beslutsunderlag', 'Direkt beslutande', 'Vet inte']
    },
    // DEL 2: Organisatorisk beredskap
    {
        id: 'm1',
        text: 'Finns ett tydligt ägarskap för AI-användning i organisationen? (t.ex. utsedd ansvarig på lednings- eller funktionsnivå)',
        type: 'maturity',
        category: 'Del 2: Organisatorisk beredskap',
        answerOptions: ['Ja', 'Nej']
    },
    {
        id: 'm2',
        text: 'Har ni en samlad överblick över var AI används i verksamheten? (t.ex. i system, verktyg, processer eller via leverantörer)',
        type: 'maturity',
        category: 'Del 2: Organisatorisk beredskap',
        answerOptions: ['Ja', 'Nej']
    },
    {
        id: 'm3',
        text: 'Finns gemensamma riktlinjer eller principer för hur AI får användas? (t.ex. vad som är tillåtet, vad som kräver beslut)',
        type: 'maturity',
        category: 'Del 2: Organisatorisk beredskap',
        answerOptions: ['Ja', 'Nej']
    },
    {
        id: 'm4',
        text: 'Finns någon form av uppföljning, kontroll eller riskbedömning kopplad till AI-användning? (t.ex. vid införande, leverantörsbedömning eller löpande uppföljning)',
        type: 'maturity',
        category: 'Del 2: Organisatorisk beredskap',
        answerOptions: ['Ja', 'Nej', 'Vet inte']
    },
    {
        id: 'm5',
        text: 'Skulle ni känna er trygga i att resonera kring hur ni tänkt kring AI, risk och ansvar internt? (t.ex. i ledningsgrupp eller styrelse)',
        type: 'maturity',
        category: 'Del 2: Organisatorisk beredskap',
        answerOptions: ['Ja', 'Nej']
    },
];

export default function RiskAssessment() {
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<{ id: string; type: QuestionType; answer: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<CombinedResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleAnswer = async (answer: string) => {
        const question = QUESTIONS[currentStep];
        const newAnswers = [...answers, { id: question.id, type: question.type, answer }];

        if (currentStep < QUESTIONS.length - 1) {
            setAnswers(newAnswers);
            setCurrentStep(currentStep + 1);
        } else {
            // Submit logic
            setAnswers(newAnswers);
            await analyzeRisk(newAnswers);
        }
    };

    const analyzeRisk = async (finalAnswers: typeof answers) => {
        setLoading(true);
        setError(null);
        try {
            const payload: RiskRequest = {
                answers: finalAnswers
            };

            const res = await fetch('/api/ai-risk', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.error || 'Något gick fel vid analysen. Kontrollera loggarna.');
            }

            const data: CombinedResponse = await res.json();
            setResult(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ett okänt fel inträffade');
        } finally {
            setLoading(false);
        }
    };

    const reset = () => {
        setCurrentStep(0);
        setAnswers([]);
        setResult(null);
        setError(null);
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center space-y-4 animate-in fade-in duration-500">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xl font-light tracking-wide text-gray-300">Analyserar AI-användning...</p>
            </div>
        );
    }

    if (result) {
        return (
            <div className="w-full mx-auto flex flex-col items-center justify-center space-y-8 animate-in zoom-in-95 duration-500 max-w-2xl text-center px-4 md:px-0">
                <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    Resultat
                </h2>
                <div className="p-6 md:p-8 border border-white/10 bg-white/5 rounded-2xl backdrop-blur-sm w-full space-y-6">
                    <div>
                        <p className="text-gray-400 mb-2 uppercase tracking-widest text-xs md:text-sm">Risknivå enligt AI Act</p>
                        <p className="text-3xl md:text-4xl font-semibold text-white">{result.riskLevel}</p>
                    </div>

                    <div className="h-px bg-white/10"></div>

                    <div>
                        <p className="text-gray-400 mb-2 uppercase tracking-widest text-xs md:text-sm">AI Act-mognad</p>
                        <p className="text-3xl md:text-4xl font-semibold text-white">{result.maturityLevel}</p>
                    </div>

                    <a
                        href={`mailto:david.skoglund@greatit.se?subject=EU AI Act Tracker - Analysresultat&body=${encodeURIComponent(
                            `Hej! \n\nJag har gjort en skattning med EU AI Act Tracker och fick följande resultat:\n\n` +
                            `Risknivå: ${result.riskLevel}\n` +
                            `AI-mognad: ${result.maturityLevel}\n\n` +
                            `Jag vill gärna prata mer om vad detta innebär för oss och hur vi kan gå vidare.`
                        )}`}
                        className="inline-flex w-full md:w-auto min-h-[56px] items-center justify-center px-8 py-4 text-base font-medium text-black bg-white rounded-full hover:bg-gray-200 transition-colors duration-300 shadow-lg hover:shadow-xl mt-4"
                    >
                        Kontakta oss för mer information
                    </a>
                </div>
                <button
                    onClick={reset}
                    className="text-gray-500 hover:text-white transition-colors p-4 min-h-[44px]"
                >
                    Gör en ny analys
                </button>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center space-y-4">
                <p className="text-red-400 text-xl">{error}</p>
                <button
                    onClick={() => analyzeRisk(answers)}
                    className="px-6 py-2 bg-white/10 rounded-lg hover:bg-white/20 min-h-[44px]"
                >
                    Försök igen
                </button>
            </div>
        );
    }

    const question = QUESTIONS[currentStep];

    return (
        <div className="w-full max-w-2xl mx-auto px-4">
            <div className="mb-4 md:mb-8">
                <div className="flex justify-center space-x-2 mb-2">
                    {QUESTIONS.map((_, idx) => (
                        <div
                            key={idx}
                            className={`h-1 flex-1 rounded-full transition-all duration-500 ${idx <= currentStep ? 'bg-blue-500' : 'bg-gray-800'
                                }`}
                        />
                    ))}
                </div>
                <p className="text-center text-gray-500 text-sm font-medium">
                    Fråga {currentStep + 1} av {QUESTIONS.length}
                </p>
            </div>

            <div className="min-h-[300px] flex flex-col items-center justify-center animate-in slide-in-from-right-8 duration-500 key={currentStep}">
                <p className="text-blue-400 font-semibold uppercase tracking-wider text-sm mb-2">
                    {question.category}
                </p>
                <h3 className="text-2xl md:text-3xl font-medium text-center leading-relaxed mb-8 md:mb-12 text-gray-100">
                    {question.text}
                </h3>

                <div className="flex flex-col md:flex-row gap-4 w-full justify-center items-center">
                    {question.answerOptions.map((option) => (
                        <button
                            key={option}
                            onClick={() => handleAnswer(option)}
                            className={`px-8 py-4 w-full ${question.answerOptions.length === 3 ? 'md:w-32' : 'md:w-40'} min-h-[56px] rounded-xl border border-white/10 ${option === 'Ja'
                                ? 'bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-900/20'
                                : 'bg-white/5 hover:bg-white/10'
                                } text-white font-medium transition-all hover:scale-105 active:scale-95`}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
