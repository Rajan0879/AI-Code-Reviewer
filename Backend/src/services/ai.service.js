const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_KEY);

const SYSTEM_INSTRUCTION = `
AI System Instruction: Senior Code Reviewer (7+ Years of Experience)

Role & Responsibilities:
You are an expert code reviewer with 7+ years of development experience. Your role is to analyze, review, and improve code written by developers. You focus on:
	• Code Quality :- Ensuring clean, maintainable, and well-structured code.
	• Best Practices :- Suggesting industry-standard coding practices.
	• Efficiency & Performance :- Identifying areas to optimize execution time and resource usage.
	• Error Detection :- Spotting potential bugs, security risks, and logical flaws.
	• Scalability :- Advising on how to make code adaptable for future growth.
	• Readability & Maintainability :- Ensuring that the code is easy to understand and modify.

Guidelines for Review:
	1. Provide Constructive Feedback :- Be detailed yet concise, explaining why changes are needed.
	2. Suggest Code Improvements :- Offer refactored versions or alternative approaches when possible.
	3. Detect & Fix Performance Bottlenecks :- Identify redundant operations or costly computations.
	4. Ensure Security Compliance :- Look for common vulnerabilities (e.g., SQL injection, XSS, CSRF).
	5. Promote Consistency :- Ensure uniform formatting, naming conventions, and style guide adherence.
	6. Follow DRY & SOLID Principles :- Reduce code duplication and maintain modular design.
	7. Identify Unnecessary Complexity :- Recommend simplifications when needed.
	8. Verify Test Coverage :- Check if proper unit/integration tests exist and suggest improvements.
	9. Ensure Proper Documentation :- Advise on adding meaningful comments and docstrings.
	10. Encourage Modern Practices :- Suggest modern frameworks, libraries, or patterns when beneficial.

Tone & Approach:
	• Be precise, to the point, and avoid unnecessary fluff.
	• Provide real-world examples when explaining concepts.
	• Assume that the developer is competent but always offer room for improvement.
	• Balance strictness with encouragement.

Output Structure:
❌ Issues & Vulnerabilities
✅ Recommended Fix (Refactored Code block)
💡 Improvements & Technical Explanation
`;

let cachedModels = null;
let lastWorkingModel = null;

/**
 * Dynamically queries Google's ModelService to find models that support generateContent
 */
async function fetchSupportedModels() {
    if (cachedModels && cachedModels.length > 0) {
        return cachedModels;
    }
    try {
        const apiKey = process.env.GOOGLE_GEMINI_KEY;
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        if (!res.ok) {
            console.warn(`Failed to list models from Google: HTTP ${res.status}`);
            return [];
        }
        const data = await res.json();
        const available = (data.models || [])
            .filter(m => m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent"))
            .map(m => m.name.replace("models/", ""));
        
        console.log("[Gemini] Active generateContent models for key:", available);
        cachedModels = available;
        return available;
    } catch (e) {
        console.error("[Gemini] Could not fetch models list:", e.message);
        return [];
    }
}

async function generateContent(prompt) {
    // 1. Determine model list: user override -> last working -> dynamic list -> default fallback
    const dynamicModels = await fetchSupportedModels();
    
    const candidateList = [
        process.env.GEMINI_MODEL,
        lastWorkingModel,
        "gemini-3.8-flash",
        "gemini-2.5-flash",
        ...dynamicModels
    ].filter(Boolean);

    // Remove duplicates
    const uniqueCandidates = Array.from(new Set(candidateList));
    console.log("[Gemini] Testing candidate models in order:", uniqueCandidates);

    let lastError = null;

    for (const modelName of uniqueCandidates) {
        try {
            console.log(`[Gemini] Attempting review with: ${modelName}`);
            const model = genAI.getGenerativeModel({
                model: modelName,
                systemInstruction: SYSTEM_INSTRUCTION
            });

            const result = await model.generateContent(prompt);
            const text = result.response.text();

            // Remember this working model for instant reuse next time
            lastWorkingModel = modelName;
            console.log(`[Gemini] Review successfully generated using: ${modelName}`);
            return text;
        } catch (err) {
            lastError = err;
            console.warn(`[Gemini] Model ${modelName} failed (${err.message}). Trying next candidate...`);
            
            // If the key itself is invalid (400/401/403), stop immediately
            if (err.message && (err.message.includes("API_KEY_INVALID") || err.message.includes("401") || err.message.includes("403"))) {
                throw err;
            }
        }
    }

    throw lastError || new Error("All available Gemini models are currently busy or unavailable. Please try again shortly.");
}

module.exports = generateContent;
module.exports.fetchSupportedModels = fetchSupportedModels;
