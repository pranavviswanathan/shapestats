import { engagementBand } from "@/lib/format";

const BAND_COLOR = {
  low: "bg-ink-500",
  medium: "bg-accent-500/70",
  high: "bg-accent-400"
} as const;

export function EngagementGauge({ score, compact = false }: { score: number; compact?: boolean }) {
  const band = engagementBand(score);
  const pct = Math.max(0, Math.min(100, score));
  return (
    <div className={compact ? "space-y-1" : "space-y-1.5"}>
      <div className="flex items-baseline justify-between">
        <span className="text-[11px] uppercase tracking-wide text-ink-500">
          Engagement
        </span>
        <span className="font-mono text-sm tabular-nums text-white">
          {score.toFixed(1)}
        </span>
      </div>
      <div className="gauge-track h-1.5 w-full overflow-hidden rounded-full">
        <div
          className={`h-full rounded-full transition-all duration-500 ${BAND_COLOR[band]}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
