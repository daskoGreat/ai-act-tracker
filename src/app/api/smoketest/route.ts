import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({
        status: "OK",
        message: "API is running (Next.js Hybrid)",
        provider: process.env.LLM_PROVIDER,
        deployment: process.env.AZURE_OPENAI_DEPLOYMENT,
        hasEndpoint: !!process.env.AZURE_OPENAI_ENDPOINT,
        hasKey: !!process.env.AZURE_OPENAI_API_KEY
    });
}
