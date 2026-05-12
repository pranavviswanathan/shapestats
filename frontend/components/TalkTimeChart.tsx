"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import { formatShortDate } from "@/lib/format";
import type { TimelineBucket } from "@/lib/types";

type Row = { date: string; label: string; human: number; ai: number };

export function TalkTimeChart({ timeline }: { timeline: TimelineBucket[] }) {
  const data: Row[] = timeline.map((b) => ({
    date: b.date,
    label: formatShortDate(b.date),
    human: b.human,
    ai: b.ai
  }));

  return (
    <div className="h-[260px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <defs>
            <linearGradient id="humanFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7c5cff" stopOpacity={0.55} />
              <stop offset="100%" stopColor="#7c5cff" stopOpacity={0.05} />
            </linearGradient>
            <linearGradient id="aiFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7ad7c3" stopOpacity={0.5} />
              <stop offset="100%" stopColor="#7ad7c3" stopOpacity={0.04} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#1a1f2e" vertical={false} />
          <XAxis
            dataKey="label"
            stroke="#444a5d"
            tickLine={false}
            axisLine={false}
            fontSize={11}
          />
          <YAxis
            stroke="#444a5d"
            tickLine={false}
            axisLine={false}
            fontSize={11}
            width={36}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#0b0d14",
              border: "1px solid #222838",
              borderRadius: 10,
              fontSize: 12
            }}
            labelStyle={{ color: "#e7e9f1" }}
            cursor={{ stroke: "#2f3850", strokeWidth: 1 }}
          />
          <Area
            type="monotone"
            dataKey="human"
            name="Human"
            stroke="#a08cff"
            strokeWidth={2}
            fill="url(#humanFill)"
          />
          <Area
            type="monotone"
            dataKey="ai"
            name="AI"
            stroke="#7ad7c3"
            strokeWidth={2}
            fill="url(#aiFill)"
          />
        </AreaChart>
      </ResponsiveContainer>
      <div className="mt-2 flex items-center gap-4 px-1 text-xs text-ink-500">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-accent-400" />
          Human
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-vibe-wholesome" />
          AI
        </span>
      </div>
    </div>
  );
}
