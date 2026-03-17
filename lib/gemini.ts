/**
 * @file lib/gemini.ts
 * Google Gemini API wrapper for streaming review and explanation responses.
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import { REVIEW_SYSTEM_PROMPT, EXPLAIN_SYSTEM_PROMPT, buildReviewUserMessage, buildExplainUserMessage } from "./prompts";

function getGenAI() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error("GEMINI_API_KEY is not set. Add it to .env.local or Vercel Environment Variables.");
    }
    return new GoogleGenerativeAI(apiKey);
}

/**
 * Initializes a streaming request for code review.
 * @param code The source code to review
 * @param language The programming language of the code
 * @param focus Optional array of focus areas
 * @returns An AsyncGenerator yielding string chunks
 */
export async function streamReview(code: string, language: string, focus?: string[]) {
    const genAI = getGenAI();
    const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        systemInstruction: REVIEW_SYSTEM_PROMPT,
        generationConfig: {
            temperature: 0,
            maxOutputTokens: 4096,
            responseMimeType: "application/json",
        }
    });

    const userMessage = buildReviewUserMessage(code, language, focus);
    const result = await model.generateContentStream(userMessage);
    
    return result.stream;
}

/**
 * Initializes a streaming request for a code snippet explanation.
 * @param code The full source code context
 * @param selection The specific code snippet to explain
 * @param language The programming language
 * @returns An AsyncGenerator yielding string chunks
 */
export async function streamExplain(code: string, selection: string, language: string) {
    const genAI = getGenAI();
    const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        systemInstruction: EXPLAIN_SYSTEM_PROMPT,
        generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 2048,
        }
    });

    const userMessage = buildExplainUserMessage(code, selection, language);
    const result = await model.generateContentStream(userMessage);

    return result.stream;
}
