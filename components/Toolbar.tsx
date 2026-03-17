/**
 * @file components/Toolbar.tsx
 * Top toolbar for actions and language selection.
 */

import React, { useState } from "react";
import LanguageSelector, { SupportedLanguage } from "./LanguageSelector";

interface ToolbarProps {
    language: SupportedLanguage;
    onLanguageChange: (lang: SupportedLanguage) => void;
    onReview: () => void;
    onClear: () => void;
    code: string;
    isStreaming: boolean;
}

export default function Toolbar({ language, onLanguageChange, onReview, onClear, code, isStreaming }: ToolbarProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        if (!code) return;
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (e) {
            console.error("Failed to copy code", e);
        }
    };

    return (
        <div className="flex items-center justify-between px-8 py-4 bg-slate-950/80 border-b border-slate-800/60 backdrop-blur-md sticky top-0 z-50">
            <div className="flex items-center space-x-8">
                <h1 className="flex items-center space-x-3 group cursor-pointer">
                    <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-black tracking-tighter text-white uppercase leading-none">Code_Sentinel</span>
                        <span className="text-[10px] font-bold text-indigo-400/80 tracking-widest uppercase mt-0.5">V2.5 Regular</span>
                    </div>
                </h1>
                <div className="h-8 border-l border-slate-800/80"></div>
                <LanguageSelector language={language} onChange={onLanguageChange} disabled={isStreaming} />
            </div>

            <div className="flex items-center space-x-4">
                <button
                    onClick={handleCopy}
                    disabled={!code}
                    className="flex items-center px-4 py-2 text-xs font-bold text-slate-400 bg-slate-900/50 border border-slate-800 rounded-lg hover:text-white hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-30 cursor-pointer"
                >
                    {copied ? (
                        <svg className="w-3.5 h-3.5 mr-2 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                    ) : (
                        <svg className="w-3.5 h-3.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                    )}
                    {copied ? "COPIED" : "COPY_SOURCE"}
                </button>

                <button
                    onClick={onClear}
                    disabled={isStreaming || !code}
                    className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-rose-400 transition-colors uppercase tracking-widest disabled:opacity-30 cursor-pointer"
                >
                    Wipe
                </button>

                <button
                    onClick={onReview}
                    disabled={isStreaming || !code}
                    className="flex items-center px-6 py-2 text-xs font-black text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 hover:shadow-[0_0_20px_rgba(79,70,229,0.3)] transition-all duration-300 active:scale-95 disabled:bg-slate-800 disabled:text-slate-600 group cursor-pointer"
                >
                    {isStreaming ? (
                        <>
                            <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin mr-3"></div>
                            ANALYZING...
                        </>
                    ) : (
                        <>
                            <svg className="w-3.5 h-3.5 mr-2 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            SCAN_FOR_DEFECTS
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
