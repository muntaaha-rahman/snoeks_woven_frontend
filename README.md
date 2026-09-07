# Snoeks Wonen - measurement app (frontend)

React + TypeScript PWA for recording on-site measurements (window treatments,
flooring, insect screens, sun shading) and syncing them with the
[backend API](../snoeks_woven_backend).

Installable on iPads used in the field. Measurements are queued in IndexedDB
and retried automatically when a save fails due to no/weak signal, so
surveyors can keep working offline and sync once back online.

## Setup

```bash
npm install
cp .env.example .env   # point VITE_API_BASE_URL at your backend
npm run dev
```

## Build

```bash
npm run build   # type-checks then builds to dist/, including the service worker
```

## Docker

VITE_API_BASE_URL is baked into the JS bundle at build time (it's a static
site once built), so pass it as a build arg:

```bash
docker build -t snoeks-woven-frontend --build-arg VITE_API_BASE_URL=http://localhost:8420 .
docker run -p 5420:80 snoeks-woven-frontend
```

Or run both services together via `docker-compose.yml` one level up (see the
repo root). Port 5420 (not 5173) is used there to avoid clashing with other
projects on the same machine.

## Structure

- `src/api/` - types and the fetch client for the backend
- `src/offline/` - IndexedDB save queue + online/offline hooks (the weak-signal handling)
- `src/components/` - the four measurement category forms, the live scaled SVG drawing, photo picker
- `src/pages/` - list/search, create/edit form, detail view
