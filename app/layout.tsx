/**
 * @file app/layout.tsx
 * Root layout for the Next.js application.
 */

import React from "react";
import "./globals.css";

export const metadata = {
    title: "AI Code Review Tool",
    description: "AI-Powered Code Review with Claude",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className="bg-[#0a0a0a] text-gray-200 antialiased min-h-screen">
                {children}
            </body>
        </html>
    );
}
