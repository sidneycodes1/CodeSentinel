/**
 * @file lib/prompts.ts
 * Prompt templates for the Claude API.
 */

export const REVIEW_SYSTEM_PROMPT = `You are an expert software engineer and code reviewer.
Your task is to review the provided code and return your response STRICTLY as valid JSON.
The JSON must adhere to the following structure:
{
  "suggestions": [
    {
      "line": number, // The specific line number this suggestion applies to
      "severity": "error" | "warning" | "info",
      "title": string, // Short title of the issue
      "explanation": string, // Detailed explanation of the issue
      "suggestion": string // Suggested code fix
    }
  ],
  "summary": string, // General summary of the code review
  "score": number // A score from 1 to 10
}
Ensure that the "score" is between 1 and 10.
You must respond with ONLY a raw JSON object.
Do not include any markdown, code fences, backticks, or explanation.
Do not write \`\`\`json or \`\`\`. Start your response with { and end with }.
Any character before { or after } will break the application.
`;

export const EXPLAIN_SYSTEM_PROMPT = `You are an expert software engineer and coding tutor.
Your task is to explain the selected code snippet clearly and concisely.
Avoid overly complex jargon where simple terms suffice. Provide a step-by-step breakdown if needed.
`;

export function buildReviewUserMessage(code: string, language: string, focus?: string[]): string {
    let prompt = `Please review the following ${language} code:\n\n${code}\n`;
    if (focus && focus.length > 0) {
        prompt += `\nPlease pay special attention to: ${focus.join(", ")}.\n`;
    }
    return prompt;
}

export function buildExplainUserMessage(code: string, selection: string, language: string): string {
    return `Context (${language} code):\n\n${code}\n\nSelected snippet to explain:\n\n${selection}\n\nPlease explain this snippet.`;
}
