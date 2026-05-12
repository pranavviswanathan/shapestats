import Link from "next/link";
import { notFound } from "next/navigation";

import { EngagementGauge } from "@/components/EngagementGauge";
import { MemberCard } from "@/components/MemberCard";
import { StatBlock } from "@/components/StatBlock";
import { TalkTimeChart } from "@/components/TalkTimeChart";
import { TopCharactersChart } from "@/components/TopCharactersChart";
import { VibeBreakdown } from "@/components/VibeBreakdown";
import { VibePill } from "@/components/VibePill";
import { api } from "@/lib/api";
import { formatCompact, formatShareAsPercent } from "@/lib/format";

type Params = { params: { id: string } };

export const dynamic = "force-dynamic";

export default async function RoomPage({ params }: Params) {
  let stats;
  try {
    stats = await api.roomStats(params.id);
  } catch {
    notFound();
  }

  const human = stats.total_human;
  const ai = stats.total_ai;
  const totalMessages = human + ai;

  return (
    <div className="space-y-10">
      <div>
        <Link
          href="/"
          className="text-xs text-ink-500 transition hover:text-ink-300"
        >
          ← all rooms
        </Link>
        <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                {stats.name}
              </h1>
              <VibePill vibe={stats.vibe} />
            </div>
            <p className="mt-3 text-sm leading-relaxed text-ink-300">
              {stats.description}
            </p>
          </div>
          <div className="w-full max-w-xs">
            <EngagementGauge score={stats.engagement_score} />
          </div>
        </div>
      </div>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatBlock
          label="Messages / day"
          value={stats.messages_per_day.toFixed(0)}
          hint="7-day average"
        />
        <StatBlock
          label="Total volume"
          value={formatCompact(totalMessages)}
          hint={`${formatCompact(human)} human · ${formatCompact(ai)} AI`}
        />
        <StatBlock
          label="Human share"
          value={formatShareAsPercent(stats.human_share)}
          hint="How balanced the room feels"
        />
        <StatBlock
          label="Members"
          value={stats.members.length.toString()}
          hint="AI shapes in the room"
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="card lg:col-span-2">
          <div className="mb-2 flex items-baseline justify-between">
            <h2 className="text-sm font-semibold text-white">Talk time</h2>
            <span className="text-xs text-ink-500">Human vs AI volume, last 7 days</span>
          </div>
          <TalkTimeChart timeline={stats.timeline} />
        </div>
        <div className="card">
          <div className="mb-3">
            <h2 className="text-sm font-semibold text-white">Vibe breakdown</h2>
            <p className="mt-1 text-xs text-ink-500">
              Heuristic classifier over sampled messages.
            </p>
          </div>
          <VibeBreakdown scores={stats.vibe_scores} />
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="card lg:col-span-2">
          <div className="mb-2 flex items-baseline justify-between">
            <h2 className="text-sm font-semibold text-white">Top characters in this room</h2>
            <span className="text-xs text-ink-500">By AI message count</span>
          </div>
          <TopCharactersChart characters={stats.top_characters} />
        </div>
        <div className="card">
          <h2 className="mb-3 text-sm font-semibold text-white">Sampled messages</h2>
          <ul className="space-y-2 text-xs leading-relaxed text-ink-300">
            {stats.sample_messages.slice(0, 6).map((m, i) => (
              <li key={i} className="rounded-md border border-ink-700 bg-ink-900/40 px-3 py-2">
                {m}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-lg font-semibold tracking-tight text-white">Members</h2>
          <span className="text-xs text-ink-500">Real shapes.inc profiles</span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {stats.members.map((m) => (
            <MemberCard key={m.username} member={m} />
          ))}
        </div>
      </section>
    </div>
  );
}
