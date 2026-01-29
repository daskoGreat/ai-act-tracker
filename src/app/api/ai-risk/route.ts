import { NextResponse } from 'next/server';
import { RiskRequest, CombinedResponse, RiskLevel, MaturityLevel } from '@/lib/types';

export const maxDuration = 60; // Allow longer timeout for local LLM

export async function POST(req: Request) {
    try {
        const body: RiskRequest = await req.json();
        const { answers } = body;

        if (!answers || !Array.isArray(answers) || answers.length === 0) {
            return NextResponse.json(
                { error: 'Invalid input: answers array is required' },
                { status: 400 }
            );
        }

        // Filter answers by type
        const riskAnswers = answers.filter(a => a.type === 'risk');
        const maturityAnswers = answers.filter(a => a.type === 'maturity');

        // Get risk classification
        const riskLevel = await classifyRisk(riskAnswers);

        // Get maturity classification
        const maturityLevel = await classifyMaturity(maturityAnswers);

        const response: CombinedResponse = {
            riskLevel,
            maturityLevel
        };

        return NextResponse.json(response);

    } catch (error) {
        console.error('Error in AI Risk API:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

async function classifyRisk(answers: { id: string; answer: string }[]): Promise<RiskLevel> {
    const answersText = answers
        .map((a) => `- Fråga ID: ${a.id}\n  Svar: ${a.answer}`)
        .join('\n');

    const systemPrompt = `Du är en klassificeringsmotor för EU AI Act.

Baserat på användarens svar ska du avgöra vilken risknivå som gäller enligt AI Act.

Tillåtna svar (returnera exakt en):
- Oacceptabel risk
- Hög risk
- Begränsad risk
- Låg / minimal risk

Regler:
- Svara med exakt en av nivåerna ovan
- Inga förklaringar
- Ingen markdown
- Ingen extra text`;

    const userPrompt = `Användarens svar:\n${answersText}`;

    const payload = {
        model: 'gemma3:4b',
        prompt: `${systemPrompt}\n\n${userPrompt}`,
        stream: false,
        options: {
            temperature: 0.0,
        }
    };

    console.log('Sending risk classification request to Ollama');

    const ollamaResponse = await fetch('http://127.0.0.1:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (!ollamaResponse.ok) {
        console.error('Ollama API error:', ollamaResponse.status, ollamaResponse.statusText);
        throw new Error('Failed to connect to AI engine');
    }

    const data = await ollamaResponse.json();
    let riskLevel = data.response.trim().replace(/\.$/, '');

    const validLevels: RiskLevel[] = ["Oacceptabel risk", "Hög risk", "Begränsad risk", "Låg / minimal risk"];
    if (!validLevels.includes(riskLevel as RiskLevel)) {
        console.warn('Unexpected risk LLM response:', riskLevel);
    }

    return riskLevel as RiskLevel;
}

async function classifyMaturity(answers: { id: string; answer: string }[]): Promise<MaturityLevel> {
    const answersText = answers
        .map((a) => `- Fråga ID: ${a.id}\n  Svar: ${a.answer}`)
        .join('\n');

    const systemPrompt = `Du är en klassificeringsmotor för AI Act-mognad.

Baserat på användarens svar ska du avgöra vilken mognadsnivå organisationen har gällande AI Act-efterlevnad.

Tillåtna svar (returnera exakt en):
- Grundläggande
- Utvecklad
- Mogen
- Avancerad

Regler:
- Svara med exakt en av nivåerna ovan
- Inga förklaringar
- Ingen markdown
- Ingen extra text`;

    const userPrompt = `Användarens svar:\n${answersText}`;

    const payload = {
        model: 'gemma3:4b',
        prompt: `${systemPrompt}\n\n${userPrompt}`,
        stream: false,
        options: {
            temperature: 0.0,
        }
    };

    console.log('Sending maturity classification request to Ollama');

    const ollamaResponse = await fetch('http://127.0.0.1:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (!ollamaResponse.ok) {
        console.error('Ollama API error:', ollamaResponse.status, ollamaResponse.statusText);
        throw new Error('Failed to connect to AI engine');
    }

    const data = await ollamaResponse.json();
    let maturityLevel = data.response.trim().replace(/\.$/, '');

    const validLevels: MaturityLevel[] = ["Grundläggande", "Utvecklad", "Mogen", "Avancerad"];
    if (!validLevels.includes(maturityLevel as MaturityLevel)) {
        console.warn('Unexpected maturity LLM response:', maturityLevel);
    }

    return maturityLevel as MaturityLevel;
}
