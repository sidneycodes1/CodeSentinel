/**
 * @file components/SuggestionCard.tsx
 * Renders a single review suggestion with severity, line number, explanation, and fix.
 */

import React from "react";
import { Suggestion } from "@/types/review";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css"; // Ensure styles are pulled in

interface SuggestionCardProps {
    suggestion: Suggestion;
    onLineSelect: (line: number) => void;
    language?: string;
}

export default function SuggestionCard({ suggestion, onLineSelect, language = "typescript" }: SuggestionCardProps) {
    const { line, severity, title, explanation, suggestion: fixCode } = suggestion;

    let severityClasses = "";

    switch (severity) {
        case "error":
            severityClasses = "border-t-rose-500 bg-rose-500/[0.03] text-rose-50";
            break;
        case "warning":
            severityClasses = "border-t-amber-500 bg-amber-500/[0.03] text-amber-50";
            break;
        case "info":
        default:
            severityClasses = "border-t-indigo-500 bg-indigo-500/[0.03] text-indigo-50";
            break;
    }

    let highlightedHtml = fixCode;
    try {
        if (fixCode) {
            if (language && language !== "auto" && hljs.getLanguage(language)) {
                highlightedHtml = hljs.highlight(fixCode, { language }).value;
            } else {
                highlightedHtml = hljs.highlightAuto(fixCode).value;
            }
        }
    } catch (error) {
        // fallback keeping original text
    }

    return (
        <div className={`p-6 rounded-2xl border border-slate-800 border-t-2 bg-slate-900/40 mb-6 transition-all hover:bg-slate-900/60 group ${severityClasses}`}>
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1 mr-6">
                    <div className="flex items-center space-x-2 mb-1">
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Defect_Title</span>
                    </div>
                    <h4 className="font-bold text-lg leading-tight tracking-tight">{title}</h4>
                </div>
                <button
                    onClick={() => onLineSelect(line)}
                    className="flex flex-col items-center px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 group-hover:border-indigo-500/50 group-hover:shadow-[0_0_15px_rgba(79,70,229,0.2)] transition-all"
                >
                    <span className="text-[9px] font-black text-slate-600 uppercase tracking-tighter">Line</span>
                    <span className="text-sm font-black text-indigo-400 font-mono leading-none mt-0.5">{line}</span>
                </button>
            </div>

            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                {explanation}
            </p>

            {fixCode && (
                <div className="mt-6 bg-[#020617] rounded-xl overflow-hidden border border-slate-800/80 shadow-2xl">
                    <div className="bg-slate-900/50 px-4 py-2 text-[9px] font-black text-indigo-400 border-b border-slate-800/80 uppercase tracking-[0.2em] flex justify-between items-center">
                        <span>Proposed_Resolution</span>
                        <div className="flex space-x-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-800"></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-800"></div>
                        </div>
                    </div>
                    <pre className="p-5 overflow-auto text-xs leading-6 bg-transparent">
                        <code
                            className="hljs bg-transparent p-0 block"
                            dangerouslySetInnerHTML={{ __html: highlightedHtml }}
                        />
                    </pre>
                </div>
            )}
        </div>
    );
}
