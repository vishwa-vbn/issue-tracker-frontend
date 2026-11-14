# Issue Tracker System — Scope & BRD

> Shared by both repositories (`issue-tracker-backend`, `issue-tracker-frontend`). Copy this file into the root of each repo, next to the `README.md`. It doubles as the **BRD** the task requires, including the **Deployment** section (§12).

---

## 1. Overview

A web-based issue tracker where team members register, log in, raise issues, assign them to each other, track status (Open → In Progress → Closed), discuss on issues through comments, and see a dashboard of counts. An Admin role oversees every issue and every user.

Target scale: **~10 users**, all on free-tier services. Quality bar: production-style (typed, validated, secured, tested, documented, deployed).

---

## 2. Objectives

1. Deliver every feature in the task brief, working end to end on a public URL.
2. Show industry-level engineering: layered architecture, strict typing, RBAC, secure auth, validation, tests, CI.
3. Cost nothing to run for 10 users.
4. Documentation sufficient for another developer to run, understand and redeploy the project alone.

---

## 3. Roles

| Role  | How created | Capabilities (summary) |
| ----- | ----------- | ---------------------- |
| USER  | Self-registration | Create issues, work on issues they report or are assigned, comment |
| ADMIN | Seeded by script from env vars (never via public registration) | Everything a USER can do, on **all** issues, plus user management |

---

## 4. Scope

### 4.1 In scope (MoSCoW)

**Must have** (required by the task brief)

| ID | Requirement |
| -- | ----------- |
| F-01 | User registration (name, email, password) |
| F-02 | User login / logout / silent session restore |
| F-03 | Separate Admin login (`/admin/login`) that only accepts ADMIN accounts |
| F-04 | Create, view, edit, delete (soft) issues |
| F-05 | Assign / unassign an issue to a user |
| F-06 | Status tracking: `OPEN`, `IN_PROGRESS`, `CLOSED`, with reopen |
| F-07 | Comments on issues (add, edit own, delete own) |
| F-08 | Dashboard with counts (total, by status, mine) |
| F-09 | Role-based access control enforced on the server |
| F-10 | Deployed on free hosting; README + BRD with Deployment section |

**Should have** (cheap, expected of an issue tracker)

| ID | Requirement |
| -- | ----------- |
| F-11 | Issue priority (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`) |
| F-12 | List with search, filters (status, priority, assignee, reporter), sorting, pagination |
| F-13 | Activity timeline per issue (created, status changed, assigned, edited) |
| F-14 | Admin user management (list, change role, activate/deactivate) |
| F-15 | Seeded demo data so reviewers see a populated dashboard |
| F-16 | Automated tests on auth, permissions and issue flows; GitHub Actions CI |

**Could have** (only if time remains after Phase 7)

Swagger UI at `/api/docs`, optimistic status updates, dark mode, Playwright smoke test, issue labels.

### 4.2 Out of scope

Email / notifications, password reset by email, OAuth / social login, file attachments, real-time updates (WebSockets), due dates / sprints / boards, multi-tenancy, i18n, payment of any kind, Redis / caching layer, mobile apps. Each is a reasonable future extension and is listed here so reviewers see it was a conscious cut.

---

## 5. Permission matrix (server-enforced)

| Action | Anonymous | USER | ADMIN |
| ------ | :-------: | :--: | :---: |
| Register / log in | ✅ | — | — |
| Admin login | ✅ (ADMIN accounts only) | ❌ | ✅ |
| View issues, comments, dashboard | ❌ | ✅ (all issues) | ✅ |
| Create issue | ❌ | ✅ | ✅ |
| Edit title / description / priority | ❌ | Own (reporter) | Any |
| Delete (soft) issue | ❌ | Own (reporter) | Any |
| Change status | ❌ | Reporter or assignee | Any |
| Assign / unassign | ❌ | Reporter | Any |
| Add comment | ❌ | ✅ | ✅ |
| Edit / delete comment | ❌ | Own | Any (delete only) |
| List / manage users | ❌ | ❌ (can read the minimal assignable-users list) | ✅ |

Guard rails: an admin cannot demote or deactivate **themselves**, and the **last active admin** can never be demoted or deactivated. Deactivated users cannot log in and their refresh tokens are revoked.

---

## 6. Non-functional requirements

| Area | Requirement |
| ---- | ----------- |
| Security | OWASP-aligned: hashed passwords, short-lived JWT + rotating httpOnly refresh cookie, strict input validation, rate limiting, CORS allow-list, secure headers, no secrets in git |
| Reliability | Health endpoints, graceful shutdown, consistent error envelope, request IDs in every log line |
| Performance | List endpoints paginated (max 50/page); indexed filters; p95 < 500 ms warm |
| Usability | Responsive 375 px → 1280 px+; loading, empty and error states on every data view; WCAG AA contrast; keyboard accessible |
| Maintainability | TypeScript `strict` on both sides, ESLint + Prettier, small single-purpose files, documented conventions |
| Testability | Policy and service unit tests; API integration tests against a real Postgres |
| Cost | ₹0 / $0 for ≤ 10 users |

---

## 7. Architecture decision: separate repositories

| Option | Verdict |
| ------ | ------- |
| Next.js full-stack in one repo | Fast to ship, but hides the API behind route handlers and mixes concerns. Rejected because you asked for a clear separation and a standalone API is a stronger demonstration. |
| **Separate React SPA + Express API (chosen)** | Clear boundary, independently deployable, API reusable by any client. |

```
Browser ──► Vercel (React SPA, static)
               │  /api/*  (rewrite = same-origin proxy)
               ▼
            Render Web Service (Express API) ──► Neon PostgreSQL
```

The Vercel **rewrite** makes the browser see a single origin. That lets the refresh token live in a first-party `httpOnly; Secure; SameSite=Lax` cookie, avoiding the third-party-cookie problems of two different `*.vercel.app` / `*.onrender.com` sites, and CORS is only needed for local development.

### Technology summary

| Side | Stack |
| ---- | ----- |
| Frontend | React 19, TypeScript (strict), Vite, Tailwind CSS v4, shadcn/ui, Redux Toolkit (auth + UI), TanStack Query (server state), React Hook Form + Zod, React Router, Axios |
| Backend | Node.js 22 LTS, TypeScript (strict), Express 5, PostgreSQL, Drizzle ORM + drizzle-kit migrations, Zod, JWT, bcryptjs, helmet, express-rate-limit, pino |
| Data | Neon PostgreSQL (free) |
| Hosting | Vercel (frontend), Render (backend), Neon (DB) |
| Quality | Vitest, Supertest, React Testing Library, MSW, ESLint, Prettier, GitHub Actions |

---

## 8. Data model (summary)

| Table | Key columns |
| ----- | ----------- |
| `users` | `id` (uuid), `name`, `email` (unique, lowercase), `password_hash`, `role` (`USER`/`ADMIN`), `is_active`, `created_at`, `updated_at` |
| `issues` | `id` (uuid), `issue_number` (identity, shown as `#12`), `title`, `description`, `status`, `priority`, `reporter_id` → users, `assignee_id` → users (nullable), `closed_at`, `created_at`, `updated_at`, `deleted_at` |
| `comments` | `id`, `issue_id`, `author_id`, `body`, `created_at`, `updated_at`, `deleted_at` |
| `issue_activity` | `id`, `issue_id`, `actor_id`, `type`, `from_value`, `to_value`, `created_at` |
| `refresh_tokens` | `id`, `user_id`, `token_hash` (SHA-256), `expires_at`, `revoked_at`, `created_at` |

Soft delete (`deleted_at`) is used on `issues` and `comments`; users are deactivated, never deleted. Full column definitions are in the backend `ARCHITECTURE.md`.

---

## 9. API contract

Base path `/api/v1`. The full endpoint list, request/response shapes and error codes live in the backend `README.md` and `ARCHITECTURE.md`. The frontend consumes **only** that contract. Any contract change is made in the backend docs first, then implemented on both sides.

---

## 10. Delivery plan — vertical phases

Each phase ships a working slice (API **and** UI) and ends with a commit, a deploy and a smoke test. Estimates assume focused work with an AI coding agent following the `AGENT.md` / `SKILLS.md` files.

| Phase | Deliverable | Est. |
| ----- | ----------- | ---- |
| **P0** Foundations & early deploy | Both repos scaffolded; tooling, CI, env validation; DB connected; `GET /api/v1/ping`; **both apps deployed with a hello-world** (de-risks hosting first) | 60 m |
| **P1** Auth & RBAC | Register, login, admin login, refresh, logout, `me`; admin seed; route guards; login/register/admin-login screens | 75 m |
| **P2** Issues CRUD | List (search, filter, sort, paginate), create, view, edit, soft-delete; list/detail/form screens | 90 m |
| **P3** Status & assignment | Status changes, assign/unassign, activity timeline; UI controls respecting permissions | 45 m |
| **P4** Comments | Add / edit / delete comments; thread UI | 40 m |
| **P5** Dashboard & admin | Counts endpoint + dashboard; admin user management | 45 m |
| **P6** Hardening & tests | Rate limits, validation sweep, a11y/responsive pass, unit + integration tests, error/empty/loading states | 60 m |
| **P7** Docs & final deploy | READMEs, demo data, production smoke test, submission email | 40 m |

**Cut line if time runs short:** finish P0–P5 first (that satisfies every "Must have"). In P6, keep the auth/permission tests and drop Could-haves. Never skip P7; an undocumented or undeployed project fails the brief.

---

## 11. Risks & mitigations

| Risk | Mitigation |
| ---- | ---------- |
| Render free service sleeps after 15 min idle; first request takes about 1 minute | Free uptime pinger (UptimeRobot / cron-job.org) hits `/api/v1/health` every 5 min; frontend shows a "waking the server…" banner when a request is slow; README tells reviewers about it |
| Render free tier: 750 instance-hours/month | One service ≈ 720 h, so it fits |
| Render free Postgres expires after 30 days | Not used; Neon is used instead |
| Neon compute suspends after 5 min idle (first query is slower) | Acceptable; pooled connection string; small pool; retry-safe queries |
| Neon free storage 1 GB / 100 CU-hours per month | Orders of magnitude above what 10 users need |
| Render blocks outbound SMTP ports (25/465/587) on free | Email is out of scope |
| Rate limiting sees the wrong client IP behind two proxies | `TRUST_PROXY_HOPS=2` in production; verify after deploy by checking logged `req.ip` |
| Last-minute deploy failures | P0 deploys a hello-world on day one; each phase redeploys |
| Free-tier terms change | Checked November 2026; re-check before the deadline |

---

## 12. Deployment

### 12.1 Where it is hosted

| Component | Platform | Plan | URL (fill in after deploy) |
| --------- | -------- | ---- | -------------------------- |
| Frontend (static SPA) | Vercel | Hobby (free) | `https://issue-tracker-frontend-psi.vercel.app` |
| Backend (Express API) | Vercel | Free | `https://issue-tracker-backend-three.vercel.app` |
| Database | Neon PostgreSQL | Free | private connection string |

Vercel's Hobby plan is for non-commercial use, which fits an evaluation project.

### 12.2 Deployment approach

- **Git-driven CD.** Each repo is connected to its host; a push to `main` builds and deploys automatically. Pull requests run CI (lint, typecheck, test, build) first.
- **Migrations run in the backend build step** (`db:migrate:prod`), so schema and code ship together. Migrations are idempotent and forward-only.
- **Admin seeded once** by `db:seed:prod`, which creates the admin only if it does not exist, using `ADMIN_*` env vars.
- **Same-origin API access.** `vercel.json` in the frontend rewrites `/api/*` to the live backend URL (`https://issue-tracker-backend-three.vercel.app`), and everything else to `index.html` (SPA fallback).

### 12.3 Required services

1. GitHub account (two public repos)
2. Neon project (database + connection strings)
3. Render account (web service)
4. Vercel account (static hosting)
5. UptimeRobot or cron-job.org (keep-alive ping)

### 12.4 Steps to deploy

1. **Database.** Create a Neon project in a region close to your Render region. Copy the **pooled** connection string as `DATABASE_URL`.
2. **Backend on Render.** New → Web Service → connect `issue-tracker-backend`.
   - Runtime: Node. Build command: `npm ci --include=dev && npm run build && npm run db:migrate:prod && npm run db:seed:prod`
   - Start command: `npm run start`
   - Health check path: `/api/v1/health`
   - Set the env vars listed in the backend `SETUP.md` (`DATABASE_URL`, `JWT_ACCESS_SECRET`, `ADMIN_*`, `CORS_ORIGINS`, `TRUST_PROXY_HOPS=2`, `NODE_ENV=production`).
3. **Frontend on Vercel.** Import `issue-tracker-frontend`; framework preset Vite. Set `VITE_API_BASE_URL=/api/v1`. Edit `vercel.json` so the `/api/*` rewrite destination is the Render URL, then commit.
4. **CORS / origin.** Set backend `CORS_ORIGINS` to the Vercel URL (only used for direct calls; the proxy path does not need CORS).
5. **Keep-alive.** Create an uptime monitor for `https://<backend>.onrender.com/api/v1/health` every 5 minutes.
6. **Smoke test** (checklist in the backend `SETUP.md`): ping, register, login, create issue, assign, change status, comment, dashboard, admin login.

### 12.5 Steps to update

1. Branch → change → PR; CI must be green.
2. Merge to `main`. Render and Vercel redeploy automatically; migrations run during the Render build.
3. For a schema change, generate a migration (`npm run db:generate`), commit the SQL, and merge. Never edit an applied migration.
4. Roll back: use the host's "redeploy previous build"; for a bad migration write a new corrective migration.

---

## 13. Acceptance criteria (Definition of Done)

- [ ] A new visitor can register, log in, and land on the dashboard
- [ ] Admin can log in at `/admin/login`; a normal user is rejected there
- [ ] Issues: create, edit, soft-delete, search, filter, paginate
- [ ] Assign / unassign; status changes through Open → In Progress → Closed and back
- [ ] Comments can be added, edited and deleted by their author
- [ ] Dashboard counts match the data
- [ ] A USER cannot edit another user's issue or reach admin endpoints (verified by tests)
- [ ] CI green on both repos; `npm audit` shows no high/critical issues
- [ ] Both apps live on the public URLs; demo credentials in README
- [ ] READMEs complete; this BRD's Deployment section is accurate
- [ ] Submission email sent to careers@exeloncircuits.com **by 7 pm, 14 Nov 2026** with: frontend URL, backend URL, both GitHub links

---

## 14. Glossary

**RBAC** role-based access control · **IDOR** insecure direct object reference · **CD** continuous deployment · **SPA** single-page application
