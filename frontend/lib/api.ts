import type { RoomStats, RoomsResponse, TopCharactersResponse } from "@/lib/types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

type FetchOptions = { revalidate?: number };

async function get<T>(path: string, opts: FetchOptions = {}): Promise<T> {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    next: { revalidate: opts.revalidate ?? 60 },
    headers: { Accept: "application/json" }
  });
  if (!res.ok) {
    throw new Error(`API ${path} failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  rooms: () => get<RoomsResponse>("/api/rooms"),
  roomStats: (id: string) => get<RoomStats>(`/api/room/${encodeURIComponent(id)}/stats`),
  topCharacters: () => get<TopCharactersResponse>("/api/top-characters")
};
