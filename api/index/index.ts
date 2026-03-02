import { AzureFunction, Context, HttpRequest } from "@azure/functions";

const index: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('API Index route processed a request.');

    context.res = {
        body: "EU AI Act Tracker API is running. Available endpoints: /api/chat, /api/smoketest"
    };
};

export default index;
