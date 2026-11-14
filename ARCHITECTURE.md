# Issue Tracker – Frontend Architecture

Issue Tracker is a responsive single-page application built with React and TypeScript. Team members register, log in, raise and track issues, assign them, comment, and watch a dashboard; admins additionally manage users.

**Note:** This repository contains the frontend only. It is a pure client of the REST API described in the backend `ARCHITECTURE.md`. Do not add server logic here.

All HTTP goes through one Axios instance. In every environment the app calls the **relative** base URL `/api/v1`:

- **Development:** the Vite dev server proxies `/api` → `http://localhost:4000`.
- **Production:** `vercel.json` rewrites `/api/*` → the Render backend.

Because the browser only ever talks to its own origin, the refresh-token cookie set by the API is first-party and no CORS is involved.

---

## Frontend Technology Stack

| Layer | Technology | Purpose |
| ----- | ---------- | ------- |
| Framework | React 19 + Vite | UI rendering, fast builds |
| Language | TypeScript 5 (`strict`) | Type safety end to end |
| Routing | React Router v7 (library mode) | Public, authenticated and admin route trees, guards |
| Styling | Tailwind CSS v4 | Utility-first responsive styling, design tokens in CSS |
| Components | shadcn/ui (Radix primitives) | Accessible base components |
| Forms | React Hook Form + Zod | Form state and schema validation |
| Server state | TanStack Query v5 | Fetching, caching, pagination, mutations |
| Global client state | Redux Toolkit | Auth session (user + in-memory access token), UI flags |
| HTTP | Axios | Interceptors: attach token, refresh on 401 |
| Icons | Lucide React | Icon set used by shadcn/ui |
| Toasts | Sonner | Feedback for mutations and errors |
| Dates | date-fns | Formatting and relative time |
| Font | Inter (`@fontsource-variable/inter`) | Self-hosted, no external font request |
| Testing | Vitest, React Testing Library, MSW | Component and flow tests with a mocked API |
| Tooling | ESLint, Prettier, GitHub Actions | Quality gates |

---

## Folder Structure

```
src/
├── assets/                        # images, svg
├── components/
│   ├── ui/                        # Tier 1 – shadcn generated. DO NOT EDIT BY HAND
│   ├── controls/                  # Tier 2 – wrappers: TextField, TextAreaField, SelectField,
│   │                              #          ComboboxField, ActionButton, StatusBadge, PriorityBadge …
│   └── common/                    # Tier 3 – composed pieces: AppShell, Sidebar, Navbar, PageHeader,
│                                  #          ConfirmDialog, EmptyState, ErrorState, SkeletonLoader,
│                                  #          Pagination, ServerWakingBanner, UserAvatar
├── features/                      # domain code, one folder per feature
│   ├── auth/
│   │   ├── api.ts                 # raw API calls (login, register, refresh…)
│   │   ├── hooks/                 # use-login.ts, use-register.ts, use-logout.ts …
│   │   ├── schemas.ts             # loginSchema, registerSchema (Zod)
│   │   └── types.ts
│   ├── issues/
│   │   ├── api.ts
│   │   ├── hooks/                 # use-issues.ts, use-issue.ts, use-create-issue.ts,
│   │   │                          # use-update-issue.ts, use-change-status.ts, use-assign-issue.ts …
│   │   ├── components/            # IssueTable, IssueFilters, IssueForm, StatusSelect, AssigneeCombobox,
│   │   │                          # ActivityTimeline
│   │   ├── keys.ts                # query key factory
│   │   ├── permissions.ts         # canEdit / canChangeStatus / canAssign (UI mirror of server policy)
│   │   ├── schemas.ts
│   │   └── types.ts
│   ├── comments/                  # api.ts, hooks/, components/ (CommentList, CommentForm), schemas.ts
│   ├── dashboard/                 # api.ts, hooks/use-dashboard.ts, components/ (StatCard, StatusChart…)
│   └── users/                     # api.ts, hooks/ (use-users, use-assignable-users, use-update-user), components/
├── pages/                         # route-level components (lazy-loaded)
│   ├── auth/                      # login-page.tsx, register-page.tsx, admin-login-page.tsx
│   ├── dashboard/                 # dashboard-page.tsx
│   ├── issues/                    # issue-list-page.tsx, issue-new-page.tsx,
│   │                              # issue-detail-page.tsx, issue-edit-page.tsx
│   ├── admin/                     # admin-users-page.tsx
│   └── system/                    # not-found-page.tsx, forbidden-page.tsx, component-viewer-page.tsx
├── constants/                     # roles, issue status/priority labels, route paths, query defaults
├── helpers/                       # pure domain helpers (status label/colour maps, error-code → message)
├── utils/                         # generic: format-date, debounce, cn (class merge), truncate
├── store/
│   ├── index.ts                   # configureStore, typed hooks (useAppDispatch / useAppSelector)
│   ├── auth-slice.ts              # user, accessToken (memory only), status: 'unknown'|'authed'|'guest'
│   └── ui-slice.ts                # sidebarOpen, serverWaking
├── routes/
│   ├── app-router.tsx             # route tree
│   ├── require-auth.tsx           # guard: any signed-in user
│   ├── require-admin.tsx          # guard: ADMIN only
│   └── guest-only.tsx             # redirects signed-in users away from /login etc.
├── services/
│   ├── api.ts                     # Axios instance + interceptors
│   └── api-error.ts               # normalises API errors → ApiError { code, message, details, status }
├── providers/
│   ├── app-providers.tsx          # Redux, QueryClient, Router, Toaster
│   └── auth-bootstrap.tsx         # silent refresh on app load
├── App.tsx
├── main.tsx
├── index.css                      # Tailwind import + @theme tokens (the only global CSS)
└── vite-env.d.ts                  # typed import.meta.env
```

Other root files: `vercel.json`, `components.json` (shadcn), `vite.config.ts`, `.env.example`, `.github/workflows/ci.yml`.

---

## Module Overview

### Public (guests only)

| Screen | Route | Description |
| ------ | ----- | ----------- |
| Login | `/login` | Email + password |
| Register | `/register` | Name, email, password |
| Admin login | `/admin/login` | Admin-only entry, calls `/auth/admin/login` |

### Authenticated (USER and ADMIN)

| Screen | Route | Description |
| ------ | ----- | ----------- |
| Dashboard | `/dashboard` | Count cards, status/priority breakdown, my work, recent issues. Extra admin widgets |
| Issue list | `/issues` | Search, filters, sort, pagination, "My issues" quick filter. Filters live in the URL |
| New issue | `/issues/new` | Create form |
| Issue detail | `/issues/:issueId` | Details, status control, assignee, comments, activity timeline |
| Edit issue | `/issues/:issueId/edit` | Edit form (reporter/admin) |

`/` redirects to `/dashboard`.

### Admin only

| Screen | Route | Description |
| ------ | ----- | ----------- |
| Users | `/admin/users` | Search, change role, activate/deactivate |

### System

| Screen | Route | Description |
| ------ | ----- | ----------- |
| 403 / 404 | `*` | Friendly pages with a way back |
| Component viewer | `/component-viewer` | Dev-only gallery of controls; enabled by `VITE_ENABLE_COMPONENT_VIEWER=true` |

---

## State Management Strategy

| State type | Tool | Examples |
| ---------- | ---- | -------- |
| Server state | TanStack Query | Issues, comments, users, dashboard, activity |
| Global client state | Redux Toolkit | Auth user + access token, sidebar, "server waking" flag |
| URL state | React Router search params | Issue list filters, page, sort, search text |
| Local UI state | `useState` | Dialog open, selected tab, form drafts |

**Rule of thumb:** if it came from the API → TanStack Query. If many distant components need it and it is not from the API → Redux. If it should survive a refresh or be shareable by link → URL. Otherwise `useState`.

### Redux slices

- **`auth-slice`** — `{ user, accessToken, status }`. `status` is `unknown` until the silent refresh finishes, then `authed` or `guest`. The token is **never** written to `localStorage`/`sessionStorage`.
- **`ui-slice`** — `{ sidebarOpen, serverWaking }`.

### Query keys (`features/*/keys.ts`)

```ts
export const issueKeys = {
  all: ['issues'] as const,
  lists: () => [...issueKeys.all, 'list'] as const,
  list: (filters: IssueFilters) => [...issueKeys.lists(), filters] as const,
  detail: (id: string) => [...issueKeys.all, 'detail', id] as const,
  activity: (id: string) => [...issueKeys.all, 'activity', id] as const,
  comments: (id: string, page: number) => ['comments', id, page] as const,
};
```

Other keys: `['dashboard']`, `['users', 'assignable']`, `['users', 'admin', filters]`.

**Invalidation matrix**

| Mutation | Invalidate |
| -------- | ---------- |
| create / delete issue | `issueKeys.lists()`, `['dashboard']` |
| update issue | `issueKeys.detail(id)`, `issueKeys.lists()` |
| change status | `issueKeys.detail(id)`, `issueKeys.activity(id)`, `issueKeys.lists()`, `['dashboard']` |
| assign / unassign | same as change status |
| add / edit / delete comment | `comments` for that issue, `issueKeys.detail(id)` (comment count), `issueKeys.activity(id)` |
| update user (admin) | `['users']` |

---

## Authentication & Session Flow

```
App load
  └─ AuthBootstrap: POST /auth/refresh (cookie)
        ├─ 200 → store { user, accessToken } → status = authed
        └─ 401 → status = guest
  (UI shows a full-page splash while status = unknown)

Every request
  └─ request interceptor adds  Authorization: Bearer <accessToken>

401 with code AUTH_TOKEN_EXPIRED
  └─ response interceptor: single-flight POST /auth/refresh
        ├─ success → retry the original request once
        └─ failure → dispatch logout, redirect to /login (or /admin/login when on an admin route)
```

- Concurrent 401s share **one** refresh promise (no refresh storms).
- The refresh/login/register/logout calls are excluded from the retry logic (no loops).
- **Logout** calls `POST /auth/logout`, clears Redux, clears the Query cache, redirects to the login page.
- Roles come from the server (`user.role`). The UI hides actions the user cannot perform, but the server is always the authority.

---

## Routing & Access Control

```
<AppRouter>
 ├─ <GuestOnly>   /login  /register  /admin/login
 ├─ <RequireAuth> <AppShell>
 │     /dashboard  /issues  /issues/new  /issues/:issueId  /issues/:issueId/edit
 │     <RequireAdmin> /admin/users
 └─ *  NotFound
```

- Guards read `auth-slice`. While `status = unknown` they render the splash, never a flash of the login page.
- After login, return the user to the page they originally requested (`state.from`).
- Pages are lazy-loaded (`React.lazy` + `Suspense`) for small initial bundles.

---

## API Consumption Rules

1. One Axios instance in `services/api.ts`; `baseURL = import.meta.env.VITE_API_BASE_URL` (`/api/v1`), `withCredentials: true`.
2. Each feature has `api.ts` (plain functions returning typed data, unwrapping `response.data.data`) and `hooks/` (TanStack Query wrappers). Components import hooks only.
3. Errors are normalised to `ApiError { status, code, message, details }`. UI maps `code` → friendly text in `helpers/error-messages.ts`; it never parses message strings.
4. Field-level `VALIDATION_ERROR.details` are pushed into React Hook Form via `setError`.
5. Slow-request detection: if a request takes > 4 s, set `serverWaking = true` (shows the "Waking the server — free hosting can take up to a minute" banner) and clear it on completion.

---

## UI / UX Principles

- **Responsive first:** correct at 375 px, 768 px and 1280 px+. Sidebar becomes a Sheet on mobile; tables degrade to stacked cards.
- **Loading:** skeletons for lists/cards, spinners inside buttons while mutating.
- **Error:** inline `ErrorState` with a retry button; never a blank screen.
- **Empty:** `EmptyState` with a call to action ("No issues match your filters" / "Create the first issue").
- **Feedback:** Sonner toasts for success and failure of every mutation.
- **Destructive actions:** always behind `ConfirmDialog`.
- **Accessibility:** labelled inputs, visible focus rings, keyboard-operable menus and dialogs (Radix), `aria-live` for toasts, status never conveyed by colour alone (badge has text), AA contrast.
- **Forms:** disable submit while pending, preserve input on failure, show field errors under the field.

### Design tokens

Defined once in `src/index.css` using Tailwind v4 `@theme` and shadcn CSS variables; JSX uses semantic classes only.

| Role | Token | Colour |
| ---- | ----- | ------ |
| Primary | `primary` | Indigo `#4F46E5` |
| Background / surface | `background`, `card` | `#F8FAFC` / white |
| Text | `foreground`, `muted-foreground` | Slate 900 / Slate 500 |
| Danger | `destructive` | Red `#DC2626` |
| Status – Open | `status-open` | Blue |
| Status – In progress | `status-progress` | Amber |
| Status – Closed | `status-closed` | Green |
| Priority – Low / Medium / High / Critical | `priority-*` | Slate / Blue / Orange / Red |

---

## Security Considerations

- Access token lives **only in memory** (Redux). Refresh token is an `httpOnly` cookie the JS cannot read.
- No `dangerouslySetInnerHTML`; issue and comment text is always rendered as text (React escapes it).
- No secrets in the bundle: only `VITE_*` public values.
- Security headers set in `vercel.json`: `Content-Security-Policy`, `X-Content-Type-Options`, `X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy`.
- Client validation is for UX; the server validates everything again.
- Dependencies audited in CI.

---

## Performance

- Route-level code splitting; vendor chunking via Vite.
- Query `staleTime` 30 s, `placeholderData: keepPreviousData` on paginated lists to avoid flicker.
- Search input debounced 300 ms; filters synced to the URL.
- Memoise only where profiling shows a need; avoid premature `useMemo`.

---

## Conclusion

The frontend gives a typed, accessible, responsive UI with clean separation: Query for server data, Redux for auth/UI, URL for shareable filters, three component tiers for consistent UI, and a secure, silent session flow that works on free hosting.
