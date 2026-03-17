/**
 * @file app/api/explain/route.ts
 * POST endpoint for streaming code explanations from Claude.
 */

import { NextRequest, NextResponse } from "next/server";
import { streamExplain } from "@/lib/gemini";

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const { code, selection, language } = await req.json();

        if (!code || !selection || !language) {
            return NextResponse.json(
                { error: "Code, selection, and language are required fields." },
                { status: 400 }
            );
        }

        const stream = await streamExplain(code, selection, language);

        const readableStream = new ReadableStream({
            async start(controller) {
                try {
                    for await (const chunk of stream) {
                        const text = chunk.text();
                        if (text) {
                            controller.enqueue(new TextEncoder().encode(text));
                        }
                    }
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
        console.error("Explain API Error:", error);
        return NextResponse.json(
            { error: "Failed to generate explanation.", details: error.message },
            { status: 500 }
        );
    }
}
