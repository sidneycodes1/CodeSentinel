/**
 * @file components/CodeEditor.tsx
 * Controlled textarea overlaid on a syntax-highlighted pre block.
 */

import React, { useState, useEffect, useRef } from "react";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";

interface CodeEditorProps {
    code: string;
    onChange: (code: string) => void;
    language: string;
    selectedLine?: number | null;
    onScroll?: (e: React.UIEvent<HTMLTextAreaElement>) => void;
}

export default function CodeEditor({ code, onChange, language, selectedLine, onScroll }: CodeEditorProps) {
    const [localCode, setLocalCode] = useState(code);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const preRef = useRef<HTMLPreElement>(null);

    useEffect(() => {
        const handler = setTimeout(() => {
            onChange(localCode);
        }, 300);
        return () => clearTimeout(handler);
    }, [localCode, onChange]);

    useEffect(() => {
        if (code !== localCode) {
            setLocalCode(code);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [code]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Tab") {
            e.preventDefault();
            const target = e.currentTarget;
            const start = target.selectionStart;
            const end = target.selectionEnd;

            const newCode = localCode.substring(0, start) + "  " + localCode.substring(end);
            setLocalCode(newCode);

            setTimeout(() => {
                if (textareaRef.current) {
                    textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
                }
            }, 0);
        }
    };

    const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
        if (preRef.current) {
            preRef.current.scrollTop = e.currentTarget.scrollTop;
            preRef.current.scrollLeft = e.currentTarget.scrollLeft;
        }
        if (onScroll) onScroll(e);
    };

    let highlightedHtml = localCode || " ";
    if (localCode) {
        try {
            if (language && language !== "auto" && hljs.getLanguage(language)) {
                highlightedHtml = hljs.highlight(localCode, { language }).value;
            } else {
                highlightedHtml = hljs.highlightAuto(localCode).value;
            }
        } catch (e) {
            // fallback to raw text
        }
    }

    // Ensure trailing newline renders its height in the pre overlay
    if (localCode.endsWith('\n')) {
        highlightedHtml += ' ';
    }

    useEffect(() => {
        if (selectedLine && textareaRef.current) {
            const lineHeight = 24; // 1.5rem (24px) for leading-6
            const scrollPos = Math.max(0, (selectedLine - 1) * lineHeight - 100);
            textareaRef.current.scrollTo({ top: scrollPos, behavior: 'smooth' });
        }
    }, [selectedLine]);

    return (
        <div className="relative flex-1 bg-[#020617] font-mono text-sm leading-6 overflow-hidden">
            <pre
                ref={preRef}
                className="absolute inset-0 px-6 py-6 m-0 pointer-events-none overflow-hidden text-slate-400"
                aria-hidden="true"
            >
                <code
                    className="hljs block w-full bg-transparent p-0"
                    dangerouslySetInnerHTML={{ __html: highlightedHtml }}
                />
            </pre>

            {selectedLine && (
                <div
                    className="absolute left-0 right-0 bg-indigo-500/10 pointer-events-none border-y border-indigo-500/20 transition-all duration-300"
                    style={{
                        height: '24px',
                        top: `${(selectedLine - 1) * 24 + 24}px` // 24px for padding top
                    }}
                />
            )}

            <textarea
                ref={textareaRef}
                value={localCode}
                onChange={(e) => setLocalCode(e.target.value)}
                onKeyDown={handleKeyDown}
                onScroll={handleScroll}
                spellCheck={false}
                placeholder="// Enter your code here..."
                className="absolute inset-0 w-full h-full px-6 py-6 m-0 bg-transparent text-transparent caret-indigo-500 resize-none outline-none whitespace-pre border-none ring-0 focus:ring-0 selection:bg-indigo-500/30 font-mono text-sm leading-6 z-10"
            />
        </div>
    );
}
