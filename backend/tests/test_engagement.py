from app.engagement import EngagementInputs, score_engagement


def _inputs(**kwargs) -> EngagementInputs:
    defaults = dict(
        messages_per_day=20.0,
        human_message_count=50,
        ai_message_count=50,
        member_count=4,
    )
    defaults.update(kwargs)
    return EngagementInputs(**defaults)


def test_dead_room_scores_zero():
    result = score_engagement(_inputs(messages_per_day=0, human_message_count=0, ai_message_count=0))
    assert result == 0


def test_score_is_bounded_between_0_and_100():
    extreme = score_engagement(_inputs(messages_per_day=10_000, human_message_count=10_000, ai_message_count=10_000))
    assert 0 <= extreme <= 100
    minimal = score_engagement(_inputs(messages_per_day=0.5, human_message_count=1, ai_message_count=0))
    assert 0 <= minimal <= 100


def test_balanced_high_volume_scores_higher_than_imbalanced():
    balanced = score_engagement(_inputs(messages_per_day=100, human_message_count=300, ai_message_count=300))
    all_ai = score_engagement(_inputs(messages_per_day=100, human_message_count=0, ai_message_count=600))
    all_human = score_engagement(_inputs(messages_per_day=100, human_message_count=600, ai_message_count=0))
    assert balanced > all_ai
    assert balanced > all_human


def test_higher_message_frequency_increases_score_when_balance_held_constant():
    low = score_engagement(_inputs(messages_per_day=5, human_message_count=10, ai_message_count=10))
    high = score_engagement(_inputs(messages_per_day=80, human_message_count=160, ai_message_count=160))
    assert high > low


def test_score_is_deterministic_for_same_inputs():
    a = score_engagement(_inputs(messages_per_day=42, human_message_count=99, ai_message_count=101))
    b = score_engagement(_inputs(messages_per_day=42, human_message_count=99, ai_message_count=101))
    assert a == b


def test_perfect_balance_gives_full_balance_credit():
    perfect = score_engagement(_inputs(messages_per_day=100, human_message_count=500, ai_message_count=500))
    near_perfect = score_engagement(_inputs(messages_per_day=100, human_message_count=510, ai_message_count=490))
    assert perfect >= near_perfect


def test_negative_inputs_are_rejected():
    import pytest

    with pytest.raises(ValueError):
        score_engagement(_inputs(messages_per_day=-1))
    with pytest.raises(ValueError):
        score_engagement(_inputs(human_message_count=-1))
    with pytest.raises(ValueError):
        score_engagement(_inputs(member_count=0))
