# REVORA — Build. Tune. Drive.

A premium automotive platform for discovering cars, configuring them, tuning performance, and saving custom builds.

## Stack

Frontend: Next.js 16 · React 19 · TypeScript · MUI · GSAP · TanStack Query · Zustand

Backend: Express · MongoDB · Mongoose · JWT (httpOnly cookie)

## Prerequisites

- Node.js 20+
- MongoDB running locally (or a MongoDB Atlas URI)

## Run locally

From the `REVORA` folder:

```bash
npm install
npm run install:all
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

If MongoDB is not installed, the API starts an in-memory database and seeds demo cars automatically. Install MongoDB locally later if you want data to persist between restarts.

## Demo accounts

After seeding, sign in with:

- Admin: `admin@revora.com` / `admin123`
- User: `user@revora.com` / `admin123`

Change `SEED_PASSWORD` and `JWT_SECRET` in `backend/.env` before any real deployment.

## Core loop

Discover → Compare → Configure → Tune → Save to Garage
