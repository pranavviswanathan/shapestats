from __future__ import annotations

import re
from collections.abc import Iterable, Sequence

VIBE_LABELS: tuple[str, ...] = ("chaotic", "wholesome", "productive", "creative")

_KEYWORDS: dict[str, frozenset[str]] = {
    "chaotic": frozenset({
        "chaos", "chaotic", "lmao", "lol", "wtf", "mayhem", "mess", "wild",
        "hahaha", "lmfao", "unhinged", "feral", "no thoughts", "bruh", "meme",
        "shitpost", "spam", "ratio", "based",
    }),
    "wholesome": frozenset({
        "love", "loved", "loves", "proud", "sweet", "kind", "thank", "thanks",
        "appreciate", "hug", "cozy", "soft", "support", "supportive",
        "you got this", "feel better", "heal", "healing", "healer",
    }),
    "productive": frozenset({
        "ship", "shipped", "merge", "merged", "deploy", "deployed", "pr",
        "review", "standup", "stand-up", "sprint", "ticket", "issue", "doc",
        "docs", "api", "build", "fix", "refactor", "schedule", "deadline",
        "todo", "done",
    }),
    "creative": frozenset({
        "story", "stories", "draft", "drafting", "write", "wrote", "writing",
        "protagonist", "character", "scene", "lyrics", "song", "music",
        "imagine", "imagining", "imagined", "dream", "art", "paint",
        "sketch", "design", "world-building", "verse", "poem", "moon",
        "whisper", "whispers", "ending",
    }),
}

_TOKEN_RE = re.compile(r"[a-z][a-z'-]*")


def _normalize(messages: Iterable[str]) -> str:
    return " ".join(messages).lower()


def vibe_scores(messages: Sequence[str]) -> dict[str, float]:
    text = _normalize(messages)
    tokens = _TOKEN_RE.findall(text)
    total_tokens = max(len(tokens), 1)
    token_set = set(tokens)

    out: dict[str, float] = {}
    for label in VIBE_LABELS:
        single_word_hits = sum(1 for kw in _KEYWORDS[label] if " " not in kw and kw in token_set)
        phrase_hits = sum(1 for kw in _KEYWORDS[label] if " " in kw and kw in text)
        raw = (single_word_hits + phrase_hits * 2) / total_tokens
        out[label] = min(1.0, raw * 8.0)
    return out


def classify_vibe(messages: Sequence[str]) -> str:
    scores = vibe_scores(messages)
    best_label = VIBE_LABELS[0]
    best_score = -1.0
    for label in VIBE_LABELS:
        if scores[label] > best_score:
            best_score = scores[label]
            best_label = label
    return best_label
