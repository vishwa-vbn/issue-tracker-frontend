# Issue Tracker – Frontend Setup

A responsive React + TypeScript web app for the Issue Tracker System: registration, login, admin login, issues, assignment, status tracking, comments and a dashboard. It talks to the backend through a same-origin `/api/v1` path and deploys free on Vercel.

---

## 1. Prerequisites

| Tool | Version | Purpose |
| ---- | ------- | ------- |
| Node.js | 22 LTS or newer | Build tooling |
| npm | 10+ | Package manager |
| Backend running | local `http://localhost:4000` or deployed | API |
| Git + GitHub account | | Source and deployment |
| Vercel account | free | Hosting |

---

## 2. Frontend Technology Stack

| Layer | Technology | Purpose |
| ----- | ---------- | ------- |
| Framework | React 19 + Vite | UI and fast dev builds |
| Language | TypeScript (strict) | Type safety |
| Routing | React Router v7 | Public / authenticated / admin route trees |
| Styling | Tailwind CSS v4 | Utility-first responsive styling |
| Components | shadcn/ui | Accessible base components |
| Forms | React Hook Form + Zod | Form state and validation |
| Server state | TanStack Query v5 | Fetching, caching, mutations |
| Global state | Redux Toolkit | Auth session, UI flags |
| HTTP | Axios | Interceptors, silent token refresh |
| Icons / toasts | Lucide React / Sonner | |
| Font | Inter (self-hosted via Fontsource) | |
| Testing | Vitest, React Testing Library, MSW | |

---

## 3. Bootstrap the Project (one time)

```bash
npm create vite@latest issue-tracker-frontend -- --template react-ts
cd issue-tracker-frontend
echo "22" > .node-version

# Runtime
npm install axios @tanstack/react-query react-hook-form @hookform/resolvers zod \
  react-router-dom @reduxjs/toolkit react-redux lucide-react sonner date-fns \
  @fontsource-variable/inter clsx tailwind-merge

# Styling
npm install tailwindcss @tailwindcss/vite

# Dev / quality
npm install -D @types/node vitest jsdom @testing-library/react @testing-library/user-event \
  @testing-library/jest-dom msw prettier prettier-plugin-tailwindcss @tanstack/react-query-devtools
```

### 3.1 Path alias `@/` → `src/`

Add to **both** `tsconfig.json` and `tsconfig.app.json` (shadcn reads the first):

```json
{ "compilerOptions": { "baseUrl": ".", "paths": { "@/*": ["./src/*"] } } }
```

### 3.2 `vite.config.ts`

```ts
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react(), tailwindcss()],
    resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
    server: {
      port: 5173,
      proxy: {
        '/api': { target: env.DEV_API_PROXY_TARGET ?? 'http://localhost:4000', changeOrigin: true },
      },
    },
    test: { environment: 'jsdom', globals: true, setupFiles: './src/test/setup.ts' },
  };
});
```

The dev proxy makes local development behave exactly like production (same origin, cookies work, no CORS).

### 3.3 Tailwind + shadcn/ui

`src/index.css`:

```css
@import "tailwindcss";
@import "@fontsource-variable/inter";

@theme {
  --font-sans: "Inter Variable", ui-sans-serif, system-ui, sans-serif;

  /* status + priority tokens (used as bg-status-open, text-priority-high …) */
  --color-status-open: #2563eb;
  --color-status-progress: #d97706;
  --color-status-closed: #16a34a;
  --color-priority-low: #64748b;
  --color-priority-medium: #2563eb;
  --color-priority-high: #ea580c;
  --color-priority-critical: #dc2626;
}
```

Then:

```bash
npx shadcn@latest init            # choose neutral base; accept the @/ alias
npx shadcn@latest add button input textarea label select checkbox card badge dialog alert-dialog \
  dropdown-menu table tabs skeleton sonner avatar separator tooltip sheet popover command pagination alert
```

After `init`, set the shadcn `--primary` variable to Indigo (`#4F46E5`) and `--background` to `#F8FAFC` in `index.css`. This is the **only** global CSS file.

### 3.4 Scripts (`package.json`)

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "typecheck": "tsc -b --noEmit",
    "lint": "eslint .",
    "format": "prettier --write .",
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

In `eslint.config.js` add `'no-console': 'error'` and `@typescript-eslint/no-explicit-any: 'error'`.

---

## 4. Environment Configuration

`.env.example` (copy to `.env`, which is git-ignored):

```env
# Base path of the API. Keep it RELATIVE: the dev proxy (local) and the
# vercel.json rewrite (production) forward it to the backend.
VITE_API_BASE_URL=/api/v1

# Show the /component-viewer route (development only)
VITE_ENABLE_COMPONENT_VIEWER=true

# Dev only — read by vite.config.ts, never shipped to the browser
DEV_API_PROXY_TARGET=http://localhost:4000
```

| Variable | Where | Notes |
| -------- | ----- | ----- |
| `VITE_API_BASE_URL` | browser bundle | `/api/v1` everywhere. Only `VITE_*` values are exposed — never put secrets in them |
| `VITE_ENABLE_COMPONENT_VIEWER` | browser bundle | `false` in production |
| `DEV_API_PROXY_TARGET` | `vite.config.ts` only | Point at a deployed API to develop against it |

Type them in `src/vite-env.d.ts` (`interface ImportMetaEnv { readonly VITE_API_BASE_URL: string; … }`).

---

## 5. Build and Run

```bash
npm install
npm run dev            # http://localhost:5173  (backend must be running on :4000)
npm run typecheck && npm run lint && npm test
npm run build          # outputs dist/
npm run preview        # serve the production build locally
```

---

## 6. Reusable Components (build before pages)

Implement in `src/components/controls/` (Tier 2) and `src/components/common/` (Tier 3). Details of each pattern are in `SKILLS.md`.

**Controls:** `TextField` · `TextAreaField` · `SelectField` · `ComboboxField` · `ActionButton` · `StatusBadge` · `PriorityBadge` · `UserAvatar`

**Common:** `AppShell` (sidebar + top bar, mobile Sheet) · `PageHeader` (title, subtitle, back arrow, action button) · `ConfirmDialog` (default, danger, loading) · `EmptyState` · `ErrorState` · `SkeletonLoader` (table rows, cards, full page) · `Pagination` · `ServerWakingBanner` · `FullPageSplash`

### Component viewer

Create `/component-viewer` that renders every control and common component in all variants on one scrollable page. It is a development aid, registered only when `VITE_ENABLE_COMPONENT_VIEWER === 'true'`.

---

## 7. Production Setup (Vercel)

### 7.1 `vercel.json` (repo root)

```json
{
  "rewrites": [
    { "source": "/api/:path*", "destination": "https://<backend>.onrender.com/api/:path*" },
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=()" },
        { "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'" }
      ]
    }
  ]
}
```

- Order matters: the API rewrite comes first; static files are served before the SPA fallback.
- Replace `<backend>` with the real Render hostname. `vercel.json` cannot read environment variables, so this URL is committed.
- `'unsafe-inline'` for styles is needed by Radix/shadcn positioning styles; scripts stay locked to `'self'`.

### 7.2 Deploy

1. Push the repo to GitHub.
2. Vercel → **Add New → Project** → import `issue-tracker-frontend`.
3. Framework preset: **Vite** (build `npm run build`, output `dist`).
4. Environment variables: `VITE_API_BASE_URL=/api/v1`, `VITE_ENABLE_COMPONENT_VIEWER=false`.
5. Deploy. Every push to `main` redeploys; PRs get preview URLs.
6. Put the production URL in the README and in the backend's `CORS_ORIGINS`.

Vercel's Hobby plan is for non-commercial projects, which fits this assessment.

### 7.3 Updating

Merge to `main` → automatic redeploy. Roll back from the Vercel dashboard ("Promote" a previous deployment). If the backend URL changes, edit the rewrite in `vercel.json` and redeploy.

### 7.4 Cold-start behaviour

The free backend can take ~1 minute to wake after idling. The app shows `ServerWakingBanner` when a request exceeds 4 seconds, and Axios uses a 60-second timeout so the first request does not fail. A keep-alive monitor on the backend (see backend `SETUP.md` §6.3) normally prevents this.

---

## 8. Smoke Test Checklist (after every deploy)

- [ ] `/` redirects to `/login` when signed out; no console errors
- [ ] Register a new user → lands on the dashboard
- [ ] Refresh the page → still signed in (silent refresh works)
- [ ] Create an issue → appears in the list; dashboard counts update
- [ ] Assign, change status Open → In Progress → Closed, reopen
- [ ] Add, edit, delete a comment; timeline shows events
- [ ] Filters and search update the URL; sharing the URL reproduces the view
- [ ] A normal user sees no admin menu and `/admin/users` shows the 403 page
- [ ] `/admin/login` accepts the admin, rejects a normal user; Users page works
- [ ] Logout clears the session; back button does not reveal private pages
- [ ] Responsive check at 375 px, 768 px and 1280 px

---

## 9. CI (GitHub Actions)

`.github/workflows/ci.yml`:

```yaml
name: CI
on:
  pull_request:
  push: { branches: [main] }
jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: npm }
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm test
      - run: npm run build
        env: { VITE_API_BASE_URL: /api/v1, VITE_ENABLE_COMPONENT_VIEWER: "false" }
      - run: npm audit --omit=dev --audit-level=high
```

---

## 10. Agent Guide

Before writing any code, read in order:

1. **`SCOPE-AND-BRD.md`** — product scope, roles, permission matrix, phases.
2. **`ARCHITECTURE.md`** — folder structure, routes, state strategy, auth flow, UX principles.
3. **`SKILLS.md`** — component tiers and copy-ready patterns (forms, Query, Redux, Axios, guards).
4. **`AGENT.md`** — naming, rules, boundaries, commands.

The API contract is in the backend `ARCHITECTURE.md` / `README.md`. Follow all files for every feature and use them to write `README.md`.

### Suggested task prompts, by phase

| Phase | Prompt to give the agent |
| ----- | ------------------------ |
| P0 | "Scaffold per SETUP.md §3. Create the folder structure, providers, store (auth + ui slices), Axios instance with refresh interceptor, router with guards, AppShell, and all Tier 2/3 components plus `/component-viewer`. Add `vercel.json` and CI. Deploy a hello-world page." |
| P1 | "Build login, register and admin-login pages with Zod forms, `AuthBootstrap` silent refresh, logout, guards, and tests." |
| P2 | "Build the issue list (URL-driven search/filter/sort/pagination), create, detail and edit pages with all loading/error/empty states." |
| P3 | "Add the status control, assignee combobox, permission-aware actions and the activity timeline to the detail page." |
| P4 | "Add the comment list and form with edit/delete and confirmation dialogs." |
| P5 | "Build the dashboard (stat cards, priority bars, my work, recent) and the admin users page." |
| P6 | "Accessibility, responsive and error-state sweep; add missing tests; run lint/typecheck/build." |
| P7 | "Finalize README with screenshots and the live URL; run the smoke test on production." |

### First task: Hello page

Render a page at `/` titled **Issue Tracker** that calls `GET /api/v1/ping` through the Axios instance and shows the returned message (the backend returns `Welcome to Issue Tracker Backend`). This proves the proxy/rewrite works end to end; deploy it before building features.

---

## 11. Troubleshooting

| Symptom | Likely cause / fix |
| ------- | ------------------ |
| `/api/*` returns the HTML of the app in production | The API rewrite is missing or is after the SPA fallback in `vercel.json` |
| 404 on page refresh at `/issues/123` | SPA fallback rewrite missing |
| Login succeeds but session is lost on refresh | Cookie not set: calling the backend directly instead of through `/api`, or `withCredentials` missing |
| CORS errors in local dev | App is calling `http://localhost:4000` directly; use the relative `/api/v1` and the dev proxy |
| First request hangs ~1 min in production | Backend free instance was asleep; set up the keep-alive monitor |
| shadcn `init` cannot find the alias | `paths` missing in `tsconfig.json` (not only `tsconfig.app.json`) |
| Styles missing | `@import "tailwindcss"` absent from `index.css`, or `@tailwindcss/vite` plugin not added |
| Blank screen after deploy with CSP errors | A new external origin was added; update `Content-Security-Policy` in `vercel.json` |
