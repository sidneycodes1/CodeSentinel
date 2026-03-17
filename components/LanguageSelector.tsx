/**
 * @file components/LanguageSelector.tsx
 * Dropdown for selecting the programming language or Auto-Detect.
 */

import React from "react";

export type SupportedLanguage =
    | "typescript" | "javascript" | "python" | "rust"
    | "go" | "java" | "cpp" | "auto";

interface LanguageSelectorProps {
    language: SupportedLanguage;
    onChange: (language: SupportedLanguage) => void;
    disabled?: boolean;
}

const LANGUAGES: { value: SupportedLanguage; label: string }[] = [
    { value: "auto", label: "Auto-Detect" },
    { value: "typescript", label: "TypeScript" },
    { value: "javascript", label: "JavaScript" },
    { value: "python", label: "Python" },
    { value: "rust", label: "Rust" },
    { value: "go", label: "Go" },
    { value: "java", label: "Java" },
    { value: "cpp", label: "C++" },
];

export default function LanguageSelector({ language, onChange, disabled }: LanguageSelectorProps) {
    return (
        <div className="flex items-center space-x-2">
            <label htmlFor="language-select" className="text-sm font-medium text-gray-300">
                Language:
            </label>
            <select
                id="language-select"
                value={language}
                onChange={(e) => onChange(e.target.value as SupportedLanguage)}
                disabled={disabled}
                className="bg-gray-800 text-gray-200 text-sm border border-gray-700 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 cursor-pointer"
            >
                {LANGUAGES.map((lang) => (
                    <option key={lang.value} value={lang.value}>
                        {lang.label}
                    </option>
                ))}
            </select>
        </div>
    );
}
