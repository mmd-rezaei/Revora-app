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

The seed catalog includes **Iranian brands** (Iran Khodro, Saipa) plus global manufacturers. To refresh the catalog after updates:

```bash
npm run seed:force
```

## Demo accounts

After seeding, sign in with:

- Admin: `admin@revora.com` / `admin123`
- User: `user@revora.com` / `admin123`

Change `SEED_PASSWORD` and `JWT_SECRET` in `backend/.env` before any real deployment.

## Core loop

Discover → Compare → Configure → Tune → Save to Garage

## Deploy (Netlify + Render)

REVORA is split: **frontend on Netlify**, **API on Render/Railway**, **MongoDB on Atlas**.

### 1) MongoDB Atlas

Create a free cluster and copy the connection string.

### 2) Backend on Render

1. Push the repo to GitHub.
2. Render → New Web Service → use `render.yaml` or set:
   - Root directory: `backend`
   - Build: `npm install`
   - Start: `npm start`
3. Environment variables:
   - `MONGODB_URI` = Atlas URI
   - `JWT_SECRET` = long random string (32+ chars)
   - `FRONTEND_ORIGIN` = `https://YOUR-SITE.netlify.app`
   - `NODE_ENV` = `production`

Copy the Render URL, e.g. `https://revora-api.onrender.com`.

### 3) Frontend on Netlify

1. Netlify → Add new site → Import from Git.
2. If the repo root is the parent folder, set **Base directory** to `REVORA`.
3. Netlify reads `netlify.toml` automatically (`base = frontend`).
4. **Do not** set Publish directory manually in the UI — leave it empty.
5. Site settings → Environment variables:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_API_URL` | `/api` |
| `API_PROXY_TARGET` | `https://revora-api.onrender.com` |
| `NODE_VERSION` | `20` |

6. Deploy.

### Common Netlify errors

| Error | Fix |
|-------|-----|
| Publish directory is empty / wrong | Remove `publish = .next` from UI; use `@netlify/plugin-nextjs` |
| Base directory has no package.json | Set base to `REVORA/frontend` or repo root to `REVORA` |
| Site loads but no cars / API fails | Deploy backend + set `API_PROXY_TARGET` |
| Auth/login fails | Set `FRONTEND_ORIGIN` on backend to your Netlify URL |
