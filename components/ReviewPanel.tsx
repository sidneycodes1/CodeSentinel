/**
 * @file components/ReviewPanel.tsx
 * Renders the review results including the score and dynamic suggestions.
 */

import React from "react";
import ScoreBadge from "./ScoreBadge";
import SuggestionCard from "./SuggestionCard";
import { ReviewResult } from "@/types/review";

interface ReviewPanelProps {
    status: "idle" | "loading" | "populated";
    reviewResult: ReviewResult | null;
    onLineSelect: (line: number) => void;
    language: string;
}

const LoadingPulse = () => (
    <div className="flex flex-col items-center space-y-6">
        <div className="relative">
            <div className="w-16 h-16 border-4 border-indigo-500/20 rounded-full animate-ping absolute inset-0"></div>
            <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <div className="flex flex-col items-center">
            <span className="text-sm font-black text-indigo-400 tracking-[0.3em] uppercase animate-pulse">Initializing_Kernel</span>
            <span className="text-[10px] text-slate-500 mt-2 font-mono uppercase tracking-widest">Running diagnostic heuristic...</span>
        </div>
    </div>
);

export default function ReviewPanel({ status, reviewResult, onLineSelect, language }: ReviewPanelProps) {
    const loading = status === "loading";

    if (loading) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-12 h-full bg-slate-950/50 backdrop-blur-3xl">
                <LoadingPulse />
            </div>
        );
    }

    if (!reviewResult) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-slate-500 bg-slate-950/20">
                <div className="w-20 h-20 mb-8 text-slate-800 opacity-50">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                </div>
                <p className="text-sm font-bold tracking-widest text-slate-600 uppercase">Input Required</p>
                <p className="text-xs text-slate-700 mt-2 uppercase tracking-[0.2em]">Ready for system analysis...</p>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto p-8 bg-slate-950/10">
            <div className="max-w-3xl mx-auto pb-20">
                {reviewResult.score !== undefined && reviewResult.score > 0 && <ScoreBadge score={reviewResult.score} />}

                {reviewResult.summary && (
                    <div className="mb-10 p-6 bg-slate-900/40 border border-slate-800/60 rounded-2xl glow-indigo">
                        <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-4">Executive_Summary</h3>
                        <p className="text-slate-300 text-sm leading-relaxed font-medium">{reviewResult.summary}</p>
                    </div>
                )}

                <div className="space-y-4">
                    {reviewResult.suggestions && reviewResult.suggestions.length > 0 ? (
                        reviewResult.suggestions.map((suggestion, idx) => (
                            <SuggestionCard
                                key={`${suggestion.line}-${idx}`}
                                suggestion={suggestion}
                                onLineSelect={onLineSelect}
                                language={language}
                            />
                        ))
                    ) : (
                        <p className="text-slate-500 text-center py-12 surface rounded-xl border-dashed">
                            No issues found. Code looks good!
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
