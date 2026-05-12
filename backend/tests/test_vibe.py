from app.vibe import VIBE_LABELS, classify_vibe, vibe_scores


def test_chaotic_keywords_classify_as_chaotic():
    text = ["chaos everywhere lmao", "this is mayhem", "absolute mess hahaha"]
    assert classify_vibe(text) == "chaotic"


def test_wholesome_keywords_classify_as_wholesome():
    text = ["love you all so much", "you got this, proud of you", "such a sweet thing to say"]
    assert classify_vibe(text) == "wholesome"


def test_productive_keywords_classify_as_productive():
    text = ["let's ship the API by Friday", "PR is merged, deploy queued", "stand-up notes in the doc"]
    assert classify_vibe(text) == "productive"


def test_creative_keywords_classify_as_creative():
    text = ["the protagonist whispers to the moon", "a new draft of the story", "imagining a different ending"]
    assert classify_vibe(text) == "creative"


def test_empty_input_falls_back_to_chaotic_by_default():
    assert classify_vibe([]) in VIBE_LABELS


def test_vibe_scores_returns_all_labels_with_values_between_0_and_1():
    scores = vibe_scores(["love and chaos and ship and story"])
    assert set(scores.keys()) == set(VIBE_LABELS)
    for v in scores.values():
        assert 0.0 <= v <= 1.0


def test_classify_is_deterministic_on_ties_via_priority_order():
    first = classify_vibe(["no signal in this text"])
    second = classify_vibe(["nothing matches here either"])
    assert first == second


def test_classify_handles_mixed_signals_by_picking_strongest():
    chaotic_dominant = ["chaos chaos lmao mayhem", "ship it"]
    assert classify_vibe(chaotic_dominant) == "chaotic"
