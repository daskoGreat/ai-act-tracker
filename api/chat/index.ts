import { AzureFunction, Context, HttpRequest } from "@azure/functions";

const chatTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('JavaScript HTTP trigger function processed a request.');

    // Debug logs as requested
    console.log("Provider:", process.env.LLM_PROVIDER);
    console.log("Deployment:", process.env.AZURE_OPENAI_DEPLOYMENT);

    const provider = process.env.LLM_PROVIDER;
    const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
    const apiKey = process.env.AZURE_OPENAI_API_KEY;
    const deployment = process.env.AZURE_OPENAI_DEPLOYMENT;

    // Strict validation
    if (provider !== "azure") {
        context.res = {
            status: 400,
            body: { error: "LLM_PROVIDER must be 'azure'. GitHub Models is no longer supported." }
        };
        return;
    }

    const missingVars = [];
    if (!endpoint) missingVars.push("AZURE_OPENAI_ENDPOINT");
    if (!apiKey) missingVars.push("AZURE_OPENAI_API_KEY");
    if (!deployment) missingVars.push("AZURE_OPENAI_DEPLOYMENT");

    if (missingVars.length > 0) {
        context.res = {
            status: 500,
            body: { error: `Missing Azure environment variables: ${missingVars.join(", ")}` }
        };
        return;
    }

    const { prompt, messages } = req.body || {};

    if (!prompt && (!messages || !Array.isArray(messages))) {
        context.res = {
            status: 400,
            body: { error: "No prompt or messages provided in request body." }
        };
        return;
    }

    try {
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

        context.res = {
            // status: 200, /* Defaults to 200 */
            body: resultText // Return only text as requested
        };

    } catch (error: any) {
        context.log.error('Error in api/chat:', error);
        context.res = {
            status: 500,
            body: { error: error.message || "Internal Server Error" }
        };
    }
};

export default chatTrigger;
