"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import type { TopCharacter } from "@/lib/types";

export function TopCharactersChart({ characters }: { characters: TopCharacter[] }) {
  const data = characters.map((c) => ({ name: c.name, value: c.ai_messages }));

  return (
    <div className="h-[260px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="#1a1f2e" horizontal={false} />
          <XAxis
            type="number"
            stroke="#444a5d"
            tickLine={false}
            axisLine={false}
            fontSize={11}
          />
          <YAxis
            type="category"
            dataKey="name"
            stroke="#cbc0ff"
            tickLine={false}
            axisLine={false}
            fontSize={12}
            width={88}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#0b0d14",
              border: "1px solid #222838",
              borderRadius: 10,
              fontSize: 12
            }}
            cursor={{ fill: "#11141d" }}
          />
          <Bar dataKey="value" name="AI messages" fill="#7c5cff" radius={[0, 6, 6, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
