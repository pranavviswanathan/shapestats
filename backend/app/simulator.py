from __future__ import annotations

import hashlib
import random
from dataclasses import dataclass, field
from datetime import date, timedelta
from typing import Literal

VibeBias = Literal["chaotic", "wholesome", "productive", "creative", "mixed"]

SAMPLE_MESSAGES: dict[str, tuple[str, ...]] = {
    "chaotic": (
        "lmao what is even happening in here",
        "absolute chaos this morning",
        "mayhem unlocked",
        "no thoughts head empty hahaha",
        "this group is unhinged in the best way",
        "bruh did that really just happen",
        "feral hours have officially begun",
    ),
    "wholesome": (
        "love this group so much",
        "proud of all of you today",
        "this honestly made me smile",
        "you got this, sending support",
        "sweet of you to say that",
        "thank you for the kind words",
        "soft cozy vibes only please",
    ),
    "productive": (
        "ship by Friday? PR is up for review",
        "deploy queue cleared, all green",
        "standup notes in the doc",
        "merged the refactor, docs to follow",
        "ticket triaged, deadline holds",
        "build is fixed, please re-pull",
        "added the schedule to the sprint board",
    ),
    "creative": (
        "the protagonist whispers to the moon",
        "drafting a new verse for the song",
        "imagine if the ending changed entirely",
        "new sketch dropped, tell me what you think",
        "world-building notes piling up",
        "wrote a scene I'm actually proud of",
        "lyrics need one more pass",
    ),
    "mixed": (),
}


@dataclass(frozen=True)
class SimulatedMember:
    username: str
    display_name: str
    vibe_bias: VibeBias


@dataclass(frozen=True)
class DayBucket:
    date: str
    human_count: int
    ai_count_by_member: dict[str, int] = field(default_factory=dict)

    def __eq__(self, other: object) -> bool:
        if not isinstance(other, DayBucket):
            return NotImplemented
        return (
            self.date == other.date
            and self.human_count == other.human_count
            and self.ai_count_by_member == other.ai_count_by_member
        )


@dataclass(frozen=True)
class SimulatedRoom:
    timeline: list[DayBucket]
    sample_messages: list[str]
    total_human: int
    total_ai: int
    ai_by_member: dict[str, int]


def _stable_seed(seed: str) -> int:
    digest = hashlib.sha256(seed.encode("utf-8")).digest()
    return int.from_bytes(digest[:8], "big")


def _pick_pool(member_biases: list[VibeBias]) -> list[str]:
    pool: list[str] = []
    for bias in member_biases:
        if bias in SAMPLE_MESSAGES and SAMPLE_MESSAGES[bias]:
            pool.extend(SAMPLE_MESSAGES[bias])
    if not pool:
        pool = list(SAMPLE_MESSAGES["chaotic"])
    return pool


def simulate_room(
    seed: str,
    members: list[SimulatedMember],
    days: int,
    end_date: date | None = None,
) -> SimulatedRoom:
    if not members:
        raise ValueError("members must not be empty")
    if days <= 0:
        raise ValueError("days must be positive")

    rng = random.Random(_stable_seed(seed))
    end = end_date or date(2026, 5, 12)
    start = end - timedelta(days=days - 1)

    timeline: list[DayBucket] = []
    ai_by_member: dict[str, int] = {m.username: 0 for m in members}
    total_human = 0

    base_daily = rng.randint(15, 120)
    weekly_swing = rng.uniform(0.4, 1.4)

    for i in range(days):
        day = start + timedelta(days=i)
        day_factor = 0.6 + (i / max(days - 1, 1)) * weekly_swing
        weekend_boost = 1.25 if day.weekday() >= 5 else 1.0
        day_total = max(1, int(base_daily * day_factor * weekend_boost * rng.uniform(0.7, 1.3)))

        human_share = rng.uniform(0.35, 0.65)
        human_count = int(day_total * human_share)
        ai_total = day_total - human_count

        ai_split = _split_among_members(rng, ai_total, members)
        for username, count in ai_split.items():
            ai_by_member[username] += count

        timeline.append(DayBucket(date=day.isoformat(), human_count=human_count, ai_count_by_member=ai_split))
        total_human += human_count

    total_ai = sum(ai_by_member.values())

    pool = _pick_pool([m.vibe_bias for m in members])
    sample_count = min(len(pool), 12)
    sample_messages = rng.sample(pool, sample_count)

    return SimulatedRoom(
        timeline=timeline,
        sample_messages=sample_messages,
        total_human=total_human,
        total_ai=total_ai,
        ai_by_member=ai_by_member,
    )


def _split_among_members(rng: random.Random, total: int, members: list[SimulatedMember]) -> dict[str, int]:
    if total == 0 or not members:
        return {m.username: 0 for m in members}
    weights = [rng.uniform(0.4, 1.6) for _ in members]
    weight_sum = sum(weights)
    raw = [total * (w / weight_sum) for w in weights]
    counts = [int(r) for r in raw]
    remainder = total - sum(counts)
    order = sorted(range(len(members)), key=lambda i: raw[i] - counts[i], reverse=True)
    for i in order[:remainder]:
        counts[i] += 1
    return {m.username: c for m, c in zip(members, counts)}
