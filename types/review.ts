/**
 * @file types/review.ts
 * Type definitions for the AI Code Review tool.
 */

export type SeverityLevel = "error" | "warning" | "info";

export interface Suggestion {
    line: number;
    severity: SeverityLevel;
    title: string;
    explanation: string;
    suggestion: string;
}

export interface ReviewResult {
    suggestions: Suggestion[];
    summary: string;
    score: number;
}
