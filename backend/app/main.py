from __future__ import annotations

import os

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.rooms import build_room_list, build_room_stats, build_top_characters_overall

app = FastAPI(title="ShapeStats API", version="0.1.0")

allowed_origins_env = os.environ.get("SHAPESTATS_CORS_ORIGINS", "http://localhost:3000")
allowed_origins = [o.strip() for o in allowed_origins_env.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=False,
    allow_methods=["GET"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health() -> dict:
    return {"status": "ok"}


@app.get("/api/rooms")
def list_rooms() -> dict:
    rooms = build_room_list()
    return {
        "rooms": rooms,
        "data_disclosure": {
            "shape_profiles": "real (cached from shapes.inc /shapes/public/{username})",
            "conversations": "simulated, deterministic seeded fixtures",
        },
    }


@app.get("/api/room/{room_id}/stats")
def room_stats(room_id: str) -> dict:
    stats = build_room_stats(room_id)
    if stats is None:
        raise HTTPException(status_code=404, detail=f"room '{room_id}' not found")
    return stats


@app.get("/api/top-characters")
def top_characters() -> dict:
    return {"characters": build_top_characters_overall()}
