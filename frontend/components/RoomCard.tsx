import Link from "next/link";

import { EngagementGauge } from "@/components/EngagementGauge";
import { MemberStack } from "@/components/MemberStack";
import { VibePill } from "@/components/VibePill";
import { formatShareAsPercent } from "@/lib/format";
import type { RoomSummary } from "@/lib/types";

export function RoomCard({ room }: { room: RoomSummary }) {
  return (
    <Link
      href={`/room/${room.id}`}
      className="card card-hover group block focus:outline-none focus:ring-2 focus:ring-accent-500/60"
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold text-white">
            {room.name}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm text-ink-500">
            {room.description}
          </p>
        </div>
        <VibePill vibe={room.vibe} />
      </div>
      <EngagementGauge score={room.engagement_score} compact />
      <div className="mt-4 flex items-end justify-between">
        <div className="flex items-center gap-3">
          <MemberStack members={room.members_preview} />
          <span className="text-xs text-ink-500">
            {room.member_count} members
          </span>
        </div>
        <div className="text-right text-xs leading-tight text-ink-500">
          <div>
            <span className="font-mono text-sm tabular-nums text-white">
              {room.messages_per_day.toFixed(0)}
            </span>{" "}
            msgs/day
          </div>
          <div className="mt-0.5">
            {formatShareAsPercent(room.human_share)} human
          </div>
        </div>
      </div>
    </Link>
  );
}
