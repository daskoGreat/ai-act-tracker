import { NextResponse } from 'next/server';
import { RiskRequest, RiskResponse } from '@/lib/types';

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

        const answersText = answers
            .map((a) => `- Fråga: "${a.questionText}"\n  Svar: ${a.answer}`)
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

        // Combine system and user prompt effectively for Gemma
        // Using simple concatenation for clarity in this strict instruct mode.
        // Gemma 3 instruct format is usually <start_of_turn>user ... <end_of_turn>
        // but the Ollama 'prompt' field works well with raw text too for simple tasks.
        // We'll stick to the requested structure which implies a single block.

        // Constructing the payload for Ollama
        const payload = {
            model: 'gemma3:4b',
            prompt: `${systemPrompt}\n\n${userPrompt}`,
            stream: false,
            options: {
                temperature: 0.0, // Strict deterministic output
            }
        };

        console.log('Sending request to Ollama with payload length:', JSON.stringify(payload).length);

        const ollamaResponse = await fetch('http://127.0.0.1:11434/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!ollamaResponse.ok) {
            console.error('Ollama API error:', ollamaResponse.status, ollamaResponse.statusText);
            return NextResponse.json(
                { error: 'Failed to connect to AI engine' },
                { status: 503 }
            );
        }

        const data = await ollamaResponse.json();
        let riskLevel = data.response.trim();

        // Clean up response if LLM adds periods or extra whitespace
        riskLevel = riskLevel.replace(/\.$/, '');

        // Validate against known levels
        const validLevels = ["Oacceptabel risk", "Hög risk", "Begränsad risk", "Låg / minimal risk"];
        if (!validLevels.includes(riskLevel)) {
            console.warn('Unexpected LLM response:', riskLevel);
            // Fallback or error handling? decided to return what we got but cleaner
        }

        const response: RiskResponse = { riskLevel: riskLevel as any };

        return NextResponse.json(response);

    } catch (error) {
        console.error('Error in AI Risk API:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
