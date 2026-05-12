import type { Vibe } from "@/lib/types";

const VIBE_COPY: Record<Vibe, { label: string; description: string }> = {
  chaotic: { label: "Chaotic", description: "Memes, mayhem, no plan." },
  wholesome: { label: "Wholesome", description: "Kindness and support." },
  productive: { label: "Productive", description: "Shipping and standups." },
  creative: { label: "Creative", description: "Stories, music, ideas." }
};

export function vibeLabel(v: Vibe): string {
  return VIBE_COPY[v].label;
}

export function vibeDescription(v: Vibe): string {
  return VIBE_COPY[v].description;
}

export function formatCompact(n: number): string {
  if (n < 1_000) return n.toString();
  if (n < 1_000_000) return `${(n / 1_000).toFixed(n < 10_000 ? 1 : 0)}k`;
  if (n < 1_000_000_000) return `${(n / 1_000_000).toFixed(n < 10_000_000 ? 1 : 0)}M`;
  return `${(n / 1_000_000_000).toFixed(1)}B`;
}

export function formatShareAsPercent(share: number): string {
  return `${Math.round(share * 100)}%`;
}

export function formatShortDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

export function engagementBand(score: number): "low" | "medium" | "high" {
  if (score >= 70) return "high";
  if (score >= 40) return "medium";
  return "low";
}
