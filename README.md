# Issue Tracker – Frontend

Responsive web application for the Issue Tracker System. Team members register and log in, raise issues, assign them, track status (Open → In Progress → Closed), discuss in comments and see a dashboard of counts. Admins can also manage users.

| | |
| --- | --- |
| **Live app** | `https://issue-tracker-frontend-psi.vercel.app` |
| **Live API** | `https://issue-tracker-backend-three.vercel.app/api/v1` |
| **Backend repo** | `https://github.com/vishwa-vbn/issue-tracker-backend` |
| **Frontend repo** | `https://github.com/vishwa-vbn/issue-tracker-frontend` |

> **Heads-up for reviewers:** the API runs on a free instance that sleeps when idle. If the first request takes up to a minute, the server is waking up; the app shows a banner while it waits.

### Demo credentials

| Role | Where to sign in | Email | Password |
| ---- | ---------------- | ----- | -------- |
| Admin | `/admin/login` | `admin@example.com` | `ChangeMe123` |
| User | `/login` | `demo.user@example.com` | `Passw0rdOK` |

*(Demo data only.)*

---

## Table of contents

1. [Features](#features) · 2. [Screens](#screens) · 3. [Architecture](#architecture) · 4. [Tech stack](#tech-stack) · 5. [Getting started](#getting-started) · 6. [Environment variables](#environment-variables) · 7. [Scripts](#scripts) · 8. [API usage](#api-usage) · 9. [Security](#security) · 10. [Testing](#testing) · 11. [Deployment](#deployment) · 12. [Project documents](#project-documents)

---

## Features

- **Authentication** — register, login, logout, silent session restore on reload
- **Admin login** — dedicated `/admin/login` that accepts administrators only
- **Issues** — create, edit, delete; search, filter by status / priority / assignee, sort, paginate; filters are kept in the URL so views are shareable
- **Assignment** — searchable assignee picker with "Unassigned"
- **Status tracking** — Open, In Progress, Closed (reopen allowed) with a visible activity timeline
- **Comments** — add, edit your own, delete with confirmation
- **Dashboard** — total and per-status counts, priority breakdown, "my work", recent issues; extra widgets for admins
- **Admin** — user list with role change and activate/deactivate
- **UX** — responsive from 375 px to desktop, loading skeletons, empty and error states, toasts, accessible forms and dialogs

---

## Screens

| Screen | Route | Access |
| ------ | ----- | ------ |
| Login | `/login` | Guests |
| Register | `/register` | Guests |
| Admin login | `/admin/login` | Guests |
| Dashboard | `/dashboard` | Signed-in |
| Issue list | `/issues` | Signed-in |
| New issue | `/issues/new` | Signed-in |
| Issue detail | `/issues/:issueId` | Signed-in |
| Edit issue | `/issues/:issueId/edit` | Reporter or admin |
| Users | `/admin/users` | Admin |
| 404 / 403 | `*` | Everyone |

*(Add screenshots to `docs/screenshots/` and link them here after Phase 6.)*

---

## Architecture

```
Browser ──► Vercel (static SPA)
              │  /api/*  rewritten to the backend (same-origin for the browser)
              ▼
         Express API (Render) ──► PostgreSQL (Neon)
```

- **Server state** → TanStack Query (cache, pagination, mutations, invalidation)
- **Global client state** → Redux Toolkit (auth session, UI flags only)
- **URL state** → search params for list filters
- **Auth** → 15-minute access token kept in memory; refresh token is an `httpOnly` cookie handled by the browser. On load the app silently calls `/auth/refresh`; an Axios interceptor refreshes once on token expiry and retries the request
- **Components** → three tiers: `ui` (shadcn) → `controls` (validated wrappers) → `common` (composed pieces), plus `features/<domain>` for domain code

```
src/
├── components/   ui · controls · common
├── features/     auth · issues · comments · dashboard · users   (api, hooks, components, schemas, types)
├── pages/        route-level screens (lazy-loaded)
├── routes/       router + guards (RequireAuth, RequireAdmin, GuestOnly)
├── store/        auth-slice, ui-slice
├── services/     axios instance, ApiError
├── providers/    app providers, auth bootstrap
├── constants/ helpers/ utils/
└── main.tsx
```

Details: [`ARCHITECTURE.md`](./ARCHITECTURE.md).

---

## Tech stack

| Layer | Technology |
| ----- | ---------- |
| UI | React 19, TypeScript (strict), Vite |
| Routing | React Router v7 |
| Styling | Tailwind CSS v4, shadcn/ui, Lucide icons, Inter font |
| Forms | React Hook Form + Zod |
| Data | TanStack Query v5, Axios |
| State | Redux Toolkit |
| Testing | Vitest, React Testing Library, MSW |
| Quality | ESLint, Prettier, GitHub Actions |
| Hosting | Vercel |

---

## Getting started

**Prerequisites:** Node.js ≥ 22, npm, and the [backend](https://github.com/<you>/issue-tracker-backend) running on `http://localhost:4000` (or point `DEV_API_PROXY_TARGET` at the deployed API).

```bash
git clone https://github.com/<you>/issue-tracker-frontend.git
cd issue-tracker-frontend
npm install
cp .env.example .env
npm run dev          # http://localhost:5173
```

Sign in with the demo credentials above (seeded by the backend's `npm run db:seed`).

Full setup, shadcn configuration and troubleshooting: [`SETUP.md`](./SETUP.md).

---

## Environment variables

| Variable | Required | Example | Description |
| -------- | :------: | ------- | ----------- |
| `VITE_API_BASE_URL` | ✅ | `/api/v1` | Relative API base path. Dev proxy and the Vercel rewrite forward it to the backend |
| `VITE_ENABLE_COMPONENT_VIEWER` | | `false` | Enables `/component-viewer` (dev aid) |
| `DEV_API_PROXY_TARGET` | dev | `http://localhost:4000` | Backend the Vite dev server proxies `/api` to. Read by `vite.config.ts`, not exposed to the browser |

Only `VITE_*` variables reach the browser; never place secrets in them.

---

## Scripts

| Script | Purpose |
| ------ | ------- |
| `npm run dev` | Dev server with HMR |
| `npm run build` | Type-check and build to `dist/` |
| `npm run preview` | Serve the production build |
| `npm run typecheck` · `lint` · `format` | Static checks |
| `npm test` | Unit and component tests |

---

## API usage

The app consumes the REST API documented in the backend README (`/api/v1`, envelope `{ success, data, meta?, error? }`).

| Feature | Endpoints used |
| ------- | -------------- |
| Auth | `POST /auth/register`, `/auth/login`, `/auth/admin/login`, `/auth/refresh`, `/auth/logout`, `GET /auth/me` |
| Issues | `GET/POST /issues`, `GET/PATCH/DELETE /issues/:id`, `PATCH /issues/:id/status`, `PATCH /issues/:id/assignee`, `GET /issues/:id/activity` |
| Comments | `GET/POST /issues/:id/comments`, `PATCH/DELETE /comments/:id` |
| Users | `GET /users/assignable`, `GET /users`, `PATCH /users/:id` |
| Dashboard | `GET /dashboard/summary` |

Errors are normalised to `ApiError { status, code, message, details }`. The UI maps `code` to friendly messages and shows field errors from `VALIDATION_ERROR`.

---

## Security

- Access token held in memory only; never written to `localStorage` or `sessionStorage`
- Refresh token is `httpOnly` and unreachable from JavaScript
- All user text rendered as text (no `dangerouslySetInnerHTML`)
- Security headers and a strict Content-Security-Policy set in `vercel.json`
- Zod validation on every form (the server validates again)
- UI hides unauthorised actions, but the server enforces permissions
- Dependencies audited in CI

---

## Testing

```bash
npm test
```

Vitest + React Testing Library with MSW mocking the API: login/register validation and error states, route guards, issue form validation, permission helpers, list loading/empty/error states. CI runs lint, typecheck, tests, build and `npm audit`.

---

## Deployment

| | |
| --- | --- |
| Host | Vercel (Hobby, free) |
| Build | `npm run build` → `dist/` (Vite preset) |
| Env | `VITE_API_BASE_URL=/api/v1` |
| Routing | `vercel.json` rewrites `/api/*` to the live backend API and everything else to `index.html` |

**Deploy:** push to GitHub → import the repo in Vercel → set env vars → deploy. **Update:** merge to `main` (auto-deploy; PRs get preview URLs). **Rollback:** promote a previous deployment in the Vercel dashboard.

If the backend URL changes, update the rewrite destination in `vercel.json`. Full steps and the post-deploy smoke test: [`SETUP.md`](./SETUP.md) §7–8 and the BRD's Deployment section in [`SCOPE-AND-BRD.md`](./SCOPE-AND-BRD.md) §12.

---

## Project documents

| File | Purpose |
| ---- | ------- |
| [`SCOPE-AND-BRD.md`](./SCOPE-AND-BRD.md) | Scope, requirements, phases, risks, **Deployment** |
| [`ARCHITECTURE.md`](./ARCHITECTURE.md) | Structure, routes, state, auth flow, UX principles |
| [`SETUP.md`](./SETUP.md) | Project bootstrap, env, Vercel deploy, CI, troubleshooting |
| [`SKILLS.md`](./SKILLS.md) | Component tiers and code patterns |
| [`AGENT.md`](./AGENT.md) | Conventions and rules for contributors and AI agents |

---

## License

MIT (or as required by the assessment).
