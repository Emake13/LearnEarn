// src/app/layout.tsx
import React from "react";
import type { Metadata, Viewport } from "next";
import { Sora, Manrope } from "next/font/google";
import "./globals.css";
import { ScriptExecutor } from "@/components/ScriptExecutor";
import { DevToolsHandler } from "@/components/DevToolsHandler";
import { GlobalErrorCatcher } from "@/components/GlobalErrorCatcher";
import { TemporalLinkBanner } from "@/components/TemporalLinkBanner";
import { AppStateProvider } from "@/components/learnearn/app-state";

/** Display face — geometric, confident, used for the logo, balances and headings. */
const sora = Sora({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

/** Body face — humanist and highly legible at small sizes. */
const manrope = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "LearnEarn — Learn • Earn • Grow",
  description:
    "LearnEarn — a premium mobile fintech wallet where learning turns into earnings.",
};

export const viewport: Viewport = {
  themeColor: "#0B0B0F",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

// SUPER IMPORTANT: NOT EDIT THE FOLLOWING 2 LINES TO FORCE NEXT.JS TO RENDER DYNAMICALLY
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${sora.variable} ${manrope.variable} font-body bg-[#0B0B0F] text-white antialiased`}
      >
        <GlobalErrorCatcher />
        <ScriptExecutor />
        <DevToolsHandler />
        {/* Development-preview only banner. Kept outside the page wrapper so it never covers content. */}
        <TemporalLinkBanner />
        {/*
          Mounted once for the whole app lifetime so the wallet balance is a
          single, truly global reactive value: a claim, task reward or
          withdrawal updates this one instance and every screen that reads
          useAppState() re-renders immediately, with no re-fetch or flicker
          when navigating between pages.
        */}
        <AppStateProvider>
          <div className="min-h-screen flex flex-col">
            <main className="flex-1">{children}</main>
          </div>
        </AppStateProvider>
      </body>
    </html>
  );
}
