import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        // Debug logs
        console.log("Provider:", process.env.LLM_PROVIDER);
        console.log("Deployment:", process.env.AZURE_OPENAI_DEPLOYMENT);

        const provider = process.env.LLM_PROVIDER;
        const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
        const apiKey = process.env.AZURE_OPENAI_API_KEY;
        const deployment = process.env.AZURE_OPENAI_DEPLOYMENT;

        // Strict validation
        if (provider !== "azure") {
            return NextResponse.json(
                { error: "LLM_PROVIDER must be 'azure'. GitHub Models is no longer supported." },
                { status: 400 }
            );
        }

        const missingVars = [];
        if (!endpoint) missingVars.push("AZURE_OPENAI_ENDPOINT");
        if (!apiKey) missingVars.push("AZURE_OPENAI_API_KEY");
        if (!deployment) missingVars.push("AZURE_OPENAI_DEPLOYMENT");

        if (missingVars.length > 0) {
            return NextResponse.json(
                { error: `Missing Azure environment variables: ${missingVars.join(", ")}` },
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

        const baseUrl = endpoint!.replace(/\/$/, '');
        const url = `${baseUrl}/openai/deployments/${deployment}/chat/completions?api-version=2024-02-15-preview`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': apiKey!
            },
            body: JSON.stringify({
                messages: messages || [{ role: 'user', content: prompt }],
                temperature: 0.0
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Azure OpenAI API error: ${response.statusText} - ${errorText}`);
        }

        const data = await response.json();
        const resultText = data.choices[0].message.content;

        return new Response(resultText, {
            status: 200,
            headers: { 'Content-Type': 'text/plain; charset=utf-8' }
        });

    } catch (error: any) {
        console.error('Error in api/chat:', error);
        return NextResponse.json(
            { error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
