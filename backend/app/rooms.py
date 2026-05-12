from __future__ import annotations

from dataclasses import dataclass
from typing import Literal

from app.engagement import EngagementInputs, score_engagement
from app.shape_loader import ShapeProfile, load_all
from app.simulator import SimulatedMember, simulate_room
from app.vibe import classify_vibe, vibe_scores

DEFAULT_DAYS = 7

VibeBias = Literal["chaotic", "wholesome", "productive", "creative", "mixed"]


@dataclass(frozen=True)
class RoomMemberSpec:
    username: str
    vibe_bias: VibeBias


@dataclass(frozen=True)
class RoomDefinition:
    id: str
    name: str
    description: str
    members: tuple[RoomMemberSpec, ...]


ROOMS: tuple[RoomDefinition, ...] = (
    RoomDefinition(
        id="chaos-lounge",
        name="Chaos Lounge",
        description="Late-night nonsense, memes, and absolute mayhem. No agenda, just vibes.",
        members=(
            RoomMemberSpec("tenshi", "chaotic"),
            RoomMemberSpec("echo", "chaotic"),
            RoomMemberSpec("orion", "chaotic"),
        ),
    ),
    RoomDefinition(
        id="wholesome-corner",
        name="Wholesome Corner",
        description="A soft place to land. Encouragement, kindness, and gentle check-ins.",
        members=(
            RoomMemberSpec("aria", "wholesome"),
            RoomMemberSpec("sage", "wholesome"),
        ),
    ),
    RoomDefinition(
        id="study-group",
        name="Study Group",
        description="Focused work session. Standups, shipping updates, and accountability.",
        members=(
            RoomMemberSpec("nova", "productive"),
            RoomMemberSpec("sage", "productive"),
        ),
    ),
    RoomDefinition(
        id="creative-circle",
        name="Creative Circle",
        description="Stories, drafts, music, and worldbuilding. Bring your half-finished ideas.",
        members=(
            RoomMemberSpec("orion", "creative"),
            RoomMemberSpec("zara", "creative"),
        ),
    ),
    RoomDefinition(
        id="late-night-vibes",
        name="Late Night Vibes",
        description="The room that never sleeps. A little chaotic, a little wholesome, always on.",
        members=(
            RoomMemberSpec("tenshi", "mixed"),
            RoomMemberSpec("aria", "mixed"),
            RoomMemberSpec("nova", "mixed"),
        ),
    ),
)


def _all_usernames() -> list[str]:
    seen: dict[str, None] = {}
    for room in ROOMS:
        for member in room.members:
            seen.setdefault(member.username, None)
    return list(seen.keys())


def _simulated_members(spec: RoomDefinition, profiles: dict[str, ShapeProfile]) -> list[SimulatedMember]:
    return [
        SimulatedMember(
            username=m.username,
            display_name=profiles[m.username].name,
            vibe_bias=m.vibe_bias,
        )
        for m in spec.members
    ]


def _member_summary(profile: ShapeProfile) -> dict:
    return {
        "username": profile.username,
        "name": profile.name,
        "avatar_url": profile.avatar_url,
        "tagline": profile.tagline,
        "search_description": profile.search_description,
        "tags": list(profile.tags[:8]),
        "category": profile.category,
        "shapes_message_count": profile.message_count,
        "shapes_user_count": profile.user_count,
    }


def build_room_list(profiles: dict[str, ShapeProfile] | None = None, days: int = DEFAULT_DAYS) -> list[dict]:
    profiles = profiles or load_all(_all_usernames())
    out: list[dict] = []
    for room in ROOMS:
        sim = simulate_room(seed=room.id, members=_simulated_members(room, profiles), days=days)
        messages_per_day = (sim.total_human + sim.total_ai) / max(days, 1)
        score = score_engagement(
            EngagementInputs(
                messages_per_day=messages_per_day,
                human_message_count=sim.total_human,
                ai_message_count=sim.total_ai,
                member_count=len(room.members),
            )
        )
        vibe = classify_vibe(sim.sample_messages)
        primary_avatar = profiles[room.members[0].username].avatar_url
        out.append(
            {
                "id": room.id,
                "name": room.name,
                "description": room.description,
                "avatar_url": primary_avatar,
                "member_count": len(room.members),
                "members_preview": [
                    {"username": profiles[m.username].username, "avatar_url": profiles[m.username].avatar_url}
                    for m in room.members
                ],
                "engagement_score": score,
                "vibe": vibe,
                "messages_per_day": round(messages_per_day, 1),
                "human_share": round(sim.total_human / max(sim.total_human + sim.total_ai, 1), 3),
            }
        )
    return out


def build_room_stats(room_id: str, profiles: dict[str, ShapeProfile] | None = None, days: int = DEFAULT_DAYS) -> dict | None:
    room = next((r for r in ROOMS if r.id == room_id), None)
    if room is None:
        return None
    profiles = profiles or load_all(_all_usernames())
    sim = simulate_room(seed=room.id, members=_simulated_members(room, profiles), days=days)
    messages_per_day = (sim.total_human + sim.total_ai) / max(days, 1)
    score = score_engagement(
        EngagementInputs(
            messages_per_day=messages_per_day,
            human_message_count=sim.total_human,
            ai_message_count=sim.total_ai,
            member_count=len(room.members),
        )
    )
    vibe = classify_vibe(sim.sample_messages)
    scores = vibe_scores(sim.sample_messages)
    timeline = [
        {
            "date": bucket.date,
            "human": bucket.human_count,
            "ai": sum(bucket.ai_count_by_member.values()),
            "ai_by_member": bucket.ai_count_by_member,
        }
        for bucket in sim.timeline
    ]
    top_characters = sorted(
        [
            {
                "username": profiles[u].username,
                "name": profiles[u].name,
                "avatar_url": profiles[u].avatar_url,
                "ai_messages": count,
            }
            for u, count in sim.ai_by_member.items()
        ],
        key=lambda m: m["ai_messages"],
        reverse=True,
    )
    return {
        "id": room.id,
        "name": room.name,
        "description": room.description,
        "vibe": vibe,
        "vibe_scores": scores,
        "engagement_score": score,
        "messages_per_day": round(messages_per_day, 1),
        "total_human": sim.total_human,
        "total_ai": sim.total_ai,
        "human_share": round(sim.total_human / max(sim.total_human + sim.total_ai, 1), 3),
        "timeline": timeline,
        "members": [_member_summary(profiles[m.username]) for m in room.members],
        "top_characters": top_characters,
        "sample_messages": sim.sample_messages,
    }


def build_top_characters_overall(profiles: dict[str, ShapeProfile] | None = None, days: int = DEFAULT_DAYS) -> list[dict]:
    profiles = profiles or load_all(_all_usernames())
    totals: dict[str, int] = {}
    rooms_per_character: dict[str, set[str]] = {}
    for room in ROOMS:
        sim = simulate_room(seed=room.id, members=_simulated_members(room, profiles), days=days)
        for username, count in sim.ai_by_member.items():
            totals[username] = totals.get(username, 0) + count
            rooms_per_character.setdefault(username, set()).add(room.id)
    ranked = sorted(totals.items(), key=lambda kv: kv[1], reverse=True)
    return [
        {
            "username": profiles[u].username,
            "name": profiles[u].name,
            "avatar_url": profiles[u].avatar_url,
            "ai_messages": count,
            "rooms": sorted(rooms_per_character[u]),
        }
        for u, count in ranked
    ]
