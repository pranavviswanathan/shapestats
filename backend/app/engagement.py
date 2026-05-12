from __future__ import annotations

import math
from dataclasses import dataclass

FREQ_CAP = 200.0
PARTICIPATION_CAP = 50.0
WEIGHT_FREQ = 0.4
WEIGHT_BALANCE = 0.4
WEIGHT_PARTICIPATION = 0.2


@dataclass(frozen=True)
class EngagementInputs:
    messages_per_day: float
    human_message_count: int
    ai_message_count: int
    member_count: int


def score_engagement(inputs: EngagementInputs) -> float:
    if inputs.messages_per_day < 0:
        raise ValueError("messages_per_day must be non-negative")
    if inputs.human_message_count < 0 or inputs.ai_message_count < 0:
        raise ValueError("message counts must be non-negative")
    if inputs.member_count <= 0:
        raise ValueError("member_count must be positive")

    total = inputs.human_message_count + inputs.ai_message_count
    if total == 0 and inputs.messages_per_day == 0:
        return 0.0

    freq_score = min(1.0, math.log1p(inputs.messages_per_day) / math.log1p(FREQ_CAP))

    if total == 0:
        balance_score = 0.0
    else:
        human_share = inputs.human_message_count / total
        balance_score = 1.0 - abs(0.5 - human_share) * 2.0

    per_member = total / inputs.member_count
    participation_score = min(1.0, math.log1p(per_member) / math.log1p(PARTICIPATION_CAP))

    weighted = (
        freq_score * WEIGHT_FREQ
        + balance_score * WEIGHT_BALANCE
        + participation_score * WEIGHT_PARTICIPATION
    )
    return round(weighted * 100, 1)
