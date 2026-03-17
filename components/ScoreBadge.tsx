/**
 * @file components/ScoreBadge.tsx
 * Displays a score 1–10 as a large number with conditional color ring.
 */

import React, { useEffect, useState } from "react";

interface ScoreBadgeProps {
    score: number;
}

export default function ScoreBadge({ score }: ScoreBadgeProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setMounted(true), 10);
        return () => clearTimeout(timer);
    }, []);

    let colorClass = "border-slate-800 text-slate-500";
    if (score >= 1 && score <= 3) {
        colorClass = "border-rose-500/20 text-rose-500 shadow-[0_0_30px_rgba(244,63,94,0.1)]";
    } else if (score >= 4 && score <= 7) {
        colorClass = "border-amber-500/20 text-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.1)]";
    } else if (score >= 8 && score <= 10) {
        colorClass = "border-indigo-500/20 text-indigo-400 shadow-[0_0_30px_rgba(79,70,229,0.15)]";
    }

    return (
        <div className="flex flex-col items-center justify-center p-12 bg-slate-900/30 border border-slate-800/80 rounded-[2rem] mb-12 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent"></div>
            <div
                className={`flex items-center justify-center w-32 h-32 rounded-3xl border-2 text-6xl font-black transition-all duration-1000 ease-out bg-slate-950/80 backdrop-blur-xl ${colorClass} ${mounted ? "scale-100 rotate-0 opacity-100" : "scale-50 rotate-12 opacity-0"}`}
            >
                {score}
            </div>
            <div className="mt-8 text-center">
                <div className="text-[10px] text-indigo-400 font-black tracking-[0.4em] uppercase mb-1">Quality_Heuristic_Score</div>
                <div className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">Calculated via code_sentinel_engine</div>
            </div>
        </div>
    );
}
