/**
 * @file components/LineNumbers.tsx
 * Renders a column of line numbers synced to the editor's scroll position.
 */

import React, { forwardRef } from "react";

interface LineNumbersProps {
    lines: number;
}

const LineNumbers = forwardRef<HTMLDivElement, LineNumbersProps>(({ lines }, ref) => {
    return (
        <div
            ref={ref}
            className="flex flex-col items-end py-4 px-3 bg-[#0d1117] border-r border-gray-800 text-gray-600 font-mono text-sm leading-6 select-none overflow-hidden pointer-events-none"
            aria-hidden="true"
        >
            {Array.from({ length: Math.max(1, lines) }).map((_, i) => (
                <span key={i + 1} className="min-w-[1.5rem] text-right">{i + 1}</span>
            ))}
        </div>
    );
});

LineNumbers.displayName = "LineNumbers";
export default LineNumbers;
