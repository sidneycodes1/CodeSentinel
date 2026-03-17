/**
 * @file app/page.tsx
 * Main application page composing all components.
 */
"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import CodeEditor from "@/components/CodeEditor";
import ReviewPanel from "@/components/ReviewPanel";
import Toolbar from "@/components/Toolbar";
import LineNumbers from "@/components/LineNumbers";
import ExplainPopover from "@/components/ExplainPopover";
import { SupportedLanguage } from "@/components/LanguageSelector";
import { ReviewResult } from "@/types/review";

export default function Home() {
    const [code, setCode] = useState<string>("");
    const [language, setLanguage] = useState<SupportedLanguage>("typescript");
    const [reviewStatus, setReviewStatus] = useState<"idle" | "loading" | "populated">("idle");
    const [reviewResult, setReviewResult] = useState<ReviewResult | null>(null);
    const [selectedLine, setSelectedLine] = useState<number | null>(null);
    const [isStreaming, setIsStreaming] = useState(false);

    const [popoverState, setPopoverState] = useState<{
        visible: boolean;
        position: { top: number; left: number };
        selectionText: string;
    }>({
        visible: false,
        position: { top: 0, left: 0 },
        selectionText: "",
    });

    const editorScrollRef = useRef<HTMLDivElement>(null);

    const linesCount = code ? code.split("\n").length : 1;

    const handleEditorScroll = useCallback((e: React.UIEvent<HTMLTextAreaElement>) => {
        if (editorScrollRef.current) {
            editorScrollRef.current.scrollTop = e.currentTarget.scrollTop;
        }
    }, []);

    const handleReviewCode = async () => {
        if (!code.trim()) return;

        setIsStreaming(true);
        setReviewStatus("loading");
        setReviewResult(null);
        setSelectedLine(null);

        try {
            console.log('[client] fetch started');
            const res = await fetch("/api/review", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code, language }),
            });

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                console.error('API error:', err);
                return;
            }
            if (!res.body) throw new Error("No response body");

            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let rawString = "";

            while (true) {
                const { value, done } = await reader.read();
                if (done) break;
                rawString += decoder.decode(value, { stream: true });
            }
            
            rawString += decoder.decode(); // Flush stream

            console.log('[client] stream reading complete');
            
            // Robust JSON extraction
            const jsonMatch = rawString.match(/\{[\s\S]*\}/);
            const cleaned = jsonMatch ? jsonMatch[0] : rawString.trim();

            try {
                const result: ReviewResult = JSON.parse(cleaned);
                console.log('[client] parsed result:', result);
                setReviewResult(result);
                setReviewStatus("populated");
            } catch (err) {
                console.error('[client] JSON Parse Error:', err);
                console.log('[client] Fallback: raw response might not be JSON');
                // Could set a fallback result here or show error toast
                setReviewStatus("idle");
            }
            
        } catch (error) {
            console.error("Review Error:", error);
            setReviewStatus("idle");
        } finally {
            setIsStreaming(false);
            setReviewStatus((prev) => prev === "loading" ? "idle" : prev);
        }
    };

    const handleClear = () => {
        setCode("");
        setReviewStatus("idle");
        setReviewResult(null);
        setSelectedLine(null);
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ctrl+Shift+E
            if (e.ctrlKey && e.shiftKey && (e.key === "e" || e.key === "E")) {
                e.preventDefault();
                const sel = window.getSelection();
                if (sel && sel.toString().trim()) {
                    const range = sel.getRangeAt(0);
                    const rect = range.getBoundingClientRect();
                    setPopoverState({
                        visible: true,
                        position: {
                            top: rect.top + window.scrollY,
                            left: rect.left + window.scrollX,
                        },
                        selectionText: sel.toString(),
                    });
                }
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-slate-950 text-slate-100 selection:bg-indigo-500/30">
            <Toolbar
                language={language}
                onLanguageChange={setLanguage}
                onReview={handleReviewCode}
                onClear={handleClear}
                code={code}
                isStreaming={isStreaming}
            />

            <div className="flex flex-1 overflow-hidden md:flex-row flex-col">
                {/* Left Panel: Editor */}
                <div className="flex flex-1 min-h-[40vh] md:min-h-0 border-b md:border-b-0 md:border-r border-slate-900 relative z-0">
                    <LineNumbers lines={linesCount} ref={editorScrollRef} />
                    <CodeEditor
                        code={code}
                        onChange={setCode}
                        language={language}
                        selectedLine={selectedLine}
                        onScroll={handleEditorScroll}
                    />
                </div>

                {/* Right Panel: Review */}
                <div className="flex flex-1 min-h-[40vh] md:min-h-0 relative z-0 bg-slate-950/50">
                    <ReviewPanel
                        status={reviewStatus}
                        reviewResult={reviewResult}
                        onLineSelect={setSelectedLine}
                        language={language}
                    />
                </div>
            </div>

            {popoverState.visible && (
                <ExplainPopover
                    code={code}
                    language={language}
                    selectionText={popoverState.selectionText}
                    position={popoverState.position}
                    onClose={() => setPopoverState(prev => ({ ...prev, visible: false }))}
                />
            )}
        </div>
    );
}
