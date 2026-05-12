import { MemberAvatar } from "@/components/MemberAvatar";
import { formatCompact } from "@/lib/format";
import type { RoomMember } from "@/lib/types";

export function MemberCard({ member }: { member: RoomMember }) {
  return (
    <div className="card flex gap-4">
      <MemberAvatar username={member.username} avatarUrl={member.avatar_url} size={56} ring={false} />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <div className="truncate text-sm font-semibold text-white">
            {member.name}
          </div>
          <div className="text-[11px] text-ink-500">@{member.username}</div>
        </div>
        {member.tagline ? (
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-ink-300">
            {member.tagline}
          </p>
        ) : null}
        <div className="mt-2 flex flex-wrap gap-1">
          {member.tags.slice(0, 4).map((t) => (
            <span key={t} className="pill border border-ink-700 bg-ink-800 text-[10px] text-ink-300">
              {t}
            </span>
          ))}
        </div>
        <div className="mt-2 flex gap-4 text-[11px] text-ink-500">
          <span>{formatCompact(member.shapes_message_count)} msgs on shapes.inc</span>
          <span>{formatCompact(member.shapes_user_count)} users</span>
        </div>
      </div>
    </div>
  );
}
