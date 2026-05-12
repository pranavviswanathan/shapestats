# ShapeStats

> Conversation analytics for AI + human group chats, built around real characters from [shapes.inc](https://shapes.inc).

![status](https://img.shields.io/badge/status-portfolio-7c5cff)
![next](https://img.shields.io/badge/next-14.2-black)
![fastapi](https://img.shields.io/badge/fastapi-0.115-009688)
![python](https://img.shields.io/badge/python-3.12-3776ab)
![license](https://img.shields.io/badge/license-MIT-lightgray)

A dark, polished dashboard that visualizes what makes group rooms engaging:
who is talking, how human-vs-AI the room feels, the volume rhythm across a week,
and the vibe each room settles into.

<img width="1973" height="1158" alt="image" src="https://github.com/user-attachments/assets/c78397d5-cd19-4a24-aaac-8c542a38d422" />

<img width="2008" height="1166" alt="image" src="https://github.com/user-attachments/assets/d4d88b9b-1038-4bfe-a006-a7858770e028" />


## What's real, what's not

The shapes.inc developer API exposes only one anonymous endpoint —
`GET /shapes/public/{username}` — which returns a single character's
profile. It does not expose rooms, message history, or analytics. Rather than
fabricate that data and dress it up as real, ShapeStats is honest about the
split:

| Surface | Source |
| --- | --- |
| Shape profiles (name, avatar, tagline, tags, message/user counts) | **Real**, cached snapshots of the public API |
| Rooms and members | Authored fixtures built around real shapes |
| Message volume timelines, human/AI split | **Simulated**, deterministic seeded fixtures |
| Engagement score, vibe classifier, top-character ranking | Computed from the above |

A persistent "Demo data" badge sits in the header so users always know what
they're looking at.

## Features

- **Room browser** — five themed rooms (Chaos Lounge, Wholesome Corner, Study
  Group, Creative Circle, Late Night Vibes) with real shape members.
- **Engagement score** — combines message frequency, human/AI balance, and
  per-member participation. Pure function, fully unit-tested.
- **Talk time chart** — stacked area chart of human vs AI volume over the
  last 7 days, per room.
- **Vibe classifier** — keyword-heuristic tagging into chaotic / wholesome /
  productive / creative, with a breakdown bar on the detail page.
- **Top characters** — which AI shapes drive the most messages, in each room
  and overall.

## Stack

- **Frontend** — Next.js 14 (App Router), TypeScript strict, Tailwind, Recharts
- **Backend** — FastAPI, Pydantic, pytest
- **Testing** — Vitest for frontend pure logic, pytest for backend modules
  and API endpoints. The core scoring, classification, and simulation modules
  are all test-driven.
- **No auth** — the upstream public endpoint requires none.

## Repo layout

```
ShapeStats/
├── backend/
│   ├── app/
│   │   ├── engagement.py        pure engagement scoring
│   │   ├── vibe.py              pure keyword vibe classifier
│   │   ├── simulator.py         deterministic seeded simulator
│   │   ├── shape_loader.py      loads cached real shape profiles
│   │   ├── rooms.py             composes profiles + simulator + scoring
│   │   └── main.py              FastAPI app + endpoints
│   ├── data/seed_shapes/        real cached profiles (7 shapes)
│   ├── tests/                   pytest suite (29 tests)
│   └── requirements.txt
├── frontend/
│   ├── app/                     Next.js App Router pages
│   ├── components/              UI components (typed, dark theme)
│   ├── lib/                     api client, types, formatters
│   ├── __tests__/               Vitest pure-logic tests
│   └── package.json
└── README.md
```

## Getting started

### Backend

```bash
cd backend
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
.venv/bin/pytest                            # 29 tests, all green
.venv/bin/uvicorn app.main:app --reload     # serves on http://localhost:8000
```

Endpoints:

- `GET /api/health` — liveness
- `GET /api/rooms` — list rooms with summary metrics
- `GET /api/room/{id}/stats` — full per-room stats (timeline, members, vibe scores)
- `GET /api/top-characters` — overall ranking

### Frontend

```bash
cd frontend
cp .env.local.example .env.local            # NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
npm install
npm run test                                # Vitest pure-logic suite
npm run typecheck                           # TypeScript strict
npm run dev                                 # http://localhost:3000
```

## Refreshing the real shape data

The cached profiles in `backend/data/seed_shapes/` were fetched directly from
`https://api.shapes.inc/shapes/public/{username}`. To refresh them:

```bash
for name in tenshi aria nova sage echo orion zara; do
  curl -s "https://api.shapes.inc/shapes/public/$name" \
    -o backend/data/seed_shapes/$name.json
done
```

## Deployment

The shape of the project lines up cleanly with Vercel (frontend) +
Railway/Fly/Render (backend). Both are standard deploy targets:

- **Frontend** — `vercel --prod` from `frontend/`. Set
  `NEXT_PUBLIC_API_BASE_URL` to your backend URL.
- **Backend** — any Python host that can run
  `uvicorn app.main:app --host 0.0.0.0 --port $PORT`. Set
  `SHAPESTATS_CORS_ORIGINS` to your frontend URL.


## Design notes

- Dark theme by default. Subtle radial gradients in the background, monospace
  for numerals, generous spacing.
- Mobile responsive: the room grid collapses 3 → 2 → 1 columns, the detail
  page reflows charts beneath the talk-time chart on small screens.
- "Demo data" is surfaced in the header at all times, so the simulation is
  never hidden from the viewer.

## License

MIT.
