from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_rooms_endpoint_returns_list_with_metadata():
    response = client.get("/api/rooms")
    assert response.status_code == 200
    body = response.json()
    assert "rooms" in body
    assert "data_disclosure" in body
    assert len(body["rooms"]) >= 3
    sample = body["rooms"][0]
    for key in ("id", "name", "engagement_score", "vibe", "member_count", "avatar_url"):
        assert key in sample


def test_room_stats_endpoint_returns_timeline_and_top_characters():
    response = client.get("/api/room/chaos-lounge/stats")
    assert response.status_code == 200
    body = response.json()
    assert body["id"] == "chaos-lounge"
    assert isinstance(body["timeline"], list)
    assert len(body["timeline"]) == 7
    assert len(body["top_characters"]) >= 1
    for char in body["top_characters"]:
        assert "username" in char
        assert "ai_messages" in char


def test_room_stats_returns_404_for_unknown_room():
    response = client.get("/api/room/does-not-exist/stats")
    assert response.status_code == 404


def test_top_characters_overall_aggregates_across_rooms():
    response = client.get("/api/top-characters")
    assert response.status_code == 200
    chars = response.json()["characters"]
    assert len(chars) >= 5
    counts = [c["ai_messages"] for c in chars]
    assert counts == sorted(counts, reverse=True)
