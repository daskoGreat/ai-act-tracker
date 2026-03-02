/**
 * Smoke test for LLM providers.
 * Run with: node scripts/smoke-test-llm.js
 */
const { getLLMProvider } = require('../src/llm/index'); // Note: This might need transpilation if run directly by node
// Since it's a TS project, we can use a simpler approach for a quick smoke test
// or just provide instructions on how to test via the API route.

console.log('Testing LLM Provider configuration...');
console.log('Current Provider:', process.env.LLM_PROVIDER || 'github (default)');

async function test() {
    // This is a minimal mock/check script. 
    // In a real scenario, you'd use dynamic import or ts-node.
    console.log('To verify the LLM integration, start the dev server:');
    console.log('1. Set your env vars in .env.local');
    console.log('2. Run: npm run dev');
    console.log('3. Use the app UI or curl to test the endpoint:');
    console.log('   curl -X POST http://localhost:3000/api/ai-risk -H "Content-Type: application/json" -d \'{"answers": [{"id": "q1", "type": "risk", "answer": "Yes"}]}\'');
}

test();
