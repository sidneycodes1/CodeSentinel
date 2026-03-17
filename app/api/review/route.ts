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

        console.log('[review] route hit, code length:', code.length);
        console.log('[review] calling Gemini...');

        const stream = await streamReview(code, language, focus);

        const readableStream = new ReadableStream({
            async start(controller) {
                let rawLength = 0;
                try {
                    for await (const chunk of stream) {
                        const text = chunk.text();
                        if (text) {
                            rawLength += text.length;
                            controller.enqueue(new TextEncoder().encode(text));
                        }
                    }
                    console.log('[review] stream complete, raw length:', rawLength);
                    controller.close();
                } catch (error) {
                    controller.error(error);
                }
            },
        });

        return new Response(readableStream, {
            headers: {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
            },
        });
    } catch (error: any) {
        console.error("Review route error:", error);
        return new Response(
            JSON.stringify({ error: "Review failed", detail: String(error) }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
