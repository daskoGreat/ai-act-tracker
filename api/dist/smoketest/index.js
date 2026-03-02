"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const smokeTest = function (context, req) {
    return __awaiter(this, void 0, void 0, function* () {
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
    });
};
exports.default = smokeTest;
//# sourceMappingURL=index.js.map