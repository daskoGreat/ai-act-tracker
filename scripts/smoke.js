/**
 * Final Smoke Test for Azure Integration
 */
console.log("Checking environment...");
console.log("PROVIDER:", process.env.LLM_PROVIDER);
console.log("ENDPOINT:", process.env.AZURE_OPENAI_ENDPOINT ? "PRESENT" : "MISSING");

async function check() {
    const url = process.env.TEST_URL || "http://localhost:7071/api/smoketest";
    console.log(`Testing endpoint: ${url}`);
    try {
        const res = await fetch(url);
        const data = await res.json();
        console.log("Response:", data);
    } catch (e) {
        console.log("API not reachable locally. This is normal if functions are not running.");
    }
}

check();
