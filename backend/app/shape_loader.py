from __future__ import annotations

import json
from dataclasses import dataclass
from pathlib import Path

SEED_DIR = Path(__file__).resolve().parent.parent / "data" / "seed_shapes"


@dataclass(frozen=True)
class ShapeProfile:
    id: str
    username: str
    name: str
    avatar_url: str | None
    banner: str | None
    tagline: str | None
    search_description: str | None
    tags: tuple[str, ...]
    category: str | None
    message_count: int
    user_count: int
    typical_phrases: tuple[str, ...]

    @classmethod
    def from_api_payload(cls, raw: dict) -> "ShapeProfile":
        return cls(
            id=str(raw.get("id") or raw["username"]),
            username=raw["username"],
            name=raw.get("name") or raw["username"],
            avatar_url=raw.get("avatar_url") or raw.get("avatar"),
            banner=raw.get("banner"),
            tagline=raw.get("tagline"),
            search_description=raw.get("search_description"),
            tags=tuple(raw.get("search_tags_v3") or raw.get("search_tags_v2") or []),
            category=raw.get("category"),
            message_count=int(raw.get("message_count") or 0),
            user_count=int(raw.get("user_count") or 0),
            typical_phrases=tuple(raw.get("typical_phrases") or []),
        )


def load_shape(username: str, seed_dir: Path = SEED_DIR) -> ShapeProfile:
    path = seed_dir / f"{username}.json"
    if not path.exists():
        raise FileNotFoundError(f"No cached profile for {username} at {path}")
    with path.open() as f:
        raw = json.load(f)
    return ShapeProfile.from_api_payload(raw)


def load_all(usernames: list[str], seed_dir: Path = SEED_DIR) -> dict[str, ShapeProfile]:
    return {u: load_shape(u, seed_dir) for u in usernames}
