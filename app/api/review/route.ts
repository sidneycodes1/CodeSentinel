/**
 * @file app/api/review/route.ts
 * POST endpoint for streaming code reviews from Claude.
 */

import { NextRequest, NextResponse } from "next/server";
import { streamReview } from "@/lib/gemini";

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const { code, language, focus } = await req.json();

        if (!code || !language) {
            return NextResponse.json(
                { error: "Code and language are required fields." },
                { status: 400 }
            );
        }


        const stream = await streamReview(code, language, focus);

        let rawString = "";
        for await (const chunk of stream) {
            rawString += chunk.text();
        }

        let result;
        try {
            result = JSON.parse(rawString);
        } catch (e) {
            const match = rawString.match(/\{[\s\S]*\}/);
            result = JSON.parse(match ? match[0] : "{}");
        }

        return NextResponse.json(result, { status: 200 });
    } catch (err: any) {
        console.error('API route error:', err?.message ?? err);
        return NextResponse.json(
            { error: err?.message ?? 'Internal server error' },
            { status: 500 }
        );
    }
}
