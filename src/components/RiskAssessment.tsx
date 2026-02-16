'use client';

import { useState, useMemo } from 'react';
import { RiskRequest, CombinedResponse, QuestionType } from '@/lib/types';
import { survey } from '@/config/questions';

export default function RiskAssessment() {
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<{ id: string; type: QuestionType; answer: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<CombinedResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Flatten the survey structure to a list of questions for step-by-step logic
    const flattenedQuestions = useMemo(() => {
        return survey.flatMap(section =>
            section.questions.map(q => ({
                ...q,
                category: section.title,
                type: (section.id === 'section_1' ? 'risk' : 'maturity') as QuestionType
            }))
        );
    }, []);

    const handleAnswer = async (answerValue: string, answerLabel: string) => {
        const question = flattenedQuestions[currentStep];
        // We use the label as the 'answer' to maintain compatibility with the backend check and display
        const newAnswers = [...answers, { id: question.id, type: question.type, answer: answerLabel }];

        if (currentStep < flattenedQuestions.length - 1) {
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

    const question = flattenedQuestions[currentStep];

    return (
        <div className="w-full max-w-3xl mx-auto px-4 py-8 md:py-12 animate-in fade-in duration-700">
            {/* Content Card */}
            <div className="relative overflow-hidden bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl">

                {/* Progress Indicator */}
                <div className="mb-8 md:mb-10">
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400/80">
                            {question.category}
                        </span>
                        <span className="text-xs font-medium text-gray-500">
                            Fråga {currentStep + 1} av {flattenedQuestions.length}
                        </span>
                    </div>
                    <div className="flex space-x-1.5">
                        {flattenedQuestions.map((_, idx) => (
                            <div
                                key={idx}
                                className={`h-1 flex-1 rounded-full transition-all duration-500 ${idx <= currentStep ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 'bg-white/5'
                                    }`}
                            />
                        ))}
                    </div>
                </div>

                {/* Question Content */}
                <div className="space-y-4 mb-10 md:mb-12 text-center md:text-left">
                    <h3 className="text-2xl md:text-3xl font-semibold text-white leading-tight tracking-tight">
                        {question.title}
                    </h3>
                    {question.subtitle && (
                        <p className="text-gray-400/90 text-sm md:text-base leading-relaxed font-light italic border-l-2 border-blue-500/30 pl-4 py-1 text-left">
                            {question.subtitle}
                        </p>
                    )}
                </div>

                {/* Selection Cards */}
                <div className="flex flex-col gap-3 md:gap-4">
                    {question.options.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => handleAnswer(option.value, option.label)}
                            className={`group relative flex items-start gap-4 p-5 md:p-6 text-left rounded-2xl border transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${(currentStep === 0 && option.value === 'yes_decision')
                                    ? 'bg-blue-600/10 border-blue-500/40 hover:bg-blue-600/20'
                                    : 'bg-white/[0.02] border-white/10 hover:bg-white/5 hover:border-white/20'
                                }`}
                        >
                            {/* Radio Indicator */}
                            <div className={`mt-1 flex-shrink-0 w-6 h-6 rounded-full border-2 transition-colors duration-300 flex items-center justify-center ${(currentStep === 0 && option.value === 'yes_decision')
                                    ? 'border-blue-500'
                                    : 'border-gray-600 group-hover:border-gray-400'
                                }`}>
                                <div className={`w-3 h-3 rounded-full bg-blue-500 transition-transform duration-300 scale-0 group-active:scale-100 ${(currentStep === 0 && option.value === 'yes_decision') ? 'scale-100' : ''
                                    }`} />
                            </div>

                            {/* Label Text */}
                            <span className="text-base md:text-lg font-medium text-gray-200 group-hover:text-white transition-colors leading-snug">
                                {option.label}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Subtle Footer Note */}
            <p className="mt-8 text-center text-gray-600 text-[10px] md:text-xs uppercase tracking-widest font-medium opacity-50">
                EU AI Act Tracker &copy; {new Date().getFullYear()}
            </p>
        </div>
    );
}
