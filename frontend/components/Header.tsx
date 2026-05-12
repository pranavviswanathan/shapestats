import Link from "next/link";

import { DemoBadge } from "@/components/DemoBadge";

export function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-ink-700/60 bg-ink-950/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link href="/" className="group flex items-center gap-3">
          <div className="relative h-8 w-8">
            <span className="absolute inset-0 rotate-45 rounded-md bg-accent-500/30 blur-[6px] transition-all duration-300 group-hover:bg-accent-500/50" />
            <span className="relative flex h-8 w-8 items-center justify-center rounded-md border border-accent-500/40 bg-ink-900 text-xs font-bold text-accent-300">
              S
            </span>
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-tight text-white">
              ShapeStats
            </div>
            <div className="text-[11px] text-ink-500">
              Conversation analytics for AI + human group chats
            </div>
          </div>
        </Link>
        <div className="flex items-center gap-3">
          <DemoBadge />
          <a
            href="https://docs.shapes.inc"
            target="_blank"
            rel="noreferrer noopener"
            className="hidden text-xs text-ink-500 transition hover:text-ink-300 sm:inline"
          >
            shapes.inc ↗
          </a>
        </div>
      </div>
    </header>
  );
}
