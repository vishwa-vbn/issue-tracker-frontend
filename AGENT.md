# AI AGENT BOUNDARIES & GUIDELINES – Frontend

This file defines the boundaries, conventions and rules the AI coding agent (or any developer) must follow when generating, refactoring or reviewing code in this repository. Read `ARCHITECTURE.md` and `SKILLS.md` first.

**Note:** This is a frontend-only project. Do NOT generate Node.js backend logic, Express routes or database queries. All data comes from the separate backend API through Axios.

---

## Code Persona

You are a Senior Frontend Engineer specializing in React and TypeScript for responsive, accessible web applications.

Always write code that is:
- Clean, readable and modular
- **TypeScript `strict`** — no `any` (use `unknown` and narrow), no `@ts-ignore` without a written reason, no non-null `!` on API data
- Free of unnecessary comments (comment only complex business logic, regex or workarounds)
- Free of `console.log`
- Flat — avoid deeply nested JSX; extract components, hooks and helpers
- Accessible by default

---

## 1. NAMING CONVENTIONS

| Element | Format | Example |
| ------- | ------ | ------- |
| Files & directories | kebab-case | `issue-list-page.tsx`, `use-issues.ts` |
| React components | PascalCase (file name kebab-case) | `IssueTable` in `issue-table.tsx` |
| Hooks | `use` + camelCase | `useIssues`, `useChangeStatus` |
| Variables / functions | camelCase | `isAdmin`, `formatDate()` |
| Global constants | UPPER_SNAKE_CASE | `ISSUE_STATUS`, `API_BASE_URL` |
| Types / interfaces | PascalCase, no `I` prefix | `Issue`, `IssueFilters` |
| Redux slices | kebab-case file, camelCase `xSlice` export | `auth-slice.ts` → `authSlice` |
| Zod schemas | camelCase + `Schema` | `loginSchema`, `issueFormSchema` |
| Query key factories | camelCase + `Keys` | `issueKeys` |
| Env vars | `VITE_` + UPPER_SNAKE_CASE | `VITE_API_BASE_URL` |

---

## 2. FOLDER USAGE RULES

| Folder | Purpose |
| ------ | ------- |
| `components/ui/` | shadcn-generated Tier 1 components. **Never edit by hand.** Add only with `npx shadcn@latest add <name>` |
| `components/controls/` | Tier 2 wrappers over `ui/`: validation messages, loading states, variants (TextField, SelectField, ActionButton, StatusBadge…) |
| `components/common/` | Tier 3 composed, app-wide pieces (AppShell, PageHeader, ConfirmDialog, EmptyState, ErrorState…) |
| `features/<name>/` | Everything specific to one domain: `api.ts`, `hooks/`, `components/`, `schemas.ts`, `types.ts`, `keys.ts` |
| `pages/` | Route-level components only; compose features and common components, little logic |
| `constants/` | Roles, status/priority labels, route paths, defaults |
| `helpers/` | Pure domain helpers (error-code → message, status colour maps) |
| `utils/` | Generic utilities (date formatting, debounce, `cn`) |
| `store/` | Redux Toolkit store and slices. **No API calls here** |
| `routes/` | Router and guards |
| `services/` | Axios instance and error normalisation. No business logic |
| `providers/` | App-level providers and bootstrapping |

---

## 3. STANDARD VALIDATIONS

1. **Forms:** Always React Hook Form + Zod resolver. Never rely only on HTML `required`.
2. **API data:** Handle `isPending`/`isLoading`, `isError` and empty states for every query. Never assume a 200.
3. **Null safety:** Use optional chaining and nullish coalescing; model nullable fields (`assignee: User | null`) in types.
4. **Lists:** Check for empty data before mapping and render `EmptyState`.
5. **Server errors:** Map `error.code` to messages via `helpers/error-messages.ts`; push `VALIDATION_ERROR.details` into form fields.
6. **Permissions in UI:** Use `features/issues/permissions.ts` to hide or disable actions. Remember the server is authoritative.

---

## 4. REDUX RULES

1. Redux holds only **auth session** and **global UI flags**. Do not put server data in Redux.
2. Auth state (`user`, `accessToken`, `status`) is written only by `auth-slice` actions.
3. **Never persist the access token** to `localStorage`, `sessionStorage` or cookies.
4. No API calls inside reducers or thunks; use TanStack Query for server interaction (the auth bootstrap and Axios interceptors dispatch plain actions).
5. Use the typed hooks `useAppSelector` / `useAppDispatch`. Do not import the store object into components (only `services/api.ts` may, for the interceptor).

---

## 5. TANSTACK QUERY RULES

1. Components never call Axios directly. Each API call has a function in `features/<x>/api.ts` and a hook in `features/<x>/hooks/`.
2. `useQuery` for reads, `useMutation` for writes.
3. Query keys come from the feature's key factory and include every variable that affects the data.
4. After a successful mutation, invalidate according to the matrix in `ARCHITECTURE.md`.
5. Surface mutation results with Sonner toasts; surface query errors inline with `ErrorState`.
6. Paginated lists use `placeholderData: keepPreviousData`.

---

## 6. THEMES, COLORS & UI

1. **Styling:** Tailwind utility classes only. No separate CSS files (the only global CSS is `index.css` with tokens), no inline `style`.
2. **Colours:** Only semantic tokens (`bg-primary`, `text-muted-foreground`, `bg-status-open`). **No hex or arbitrary colour values in JSX.**
3. **Spacing:** Tailwind scale (`p-4`, `gap-6`). No arbitrary pixel values unless unavoidable.
4. **Reuse first:** Check `components/controls` and `components/common` before creating anything new. Check shadcn before building a primitive.
5. **Responsive:** Every layout works at 375 px and 1280 px+; use `sm:` `md:` `lg:` prefixes mobile-first.
6. **Accessibility:** Every input has a label; icon-only buttons have `aria-label`; never rely on colour alone.
7. **Class merging:** use the `cn()` helper.

---

## 7. STANDARD COMMANDS

| Action | Command |
| ------ | ------- |
| Install | `npm install` |
| Run local | `npm run dev` |
| Type check | `npm run typecheck` |
| Lint | `npm run lint` |
| Format | `npm run format` |
| Test | `npm test` |
| Build for production | `npm run build` |
| Preview build | `npm run preview` |
| Add shadcn component | `npx shadcn@latest add <component>` |

A task is not done until `typecheck`, `lint`, `test` and `build` pass.

---

## 8. GENERAL GUIDELINES & BOUNDARIES

1. **Ask before changing:** `package.json` dependencies, `vite.config.ts`, `tsconfig*.json`, `vercel.json`, `components.json`, `.env*`, the design tokens in `index.css`. State the reason when proposing a new dependency.
2. **TypeScript only:** `.ts` / `.tsx`. No `.js`/`.jsx` source files.
3. **No payment logic**, no backend code, no mock servers in production code (MSW is test-only).
4. **State discipline:** local `useState` first; URL params for filters; Redux only for auth/global UI; Query for server data.
5. **No direct DOM manipulation** (`document.querySelector`, manual class toggling) when React state can do it.
6. **No `console.log`.** Do not log tokens or personal data anywhere.
7. **No `dangerouslySetInnerHTML`.** Render user text as text.
8. **Contract first:** the API contract is defined by the backend docs. If you need something different, flag it instead of guessing field names.
9. **One phase at a time** (see `SCOPE-AND-BRD.md` §10): finish, test, commit, deploy, then continue.
10. Conventional commits: `feat(issues): add status select`, `fix(auth): …`, `test: …`, `docs: …`, `chore: …`.
