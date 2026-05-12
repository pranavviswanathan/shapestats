from app.simulator import SimulatedMember, simulate_room


def _members() -> list[SimulatedMember]:
    return [
        SimulatedMember(username="tenshi", display_name="Tenshi", vibe_bias="chaotic"),
        SimulatedMember(username="aria", display_name="Aria", vibe_bias="wholesome"),
        SimulatedMember(username="nova", display_name="Nova", vibe_bias="productive"),
    ]


def test_simulator_is_deterministic_for_same_seed():
    a = simulate_room(seed="room-1", members=_members(), days=7)
    b = simulate_room(seed="room-1", members=_members(), days=7)
    assert a.timeline == b.timeline
    assert a.ai_by_member == b.ai_by_member
    assert a.sample_messages == b.sample_messages


def test_different_seeds_produce_different_output():
    a = simulate_room(seed="room-1", members=_members(), days=7)
    b = simulate_room(seed="room-2", members=_members(), days=7)
    assert a.timeline != b.timeline


def test_timeline_has_correct_number_of_days():
    result = simulate_room(seed="x", members=_members(), days=14)
    assert len(result.timeline) == 14


def test_timeline_dates_are_consecutive_and_ascending():
    result = simulate_room(seed="x", members=_members(), days=7)
    dates = [bucket.date for bucket in result.timeline]
    assert dates == sorted(dates)
    assert len(set(dates)) == 7


def test_ai_by_member_only_includes_listed_members():
    result = simulate_room(seed="x", members=_members(), days=7)
    assert set(result.ai_by_member.keys()) == {"tenshi", "aria", "nova"}


def test_totals_match_timeline_sums():
    result = simulate_room(seed="x", members=_members(), days=7)
    assert result.total_human == sum(b.human_count for b in result.timeline)
    timeline_ai = sum(sum(b.ai_count_by_member.values()) for b in result.timeline)
    assert result.total_ai == timeline_ai
    assert sum(result.ai_by_member.values()) == result.total_ai


def test_sample_messages_are_nonempty_and_strings():
    result = simulate_room(seed="x", members=_members(), days=7)
    assert len(result.sample_messages) > 0
    assert all(isinstance(m, str) and m for m in result.sample_messages)


def test_zero_members_raises():
    import pytest

    with pytest.raises(ValueError):
        simulate_room(seed="x", members=[], days=7)


def test_negative_days_raises():
    import pytest

    with pytest.raises(ValueError):
        simulate_room(seed="x", members=_members(), days=0)
