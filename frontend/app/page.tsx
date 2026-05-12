import Link from "next/link";

import { MemberAvatar } from "@/components/MemberAvatar";
import { RoomCard } from "@/components/RoomCard";
import { api } from "@/lib/api";
import { formatCompact } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [{ rooms }, { characters }] = await Promise.all([api.rooms(), api.topCharacters()]);
  const totalMessages = rooms.reduce((s, r) => s + r.messages_per_day * 7, 0);
  const totalMembers = new Set(rooms.flatMap((r) => r.members_preview.map((m) => m.username))).size;
  const topThree = characters.slice(0, 3);

  return (
    <div className="space-y-10">
      <section>
        <div className="max-w-2xl">
          <p className="text-[11px] uppercase tracking-[0.18em] text-accent-300">
            Conversation analytics
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            What makes AI + human group chats actually engaging?
          </h1>
          <p className="mt-4 text-base leading-relaxed text-ink-300">
            ShapeStats explores the texture of group rooms built around real shapes.inc characters —
            who&apos;s talking, how often humans reply, and the vibe each room settles into.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="Rooms" value={rooms.length.toString()} />
          <Stat label="Unique shapes" value={totalMembers.toString()} />
          <Stat label="Weekly volume" value={formatCompact(Math.round(totalMessages))} />
          <Stat label="Top character" value={topThree[0]?.name ?? "—"} />
        </div>
      </section>

      <section>
        <SectionTitle title="Rooms" subtitle="Engagement, vibe, and member mix at a glance." />
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      </section>

      <section>
        <SectionTitle
          title="Top characters"
          subtitle="Shapes with the highest AI message volume across all rooms."
        />
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {topThree.map((c, idx) => (
            <div key={c.username} className="card flex items-center gap-4">
              <div className="font-mono text-xl tabular-nums text-ink-500">
                {(idx + 1).toString().padStart(2, "0")}
              </div>
              <MemberAvatar username={c.username} avatarUrl={c.avatar_url} size={44} ring={false} />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold text-white">{c.name}</div>
                <div className="text-xs text-ink-500">
                  {formatCompact(c.ai_messages)} AI messages · {c.rooms.length} room
                  {c.rooms.length === 1 ? "" : "s"}
                </div>
              </div>
              <Link
                href={`/room/${c.rooms[0]}`}
                className="text-xs text-accent-300 hover:text-accent-400"
              >
                view →
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="card">
      <div className="text-[11px] uppercase tracking-wide text-ink-500">{label}</div>
      <div className="mt-2 font-mono text-xl tabular-nums text-white">{value}</div>
    </div>
  );
}

function SectionTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="flex items-baseline justify-between">
      <h2 className="text-lg font-semibold tracking-tight text-white">{title}</h2>
      <span className="hidden text-xs text-ink-500 sm:inline">{subtitle}</span>
    </div>
  );
}
