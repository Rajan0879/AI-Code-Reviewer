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

// Candidate models in preference order
const CANDIDATE_MODELS = [
    process.env.GEMINI_MODEL || "gemini-3.8-flash",
    "gemini-3.8-pro",
    "gemini-1.5-flash",
    "gemini-1.5-pro"
].filter(Boolean);

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function callModelWithRetry(modelName, prompt, maxRetries = 2) {
    let lastError = null;
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            if (attempt > 0) {
                const backoffMs = attempt * 1500;
                console.log(`[Gemini] Retrying ${modelName} (attempt ${attempt + 1}) after ${backoffMs}ms...`);
                await wait(backoffMs);
            }
            const model = genAI.getGenerativeModel({
                model: modelName,
                systemInstruction: SYSTEM_INSTRUCTION
            });
            const result = await model.generateContent(prompt);
            return result.response.text();
        } catch (err) {
            lastError = err;
            const isTransient = err.message && (
                err.message.includes("503") || 
                err.message.includes("high demand") || 
                err.message.includes("ResourceExhausted") || 
                err.message.includes("429")
            );
            
            // If it's a 404 model not found or invalid key, break early
            if (!isTransient) {
                console.warn(`[Gemini] ${modelName} returned permanent error: ${err.message}`);
                break;
            }
            console.warn(`[Gemini] ${modelName} hit high demand (attempt ${attempt + 1}): ${err.message}`);
        }
    }
    throw lastError;
}

async function generateContent(prompt) {
    let lastError = null;
    for (const modelName of CANDIDATE_MODELS) {
        try {
            console.log(`[Gemini] Generating review using: ${modelName}`);
            return await callModelWithRetry(modelName, prompt);
        } catch (err) {
            lastError = err;
            console.warn(`[Gemini] Model ${modelName} could not complete request. Trying next candidate...`);
        }
    }
    throw lastError;
}

module.exports = generateContent;
