import { NextResponse } from 'next/server';
import { RiskRequest, CombinedResponse, RiskLevel, MaturityLevel } from '@/lib/types';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_MODEL = process.env.GITHUB_MODEL || 'openai/gpt-4.1';

export async function POST(req: Request) {
    try {
        if (!GITHUB_TOKEN) {
            return NextResponse.json(
                { error: 'GitHub Models token not configured' },
                { status: 500 }
            );
        }

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

    } catch (error: any) {
        console.error('Error in AI Risk API:', error);

        // Handle specific error statuses from the upstream API
        if (error.status === 401) {
            return NextResponse.json({ error: 'GitHub Token is invalid' }, { status: 401 });
        }
        if (error.status === 403) {
            return NextResponse.json({ error: 'GitHub Token does not have permission' }, { status: 403 });
        }
        if (error.status === 429) {
            return NextResponse.json({ error: 'GitHub Models rate limit exceeded' }, { status: 429 });
        }

        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}

async function callGitHubModel(systemPrompt: string, userPrompt: string) {
    const response = await fetch('https://models.github.ai/inference/chat/completions', {
        method: 'POST',
        headers: {
            'Accept': 'application/vnd.github+json',
            'Authorization': `Bearer ${GITHUB_TOKEN}`,
            'X-GitHub-Api-Version': '2022-11-28',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: GITHUB_MODEL,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
            ],
            temperature: 0.0
        })
    });

    if (!response.ok) {
        const error: any = new Error(`GitHub Models API error: ${response.statusText}`);
        error.status = response.status;
        throw error;
    }

    const data = await response.json();
    return data.choices[0].message.content;
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

    console.log('Sending risk classification request to GitHub Models');
    const content = await callGitHubModel(systemPrompt, userPrompt);
    let riskLevel = content.trim().replace(/\.$/, '');

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

    console.log('Sending maturity classification request to GitHub Models');
    const content = await callGitHubModel(systemPrompt, userPrompt);
    let maturityLevel = content.trim().replace(/\.$/, '');

    const validLevels: MaturityLevel[] = ["Grundläggande", "Utvecklad", "Mogen", "Avancerad"];
    if (!validLevels.includes(maturityLevel as MaturityLevel)) {
        console.warn('Unexpected maturity LLM response:', maturityLevel);
    }

    return maturityLevel as MaturityLevel;
}
