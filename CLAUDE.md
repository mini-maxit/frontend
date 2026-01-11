# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Mini-Maxit Frontend is a **Svelte 5 + SvelteKit 2** application for a programming contest platform. It communicates with a backend API and file storage service.

**Tech Stack:**

- Svelte 5 with runes (`$state`, `$derived`, `$effect`, `$props`)
- SvelteKit 2 with Node.js adapter (Docker deployment)
- TypeScript (strict mode)
- Tailwind CSS 4 (OKLCH color space)
- Paraglide.js for compile-time i18n (English/Polish)
- Valibot for schema validation
- pnpm (required - DO NOT use npm/yarn)

## Quick Start Commands

### Development

```bash
pnpm install              # Install dependencies (pnpm ONLY)
pnpm run dev              # Start dev server with HMR
pnpm run build            # Production build
pnpm run preview          # Preview built app
```

### Code Quality

```bash
pnpm run check            # Type check with svelte-check
pnpm run check:watch      # Watch mode type checking
pnpm run lint             # Prettier + ESLint
pnpm run format           # Auto-format with Prettier
```

### Environment Setup

```bash
cp .env.example .env      # Create environment file
# Edit .env with BACKEND_API_URL and FILE_STORAGE_URL
```

### Docker

```bash
docker build -t maxit-frontend .
docker run -p 3000:3000 \
  -e BACKEND_API_URL=http://backend:8000 \
  -e FILE_STORAGE_URL=http://storage:8888 \
  maxit-frontend
```

## Critical Architecture Patterns

### 1. Remote Functions (Primary Server Pattern)

This project uses **SvelteKit remote functions** (`experimental.remoteFunctions: true`) instead of traditional `+page.server.ts` load functions.

**Three types of remote functions:**

#### `query` - Server-side data fetching

```typescript
// tasks.remote.ts
import { query, getRequestEvent } from '$app/server';
import * as v from 'valibot';

// Without parameters
export const getTasks = query(async () => {
  const { cookies } = getRequestEvent();
  const taskService = createTaskService(cookies);
  return await taskService.getAllTasks();
});

// With parameters (requires Valibot schema)
export const getTask = query(v.number(), async (taskId: number) => {
  const { cookies } = getRequestEvent();
  const taskService = createTaskService(cookies);
  return await taskService.getTaskById(taskId);
});
```

Usage in component:

```svelte
<script lang="ts">
  import { getTasks } from './tasks.remote';

  const tasksQuery = getTasks();
</script>

{#if tasksQuery.error}
  <ErrorCard error={tasksQuery.error} onRetry={() => tasksQuery.refresh()} />
{:else if tasksQuery.loading}
  <LoadingSpinner />
{:else if tasksQuery.current}
  <TasksList tasks={tasksQuery.current} />
{/if}
```

#### `form` - Form submissions with progressive enhancement

```typescript
// login.remote.ts
import { form, getRequestEvent } from '$app/server';
import * as v from 'valibot';

export const login = form(
  v.object({
    email: v.pipe(v.string(), v.email()),
    password: v.pipe(v.string(), v.nonEmpty())
  }),
  async (data) => {
    const { cookies } = getRequestEvent();
    // Handle login logic
    return { success: true };
  }
);
```

Usage:

```svelte
<script lang="ts">
  const loginAction = login();
</script>

<form method="POST" use:loginAction.enhance>
  <input name="email" type="email" />
  <button type="submit" disabled={loginAction.submitting}>Submit</button>
</form>
```

#### `command` - Programmatic mutations

```typescript
export const approveRequest = command(
  v.object({
    contestId: v.pipe(v.number(), v.integer()),
    userId: v.pipe(v.number(), v.integer())
  }),
  async (data) => {
    const { cookies } = getRequestEvent();
    const contestService = createContestService(cookies);
    await contestService.approveRegistrationRequest(data.contestId, data.userId);
    return { success: true };
  }
);
```

Usage (only from event handlers):

```svelte
<button onclick={() => approveRequest({ contestId: 123, userId: 456 })}> Approve </button>
```

### 2. Service Layer Pattern

**All API communication goes through service classes.** Never make direct fetch calls.

Services are located in `/src/lib/services/`:

- `ApiService.ts` - Base HTTP client with auth & token refresh
- `AuthService.ts` - Authentication operations
- `TaskService.ts` - Task management
- `ContestService.ts` - Contest operations
- `SubmissionService.ts` - Code submission handling
- `UserService.ts` - User profile management
- `AccessControlService.ts` - Access control operations
- `TasksManagementService.ts` - Admin task management
- `ContestsManagementService.ts` - Admin contest management

**Service pattern:**

```typescript
import type { ApiService } from './ApiService';
import type { Task } from '$lib/dto/task';

export class TaskService {
  constructor(private apiClient: ApiService) {}

  async getAllTasks(): Promise<{
    success: boolean;
    status: number;
    data?: Task[];
    error?: string;
  }> {
    try {
      const response = await this.apiClient.get<ApiResponse<Task[]>>({
        url: '/tasks/'
      });
      return { success: true, data: response.data, status: 200 };
    } catch (error) {
      if (error instanceof ApiError) {
        return {
          success: false,
          error: error.getApiMessage(),
          status: error.getStatus()
        };
      }
      throw error;
    }
  }
}

// Factory function for dependency injection
export function createTaskService(cookies: Cookies): TaskService {
  const apiClient = createApiClient(cookies);
  return new TaskService(apiClient);
}
```

**Using services in remote functions:**

```typescript
import { createTaskService } from '$lib/services/TaskService';
import { getRequestEvent } from '$app/server';

const { cookies } = getRequestEvent();
const taskService = createTaskService(cookies);
```

### 3. Svelte 5 Runes (No Legacy Syntax)

```svelte
<script lang="ts">
  // Props with TypeScript interface
  interface Props {
    title: string;
    count?: number;
  }
  let { title, count = 0 }: Props = $props();

  // Reactive state
  let items = $state<Item[]>([]);
  let dialogOpen = $state(false);

  // Derived values (computed)
  let doubled = $derived(count * 2);
  let isEmpty = $derived(items.length === 0);

  // Side effects only
  $effect(() => {
    console.log('Count changed:', count);
    localStorage.setItem('count', count.toString());
  });

  // Event handlers (lowercase in Svelte 5)
  function handleClick() {
    dialogOpen = true;
  }
</script>

<button onclick={handleClick}>Click me</button>
```

**Async Components:** Enabled via `experimental.async: true` - can use top-level `await` in components.

### 4. Authentication & Security

**Token Storage:** HTTP-only cookies (XSS-resistant)

```typescript
// src/lib/token.ts
export function setAccessToken(cookies: Cookies, token: string): void {
  cookies.set(ACCESS_TOKEN_KEY, token, {
    path: '/',
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7 // 7 days
  });
}
```

**Server-side auth hook:** `src/hooks.server.ts`

- Decodes JWT from cookie
- Populates `event.locals.user`
- Redirects unauthenticated users from protected routes
- Handles i18n middleware via Paraglide

**Token refresh:** Automatic in `ApiService` on 401 responses

## Project Structure

```
src/
├── routes/                     # File-based routing
│   ├── (landing)/             # Route group: login, register
│   │   ├── login/
│   │   │   ├── +page.svelte
│   │   │   └── login.remote.ts
│   │   └── register/
│   ├── dashboard/             # Authenticated area
│   │   ├── admin/             # Admin-only routes
│   │   ├── teacher/           # Teacher routes
│   │   ├── user/              # User-specific routes
│   │   ├── tasks/
│   │   │   ├── [taskId]/
│   │   │   │   ├── +page.svelte
│   │   │   │   ├── task.remote.ts
│   │   │   │   └── submit.remote.ts
│   │   │   ├── +page.svelte
│   │   │   └── tasks.remote.ts
│   │   ├── contests/
│   │   ├── +layout.svelte     # Dashboard layout
│   │   └── +layout.server.ts
│   ├── +layout.svelte         # Root layout
│   ├── +page.svelte           # Landing page
│   └── +error.svelte          # Error boundary
│
├── lib/
│   ├── components/
│   │   ├── ui/                # Primitive components (Button, Card, etc.)
│   │   ├── common/            # Shared components (LoadingSpinner, ErrorCard)
│   │   ├── dashboard/         # Feature-specific dashboard components
│   │   │   ├── admin/
│   │   │   ├── tasks/
│   │   │   ├── contests/
│   │   │   ├── DashboardSidebar.svelte
│   │   │   └── utils.ts       # Dashboard utilities (title translations)
│   │   └── landing_page/      # Landing page sections
│   │
│   ├── services/              # Business logic layer
│   │   ├── ApiService.ts      # Base HTTP client
│   │   ├── TaskService.ts
│   │   ├── ContestService.ts
│   │   ├── AuthService.ts
│   │   └── index.ts
│   │
│   ├── dto/                   # TypeScript type definitions
│   │   ├── task.ts
│   │   ├── contest.ts
│   │   ├── response.ts
│   │   └── error.ts
│   │
│   ├── paraglide/             # Generated i18n (DO NOT EDIT)
│   ├── routes.ts              # Route constants & helpers
│   ├── token.ts               # Token management
│   ├── jwt.ts                 # JWT decoding
│   └── utils.ts               # Utility functions
│
├── hooks.server.ts            # Server middleware (auth, i18n)
├── app.css                    # Global styles
└── app.d.ts                   # Global TypeScript types
```

**Component hierarchy:**

```
ui/ (primitives) → common/ (shared) → dashboard/ (features) → routes/ (pages)
```

Components at higher levels can import from lower levels, but not vice versa.

## Internationalization (i18n)

Uses **Paraglide** for compile-time i18n (zero runtime overhead).

**Message files:** `/messages/en.json` and `/messages/pl.json`

**ALWAYS add translations to BOTH files:**

```json
// messages/en.json
{
  "admin_tasks_title": "Task Management",
  "validation_email_required": "Email is required"
}

// messages/pl.json
{
  "admin_tasks_title": "Zarządzanie zadaniami",
  "validation_email_required": "Email jest wymagany"
}
```

**Using in components:**

```svelte
<script lang="ts">
  import * as m from '$lib/paraglide/messages';
</script>

<h1>{m.admin_tasks_title()}</h1>

<!-- With parameters -->
<p>{m.hello_world({ name: 'User' })}</p>

<!-- In validation -->
v.pipe( v.string(m.validation_email_required()), v.email(m.validation_email_invalid()) )
```

**Dashboard page titles:** Managed in `/src/lib/components/dashboard/utils.ts` via `getDashboardTitleTranslationFromPathname()`. Add new routes to `routeTitleMap` or add pattern matching for dynamic routes.

## Styling Guidelines

**Tailwind CSS 4 with OKLCH colors:**

```svelte
<!-- Use utility classes -->
<div class="rounded-2xl border bg-card p-6 shadow-md">
  <h2 class="text-3xl font-bold text-foreground">{m.title()}</h2>
</div>

<!-- Responsive modifiers -->
<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
  <!-- Content -->
</div>
```

**CSS variables for theming:**

- Primary: `oklch(0.3879 0.0851 237.33)` (deep blue)
- Secondary: `oklch(0.4725 0.0809 206.34)` (lighter blue)
- Background: `oklch(0.96 0.01 79.34)` (off-white)
- Dark mode: Automatically switches via `.dark` class

**Always reuse common components:**

```svelte
import {(LoadingSpinner, ErrorCard, EmptyState)} from '$lib/components/common';

<LoadingSpinner message="Loading tasks..." />
<ErrorCard {error} onRetry={() => query.refresh()} />
<EmptyState title={m.no_items_title()} icon={Upload} />
```

## TypeScript Conventions

**Strict mode enabled.** Configuration in `tsconfig.json`:

- Path aliases: `$lib` → `/src/lib`, `$routes` → `/src/routes`
- ES modules only

**Type patterns:**

```typescript
// Component props
interface Props {
  title: string;
  count?: number;
  onClick?: () => void;
}

// DTOs in /src/lib/dto/
export interface Task {
  id: number;
  title: string;
  createdAt: string;
}

// Service responses
type ServiceResponse<T> = {
  success: boolean;
  status: number;
  data?: T;
  error?: string;
};
```

**Validation with Valibot:**

```typescript
import * as v from 'valibot';
import * as m from '$lib/paraglide/messages';

const FormSchema = v.object({
  email: v.pipe(v.string(m.validation_email_required()), v.email(m.validation_email_invalid())),
  password: v.pipe(
    v.string(m.validation_password_required()),
    v.minLength(8, m.validation_password_min_length())
  )
});

type FormData = v.InferOutput<typeof FormSchema>;
```

## File Naming Conventions

| Type             | Convention                    | Example                             |
| ---------------- | ----------------------------- | ----------------------------------- |
| Components       | PascalCase                    | `TaskDescription.svelte`            |
| Services         | PascalCase + `Service` suffix | `TaskService.ts`                    |
| DTOs             | lowercase                     | `task.ts`, `contest.ts`             |
| Routes           | SvelteKit convention          | `+page.svelte`, `+layout.server.ts` |
| Remote functions | `.remote.ts` suffix           | `tasks.remote.ts`                   |
| Utilities        | camelCase                     | `calculateScore.ts`                 |

## Common Patterns

### Query with Loading/Error States

```svelte
<script lang="ts">
  import { getData } from './data.remote';
  import { LoadingSpinner, ErrorCard } from '$lib/components/common';

  const query = getData();
</script>

{#if query.error}
  <ErrorCard error={query.error} onRetry={() => query.refresh()} />
{:else if query.loading}
  <LoadingSpinner />
{:else if query.current}
  <div>{query.current.title}</div>
{/if}
```

### Form Submission

```svelte
<script lang="ts">
  import { submitForm } from './form.remote';
  const formAction = submitForm();
</script>

<form method="POST" use:formAction.enhance>
  <input name="email" type="email" />
  <button type="submit" disabled={formAction.submitting}>Submit</button>
</form>
```

### Dialog Pattern

```svelte
<script lang="ts">
  let dialogOpen = $state(false);
</script>

<Button onclick={() => (dialogOpen = true)}>Open Dialog</Button>
<MyDialog bind:open={dialogOpen} onSuccess={() => query.refresh()} />
```

## Code Quality Checklist

Before committing:

- [ ] `pnpm run check` passes (no TypeScript errors)
- [ ] `pnpm run lint` passes (code formatted)
- [ ] No console.log/console.error in production code
- [ ] All user-facing strings use i18n (added to both en.json and pl.json)
- [ ] Responsive design tested (mobile + desktop)
- [ ] Loading and error states handled
- [ ] Services used for all API calls (no direct fetch)

## Important Notes

1. **Always use pnpm** - NEVER use npm or yarn (will create wrong lockfiles)
2. **Always use remote functions** for server-side operations
3. **Always use services** for API calls - never direct fetch
4. **Always add i18n to BOTH languages** - check existing messages first
5. **Use Svelte 5 runes** - no legacy reactive syntax (`$:`, stores unless necessary)
6. **Match existing design** - refer to landing page, admin pages, and task pages
7. **Validate with Valibot** - especially for user input and form schemas
8. **HTTP-only cookies for tokens** - never use localStorage/sessionStorage

## Environment Variables

Required in `.env`:

```bash
BACKEND_API_URL=http://localhost:8000
FILE_STORAGE_URL=http://file-storage:8888
```

## Development Workflow

**Commit convention:** Use [Conventional Commits](https://www.conventionalcommits.org/)

```bash
feat: add contest leaderboard component
fix: correct timezone conversion on client
docs: update API integration guide
refactor: simplify auth service
```

**Pre-commit hooks:** Automatically run syntax checks, trailing whitespace removal, YAML validation

**Main branch:** `master`

## Key Reference Files

- Remote function examples: `/src/routes/dashboard/tasks/tasks.remote.ts`
- Form example: `/src/routes/(landing)/login/login.remote.ts`
- Service example: `/src/lib/services/TaskService.ts`
- API client: `/src/lib/services/ApiService.ts`
- Landing page styling: `/src/routes/+page.svelte`
- Dashboard layout: `/src/routes/dashboard/+layout.svelte`
- Auth middleware: `/src/hooks.server.ts`
