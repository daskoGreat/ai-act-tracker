import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        // Debug logs
        console.log("Provider:", process.env.LLM_PROVIDER);
        console.log("Model:", process.env.GITHUB_MODEL || "gpt-4o-mini");

        const provider = process.env.LLM_PROVIDER;
        const token = process.env.GITHUB_TOKEN;
        const model = process.env.GITHUB_MODEL || "gpt-4o-mini";

        // Optional validation
        if (provider && provider !== "github") {
            return NextResponse.json(
                { error: "LLM_PROVIDER should be 'github'." },
                { status: 400 }
            );
        }

        if (!token) {
            return NextResponse.json(
                { error: "Missing GitHub Models credentials: GITHUB_TOKEN" },
                { status: 500 }
            );
        }

        const body = await req.json().catch(() => ({}));
        const { prompt, messages } = body;

        if (!prompt && (!messages || !Array.isArray(messages))) {
            return NextResponse.json(
                { error: "No prompt or messages provided in request body." },
                { status: 400 }
            );
        }

        const systemPrompt = `Du är en expert på EU AI Act. 
Analysera inskickade svar och returnera ALLTID ett strikt JSON-objekt enligt detta format:
{
  "riskLevel": "string",
  "maturityLevel": "string",
  "explanation": "string"
}

Värden för riskLevel: "Oacceptabel risk", "Hög risk", "Begränsad risk", "Låg / minimal risk".
Värden för maturityLevel: "Grundläggande", "Utvecklad", "Mogen", "Avancerad".
explanation ska vara en kort, professionell sammanfattning på svenska.`;

        const url = "https://models.inference.ai.azure.com/chat/completions";

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                model: model,
                messages: [
                    { role: 'system', content: systemPrompt },
                    ...(messages || [{ role: 'user', content: prompt }])
                ],
                temperature: 0.0,
                response_format: { type: "json_object" }
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`GitHub Models API error: ${response.statusText} - ${errorText}`);
        }

        const data = await response.json();
        const content = data.choices[0].message.content;

        return NextResponse.json(JSON.parse(content));

    } catch (error: any) {
        console.error('Error in api/chat:', error);
        return NextResponse.json(
            { error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
