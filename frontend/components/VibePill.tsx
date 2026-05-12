import type { Vibe } from "@/lib/types";
import { vibeLabel } from "@/lib/format";

const STYLE: Record<Vibe, string> = {
  chaotic: "border-vibe-chaotic/40 bg-vibe-chaotic/10 text-vibe-chaotic",
  wholesome: "border-vibe-wholesome/40 bg-vibe-wholesome/10 text-vibe-wholesome",
  productive: "border-vibe-productive/40 bg-vibe-productive/10 text-accent-300",
  creative: "border-vibe-creative/40 bg-vibe-creative/10 text-vibe-creative"
};

const DOT: Record<Vibe, string> = {
  chaotic: "bg-vibe-chaotic",
  wholesome: "bg-vibe-wholesome",
  productive: "bg-vibe-productive",
  creative: "bg-vibe-creative"
};

export function VibePill({ vibe }: { vibe: Vibe }) {
  return (
    <span className={`pill border ${STYLE[vibe]}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${DOT[vibe]}`} />
      {vibeLabel(vibe)}
    </span>
  );
}
