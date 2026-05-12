import type { Vibe } from "@/lib/types";

const ORDER: Vibe[] = ["chaotic", "wholesome", "productive", "creative"];

const BAR_COLOR: Record<Vibe, string> = {
  chaotic: "bg-vibe-chaotic",
  wholesome: "bg-vibe-wholesome",
  productive: "bg-vibe-productive",
  creative: "bg-vibe-creative"
};

const LABEL: Record<Vibe, string> = {
  chaotic: "Chaotic",
  wholesome: "Wholesome",
  productive: "Productive",
  creative: "Creative"
};

export function VibeBreakdown({ scores }: { scores: Record<Vibe, number> }) {
  return (
    <div className="space-y-3">
      {ORDER.map((v) => {
        const pct = Math.min(100, Math.max(0, scores[v] * 100));
        return (
          <div key={v}>
            <div className="mb-1 flex items-baseline justify-between text-xs">
              <span className="text-ink-300">{LABEL[v]}</span>
              <span className="font-mono tabular-nums text-ink-500">
                {pct.toFixed(0)}
              </span>
            </div>
            <div className="gauge-track h-1.5 w-full overflow-hidden rounded-full">
              <div
                className={`h-full rounded-full ${BAR_COLOR[v]}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
