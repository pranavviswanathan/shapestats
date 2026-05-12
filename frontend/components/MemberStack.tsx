import type { MemberPreview } from "@/lib/types";
import { MemberAvatar } from "@/components/MemberAvatar";

export function MemberStack({ members, size = 28 }: { members: MemberPreview[]; size?: number }) {
  return (
    <div className="flex -space-x-2">
      {members.map((m) => (
        <MemberAvatar key={m.username} username={m.username} avatarUrl={m.avatar_url} size={size} />
      ))}
    </div>
  );
}
