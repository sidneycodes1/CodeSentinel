/**
 * @file components/ExplainPopover.tsx
 * Appears when text is selected, fetches explanation via API, streams response.
 */

import React, { useEffect, useState, useRef } from "react";

interface ExplainPopoverProps {
    code: string;
    language: string;
    onClose: () => void;
    position: { top: number; left: number };
    selectionText: string;
}

export default function ExplainPopover({ code, language, onClose, position, selectionText }: ExplainPopoverProps) {
    const [explanation, setExplanation] = useState<string>("");
    const [isLoading, setIsLoading] = useState(true);
    const popoverRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let isMounted = true;

        const fetchExplanation = async () => {
            try {
                const res = await fetch("/api/explain", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ code, selection: selectionText, language }),
                });

                if (!res.ok) throw new Error("Failed to fetch explanation");
                if (!res.body) throw new Error("No response body");

                setIsLoading(false);
                const reader = res.body.getReader();
                const decoder = new TextDecoder();
                let resultText = "";

                while (true) {
                    const { value, done } = await reader.read();
                    if (done) break;
                    resultText += decoder.decode(value, { stream: true });
                    if (isMounted) setExplanation(resultText);
                }
            } catch (error) {
                if (isMounted) {
                    setExplanation("An error occurred while generating the explanation. Please try again.");
                    setIsLoading(false);
                }
            }
        };

        if (selectionText) {
            fetchExplanation();
        }

        return () => { isMounted = false; };
    }, [code, language, selectionText]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        const handleClickOutside = (e: MouseEvent) => {
            if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
                onClose();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        // Slight delay so the click that opened the popover doesn't immediately close it
        const timer = setTimeout(() => {
            window.addEventListener("mousedown", handleClickOutside);
        }, 50);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("mousedown", handleClickOutside);
            clearTimeout(timer);
        };
    }, [onClose]);

    if (!selectionText) return null;

    return (
        <div
            ref={popoverRef}
            className="absolute z-50 w-80 md:w-96 surface border-t-2 border-t-indigo-500 rounded-xl flex flex-col transform -translate-y-full mt-[-10px] left-0 md:left-auto overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200 glow-indigo"
            style={{ top: position.top, left: position.left }}
        >
            <div className="bg-slate-900/80 px-4 py-2.5 border-b border-slate-800 flex justify-between items-center">
                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em]">AI_Explanation</span>
                <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <div className="p-5 text-sm text-slate-300 max-h-80 overflow-y-auto leading-relaxed font-medium">
                {isLoading ? (
                    <div className="flex items-center space-x-3 text-slate-400 py-2">
                        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-xs font-medium">Analyzing snippet...</span>
                    </div>
                ) : (
                    <div className="whitespace-pre-wrap">{explanation}</div>
                )}
            </div>
        </div>
    );
}
