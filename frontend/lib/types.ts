export type Vibe = "chaotic" | "wholesome" | "productive" | "creative";

export type MemberPreview = {
  username: string;
  avatar_url: string | null;
};

export type RoomSummary = {
  id: string;
  name: string;
  description: string;
  avatar_url: string | null;
  member_count: number;
  members_preview: MemberPreview[];
  engagement_score: number;
  vibe: Vibe;
  messages_per_day: number;
  human_share: number;
};

export type RoomsResponse = {
  rooms: RoomSummary[];
  data_disclosure: {
    shape_profiles: string;
    conversations: string;
  };
};

export type TimelineBucket = {
  date: string;
  human: number;
  ai: number;
  ai_by_member: Record<string, number>;
};

export type RoomMember = {
  username: string;
  name: string;
  avatar_url: string | null;
  tagline: string | null;
  search_description: string | null;
  tags: string[];
  category: string | null;
  shapes_message_count: number;
  shapes_user_count: number;
};

export type TopCharacter = {
  username: string;
  name: string;
  avatar_url: string | null;
  ai_messages: number;
};

export type RoomStats = {
  id: string;
  name: string;
  description: string;
  vibe: Vibe;
  vibe_scores: Record<Vibe, number>;
  engagement_score: number;
  messages_per_day: number;
  total_human: number;
  total_ai: number;
  human_share: number;
  timeline: TimelineBucket[];
  members: RoomMember[];
  top_characters: TopCharacter[];
  sample_messages: string[];
};

export type OverallTopCharacter = TopCharacter & { rooms: string[] };
export type TopCharactersResponse = { characters: OverallTopCharacter[] };
