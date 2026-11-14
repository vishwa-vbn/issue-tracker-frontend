# SKILLS.md — Frontend Common Project Standards

Patterns every frontend change must follow. Copy these shapes; do not invent new ones. Path alias: `@/` = `src/`.

---

## 1. Component Architecture (Three Tiers)

- **Tier 1 – `components/ui/`**: shadcn/ui generated files. Install via CLI only (`npx shadcn@latest add button`). Never hand-edit.
- **Tier 2 – `components/controls/`**: wrappers around Tier 1. Own labels, error text, loading states, variants, accessibility wiring. Every form input, button variant, badge and selector lives here.
- **Tier 3 – `components/common/`**: larger composed pieces (AppShell, Sidebar, PageHeader, ConfirmDialog, EmptyState, ErrorState, Pagination, ServerWakingBanner). Built from Tier 1 + 2.
- **Feature components – `features/<x>/components/`**: domain pieces (IssueTable, CommentList…) built from the tiers above.

### shadcn components to install

```bash
npx shadcn@latest add button input textarea label select checkbox card badge dialog alert-dialog \
  dropdown-menu table tabs skeleton sonner avatar separator tooltip sheet popover command \
  pagination alert
```

---

## 2. React 19 Component Rules (refs)

React 19 passes `ref` as an ordinary prop to function components, so **`forwardRef` is not needed**. Still:

1. Wrappers must **spread the remaining props and the `ref`** onto the underlying shadcn element.
2. Anything used inside a Radix trigger with `asChild` (`DialogTrigger asChild`, `TooltipTrigger asChild`) must forward its props and ref to a DOM element or a component that does.
3. Give every component a descriptive name (arrow functions assigned to a const, or named function declarations) for readable stack traces.

```tsx
// components/controls/text-field.tsx
import { useId, type ComponentProps } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type TextFieldProps = ComponentProps<typeof Input> & {
  label: string;
  error?: string;
  hint?: string;
};

export function TextField({ label, error, hint, id, ...props }: TextFieldProps) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  const describedBy = error ? `${fieldId}-error` : hint ? `${fieldId}-hint` : undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={fieldId}>{label}</Label>
      <Input id={fieldId} aria-invalid={!!error} aria-describedby={describedBy} {...props} />
      {hint && !error && <p id={`${fieldId}-hint`} className="text-xs text-muted-foreground">{hint}</p>}
      {error && <p id={`${fieldId}-error`} role="alert" className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
```

```tsx
// components/controls/action-button.tsx
import type { ComponentProps } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

type ActionButtonProps = ComponentProps<typeof Button> & { isLoading?: boolean };

export function ActionButton({ isLoading, disabled, children, ...props }: ActionButtonProps) {
  return (
    <Button disabled={disabled || isLoading} aria-busy={isLoading} {...props}>
      {isLoading && <Loader2 className="size-4 animate-spin" aria-hidden />}
      {children}
    </Button>
  );
}
```

### Required controls (build in Phase 0/1 before pages)

| Control | Variants |
| ------- | -------- |
| `TextField` | label, placeholder, disabled, error, hint, prefix/suffix icon, password toggle |
| `TextAreaField` | label, error, character counter |
| `SelectField` | standard, disabled, error |
| `ComboboxField` | searchable (assignee picker), clearable "Unassigned" |
| `ActionButton` | default, outline, ghost, destructive, secondary, link, icon-only, loading, disabled |
| `StatusBadge` | Open (blue), In progress (amber), Closed (green) — always text + colour |
| `PriorityBadge` | Low, Medium, High, Critical |
| `UserAvatar` | initials, size variants |

---

## 3. Forms: React Hook Form + Zod + `Controller`

Always use `Controller` with our Tier 2 controls; never mix `register` and `Controller` on the same field.

```tsx
// features/auth/schemas.ts
import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().trim().min(2, 'Enter your name').max(80),
  email: z.string().trim().toLowerCase().email('Enter a valid email'),
  password: z.string()
    .min(8, 'At least 8 characters')
    .max(72, 'At most 72 characters')
    .regex(/[A-Za-z]/, 'Include a letter')
    .regex(/\d/, 'Include a number'),
});
export type RegisterValues = z.infer<typeof registerSchema>;
```

```tsx
// pages/auth/register-page.tsx (form part)
const { control, handleSubmit, setError } = useForm<RegisterValues>({
  resolver: zodResolver(registerSchema),
  defaultValues: { name: '', email: '', password: '' },
});
const register = useRegister();

const onSubmit = handleSubmit((values) =>
  register.mutate(values, {
    onError: (err) => applyApiErrors(err, setError),   // maps VALIDATION_ERROR details → fields
  }),
);

return (
  <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
    <Controller name="name" control={control} render={({ field, fieldState }) => (
      <TextField {...field} label="Full name" autoComplete="name" error={fieldState.error?.message} />
    )} />
    <Controller name="email" control={control} render={({ field, fieldState }) => (
      <TextField {...field} type="email" label="Email" autoComplete="email" error={fieldState.error?.message} />
    )} />
    <Controller name="password" control={control} render={({ field, fieldState }) => (
      <TextField {...field} type="password" label="Password" autoComplete="new-password"
                 error={fieldState.error?.message} />
    )} />
    <ActionButton type="submit" isLoading={register.isPending}>Create account</ActionButton>
  </form>
);
```

### Issue form schema

```ts
export const issueFormSchema = z.object({
  title: z.string().trim().min(3, 'Title must be at least 3 characters').max(150),
  description: z.string().trim().max(5000, 'Keep it under 5000 characters'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  assigneeId: z.string().uuid().nullable(),
});
```

The "Unassigned" option uses `null` in form state; `ComboboxField` renders it as a clearable choice.

---

## 4. Axios Instance, Interceptors, Silent Refresh

```ts
// services/api.ts
import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { store } from '@/store';
import { sessionExpired, tokenRefreshed } from '@/store/auth-slice';
import { setServerWaking } from '@/store/ui-slice';
import { toApiError, type ApiErrorBody } from './api-error';

const baseURL = import.meta.env.VITE_API_BASE_URL;   // "/api/v1"
export const api = axios.create({ baseURL, withCredentials: true, timeout: 60_000 });

type Retriable = InternalAxiosRequestConfig & { _retry?: boolean };

api.interceptors.request.use((config) => {
  const token = store.getState().auth.accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// One refresh at a time; concurrent 401s await the same promise.
let refreshing: Promise<string> | null = null;
const refreshAccessToken = () =>
  (refreshing ??= axios
    .post(`${baseURL}/auth/refresh`, null, { withCredentials: true })   // plain axios: skips interceptors
    .then((res) => {
      store.dispatch(tokenRefreshed(res.data.data));
      return res.data.data.accessToken as string;
    })
    .finally(() => { refreshing = null; }));

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError<ApiErrorBody>) => {
    const original = error.config as Retriable | undefined;
    const code = error.response?.data?.error?.code;

    if (error.response?.status === 401 && code === 'AUTH_TOKEN_EXPIRED' && original && !original._retry) {
      original._retry = true;
      try {
        original.headers.Authorization = `Bearer ${await refreshAccessToken()}`;
        return api(original);
      } catch {
        store.dispatch(sessionExpired());
      }
    }
    return Promise.reject(toApiError(error));
  },
);
```

Slow-request detection: wrap requests with a 4-second timer that dispatches `setServerWaking(true)` and clears it on settle (implemented once in the interceptors, never in components).

### `ApiError`

```ts
export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
    readonly details: { path: string; message: string }[] | null = null,
  ) { super(message); }
}
```

`toApiError` converts any Axios/network failure into an `ApiError` (`code: 'NETWORK_ERROR'` when there is no response).

---

## 5. TanStack Query Patterns

### Query client defaults

```ts
new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, retry: (n, err) => !(err instanceof ApiError && err.status < 500) && n < 2,
               refetchOnWindowFocus: false },
  },
});
```

### API function + hook

```ts
// features/issues/api.ts
export const fetchIssues = async (filters: IssueFilters) => {
  const { data } = await api.get<Paginated<Issue>>('/issues', { params: filters });
  return data;                                 // { success, data: Issue[], meta }
};

// features/issues/hooks/use-issues.ts
export const useIssues = (filters: IssueFilters) =>
  useQuery({
    queryKey: issueKeys.list(filters),
    queryFn: () => fetchIssues(filters),
    placeholderData: keepPreviousData,
  });
```

### Mutation with invalidation + toast

```ts
// features/issues/hooks/use-change-status.ts
export const useChangeStatus = (issueId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (status: IssueStatus) => changeIssueStatus(issueId, status),
    onSuccess: () => {
      toast.success('Status updated');
      qc.invalidateQueries({ queryKey: issueKeys.detail(issueId) });
      qc.invalidateQueries({ queryKey: issueKeys.activity(issueId) });
      qc.invalidateQueries({ queryKey: issueKeys.lists() });
      qc.invalidateQueries({ queryKey: ['dashboard'] });
    },
    onError: (err) => toast.error(messageForError(err)),
  });
};
```

### Using a query in a page

```tsx
const { data, isPending, isError, error, refetch } = useIssues(filters);

if (isPending) return <IssueTableSkeleton />;
if (isError)   return <ErrorState error={error} onRetry={refetch} />;
if (data.data.length === 0) return <EmptyState title="No issues match your filters" />;
return <IssueTable issues={data.data} />;
```

### Query key table

| Domain | Key |
| ------ | --- |
| Issue lists | `['issues','list',filters]` |
| Issue detail | `['issues','detail',id]` |
| Activity | `['issues','activity',id]` |
| Comments | `['comments',issueId,page]` |
| Dashboard | `['dashboard']` |
| Assignable users | `['users','assignable']` |
| Admin users | `['users','admin',filters]` |

---

## 6. Redux Toolkit Patterns

```ts
// store/auth-slice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type AuthUser = { id: string; name: string; email: string; role: 'USER' | 'ADMIN' };
type AuthState = { user: AuthUser | null; accessToken: string | null; status: 'unknown' | 'authed' | 'guest' };

const initialState: AuthState = { user: null, accessToken: null, status: 'unknown' };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signedIn: (_s, a: PayloadAction<{ user: AuthUser; accessToken: string }>) => ({ ...a.payload, status: 'authed' }),
    tokenRefreshed: (s, a: PayloadAction<{ user: AuthUser; accessToken: string }>) => {
      s.user = a.payload.user; s.accessToken = a.payload.accessToken; s.status = 'authed';
    },
    sessionExpired: () => ({ user: null, accessToken: null, status: 'guest' }),
    signedOut: () => ({ user: null, accessToken: null, status: 'guest' }),
  },
});

export const { signedIn, tokenRefreshed, sessionExpired, signedOut } = authSlice.actions;
export default authSlice.reducer;
```

```ts
// store/index.ts
export const store = configureStore({ reducer: { auth: authReducer, ui: uiReducer } });
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
```

On `sessionExpired` / `signedOut`, also call `queryClient.clear()` so one user's cached data never shows for another.

---

## 7. Routing & Guards

```tsx
// routes/require-auth.tsx
export function RequireAuth() {
  const status = useAppSelector((s) => s.auth.status);
  const location = useLocation();
  if (status === 'unknown') return <FullPageSplash />;
  if (status === 'guest') return <Navigate to="/login" replace state={{ from: location }} />;
  return <Outlet />;
}

// routes/require-admin.tsx
export function RequireAdmin() {
  const role = useAppSelector((s) => s.auth.user?.role);
  return role === 'ADMIN' ? <Outlet /> : <ForbiddenPage />;
}
```

```tsx
// routes/app-router.tsx (shape)
const IssueListPage = lazy(() => import('@/pages/issues/issue-list-page'));
…
<Route element={<GuestOnly />}>
  <Route path="/login" element={<LoginPage />} />
  <Route path="/register" element={<RegisterPage />} />
  <Route path="/admin/login" element={<AdminLoginPage />} />
</Route>
<Route element={<RequireAuth />}>
  <Route element={<AppShell />}>
    <Route index element={<Navigate to="/dashboard" replace />} />
    <Route path="/dashboard" element={<DashboardPage />} />
    <Route path="/issues" element={<IssueListPage />} />
    <Route path="/issues/new" element={<IssueNewPage />} />
    <Route path="/issues/:issueId" element={<IssueDetailPage />} />
    <Route path="/issues/:issueId/edit" element={<IssueEditPage />} />
    <Route element={<RequireAdmin />}><Route path="/admin/users" element={<AdminUsersPage />} /></Route>
  </Route>
</Route>
<Route path="*" element={<NotFoundPage />} />
```

---

## 8. URL-Driven Filters

Issue list filters (`q`, `status`, `priority`, `assigneeId`, `page`, `sort`, `order`) live in `useSearchParams`, parsed and validated by a Zod schema into `IssueFilters`. Debounce the text input, reset `page` to 1 whenever another filter changes. This makes every filtered view shareable and refresh-safe.

---

## 9. Permissions in the UI

```ts
// features/issues/permissions.ts — mirrors backend policies, used only to hide/disable UI
export const isAdmin = (u: AuthUser | null) => u?.role === 'ADMIN';
export const canEditIssue = (u: AuthUser | null, i: Issue) => !!u && (isAdmin(u) || i.reporter.id === u.id);
export const canChangeStatus = (u: AuthUser | null, i: Issue) =>
  !!u && (isAdmin(u) || i.reporter.id === u.id || i.assignee?.id === u.id);
export const canAssign = canEditIssue;
export const canDeleteComment = (u: AuthUser | null, c: Comment) => !!u && (isAdmin(u) || c.author.id === u.id);
export const canEditComment = (u: AuthUser | null, c: Comment) => !!u && c.author.id === u.id;
```

If the server returns `FORBIDDEN` anyway (stale UI), show a toast and refetch.

---

## 10. Styling Rules (Tailwind only)

- Semantic tokens only; no hex, no arbitrary colours, no inline `style`.
- Mobile-first: base styles for 375 px, add `sm:` `md:` `lg:`.
- Use `cn()` (clsx + tailwind-merge) for conditional classes.
- Status/priority colour maps live in `helpers/status.ts`, never hardcoded in components.

```tsx
<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4" />
```

---

## 11. Loading, Error, Empty (mandatory trio)

| State | Component | Rule |
| ----- | --------- | ---- |
| Loading | `SkeletonLoader` variants (table rows, cards, full page) | Shown while `isPending` |
| Error | `ErrorState` (message from `error.code`, Retry button) | Shown when `isError` |
| Empty | `EmptyState` (icon, heading, subtext, optional CTA) | Shown when list is empty |

Mutations: button shows spinner, toast on success/failure, dialog stays open on failure.

---

## 12. Dashboard Pattern

`useDashboard()` → `StatCard` row (Total, Open, In progress, Closed) → "My work" card (assigned to me, reported by me) → priority breakdown (simple horizontal bars built with Tailwind — no chart library needed) → recent issues list. Admin-only cards render only when `data.admin` exists. Cards link to the pre-filtered issue list (e.g. Open → `/issues?status=OPEN`).

---

## 13. Testing Patterns

```tsx
// Vitest + RTL + MSW
server.use(http.post('/api/v1/auth/login', () =>
  HttpResponse.json({ success: false, error: { code: 'AUTH_INVALID_CREDENTIALS', message: '…' } }, { status: 401 })));

render(<LoginPage />, { wrapper: TestProviders });
await user.type(screen.getByLabelText(/email/i), 'a@b.com');
await user.type(screen.getByLabelText(/password/i), 'wrong');
await user.click(screen.getByRole('button', { name: /sign in/i }));

expect(await screen.findByText(/invalid email or password/i)).toBeInTheDocument();
```

Minimum tests: login/register validation and error display; `RequireAuth` / `RequireAdmin` redirects; issue form validation; status badge rendering; permission helpers (table-driven); one list page with loading → data → empty.

---

## 14. Logging & Debugging

- No `console.log` in committed code (ESLint `no-console` is an error).
- Never log tokens, passwords or full API payloads.
- Use React Query Devtools in development only (guarded by `import.meta.env.DEV`).

---

## 15. Don'ts

- Don't write plain JavaScript files or use `any`.
- Don't store tokens in `localStorage` / `sessionStorage`, and don't put server data in Redux.
- Don't call Axios from components — use feature hooks.
- Don't skip loading, error or empty states.
- Don't hand-edit `components/ui/`.
- Don't use `register` on custom controls — use `Controller`.
- Don't use hex colours, inline styles or custom CSS files.
- Don't use `dangerouslySetInnerHTML`.
- Don't trust UI permission checks for security — the server decides.
- Don't build a primitive that shadcn already provides.
- Don't leave destructive actions without a `ConfirmDialog`.
