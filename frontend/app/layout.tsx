import type { Metadata } from "next";

import { Header } from "@/components/Header";

import "./globals.css";

export const metadata: Metadata = {
  title: "ShapeStats — Conversation Analytics",
  description:
    "Analytics for AI + human group chats. Visualizes engagement, talk time, and vibe across rooms built around real shapes.inc characters.",
  icons: { icon: "/favicon.ico" }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen font-sans">
        <Header />
        <main className="mx-auto max-w-6xl px-5 py-8 sm:py-12">{children}</main>
        <footer className="mx-auto max-w-6xl px-5 pb-10 pt-6 text-xs text-ink-500">
          Shape profiles are real, cached from{" "}
          <a
            href="https://docs.shapes.inc"
            target="_blank"
            rel="noreferrer noopener"
            className="underline-offset-2 hover:text-ink-300 hover:underline"
          >
            shapes.inc
          </a>
          . Conversation metrics are deterministic simulated fixtures.
        </footer>
      </body>
    </html>
  );
}
