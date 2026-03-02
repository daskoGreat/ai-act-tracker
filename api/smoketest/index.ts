import { AzureFunction, Context, HttpRequest } from "@azure/functions";

const smokeTest: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('Smoke test processed a request.');

    context.res = {
        body: {
            status: "OK",
            message: "API is running",
            provider: process.env.LLM_PROVIDER,
            deployment: process.env.AZURE_OPENAI_DEPLOYMENT,
            hasEndpoint: !!process.env.AZURE_OPENAI_ENDPOINT,
            hasKey: !!process.env.AZURE_OPENAI_API_KEY
        }
    };
};

export default smokeTest;
