# Innsikt — Backend

Node.js/Hono API server that fetches, processes and serves Norwegian police log data from the public [Politiloggen API](https://api.politiet.no/politiloggen/v1).

## Stack

- **Node.js / Hono**
- **PostgreSQL** — raw SQL with `pg`, no ORM (Neon serverless)
- **node-cron** — syncs every 5 minutes in production
- **Geoapify** — geocoding municipality names to coordinates

## API Routes

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/dashboard` | KPIs, map incidents, category distribution |
| GET | `/analytics` | Heatmap, trends, top municipalities |
| GET | `/explore` | Search, comparison, per-capita normalization |
| GET | `/municipalities` | All municipalities with coordinates |
| GET | `/districts` | | All districts, KPIs, trends, category distribution |

## Sync Pipeline

Runs every 5 minutes in production. Fetches new incidents, geocodes new municipalities (only those without existing coordinates), inserts with `ON CONFLICT DO NOTHING`, then notifies SSE clients.

Politiloggen sends multiple log updates per incident sharing the same `thread_id`. All aggregation uses `COUNT(DISTINCT thread_id)`.
