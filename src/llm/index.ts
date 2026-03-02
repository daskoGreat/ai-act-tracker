export interface GenerateOptions {
    temperature?: number;
    maxTokens?: number;
}

export interface LLMProvider {
    generateAnswer(systemPrompt: string, userPrompt: string, options?: GenerateOptions): Promise<string>;
}

class GitHubModelsProvider implements LLMProvider {
    private token: string;
    private model: string;

    constructor() {
        this.token = process.env.GITHUB_TOKEN || '';
        this.model = process.env.GITHUB_MODEL || 'openai/gpt-4.1';
        if (!this.token) {
            console.warn('GITHUB_TOKEN is not defined');
        }
    }

    async generateAnswer(systemPrompt: string, userPrompt: string, options?: GenerateOptions): Promise<string> {
        const response = await fetch('https://models.github.ai/inference/chat/completions', {
            method: 'POST',
            headers: {
                'Accept': 'application/vnd.github+json',
                'Authorization': `Bearer ${this.token}`,
                'X-GitHub-Api-Version': '2022-11-28',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: this.model,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt }
                ],
                temperature: options?.temperature ?? 0.0,
                max_tokens: options?.maxTokens
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
}

class AzureOpenAIProvider implements LLMProvider {
    private endpoint: string;
    private apiKey: string;
    private deployment: string;

    constructor() {
        this.endpoint = process.env.AZURE_OPENAI_ENDPOINT || '';
        this.apiKey = process.env.AZURE_OPENAI_API_KEY || '';
        this.deployment = process.env.AZURE_OPENAI_DEPLOYMENT || '';

        if (!this.apiKey || !this.endpoint || !this.deployment) {
            console.warn('Azure OpenAI configuration is incomplete');
        }
    }

    async generateAnswer(systemPrompt: string, userPrompt: string, options?: GenerateOptions): Promise<string> {
        // Remove trailing slash from endpoint if present
        const baseUrl = this.endpoint.replace(/\/$/, '');
        const url = `${baseUrl}/openai/deployments/${this.deployment}/chat/completions?api-version=2024-02-15-preview`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': this.apiKey
            },
            body: JSON.stringify({
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt }
                ],
                temperature: options?.temperature ?? 0.0,
                max_tokens: options?.maxTokens
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            const error: any = new Error(`Azure OpenAI API error: ${response.statusText} - ${errorText}`);
            error.status = response.status;
            throw error;
        }

        const data = await response.json();
        return data.choices[0].message.content;
    }
}

export function getLLMProvider(): LLMProvider {
    const provider = process.env.LLM_PROVIDER?.toLowerCase();

    if (provider === 'azure') {
        return new AzureOpenAIProvider();
    }

    // Default to GitHub
    return new GitHubModelsProvider();
}
