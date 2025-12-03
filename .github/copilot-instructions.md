# Copilot Instructions for mini-maxit/frontend

## Project Overview

This is a **Svelte 5 + SvelteKit** application for a programming contest platform. The frontend communicates with a backend API and uses modern web technologies including:

- **Svelte 5** with runes and async components
- **SvelteKit** with remote functions
- **TypeScript** (strict mode)
- **Tailwind CSS 4** for styling
- **Paraglide** for i18n (English and Polish)
- **Valibot** for schema validation
- **pnpm** as package manager (**REQUIRED** - do NOT use npm or create package-lock.json)

## Svelte & SvelteKit Best Practices

### Using Svelte MCP Server

You have access to the Svelte MCP server for up-to-date documentation:

#### 1. list-sections

Use this FIRST to discover all available documentation sections. Returns a structured list with titles, use_cases, and paths.
When asked about Svelte or SvelteKit topics, ALWAYS use this tool at the start of the chat to find relevant sections.

#### 2. get-documentation

Retrieves full documentation content for specific sections. Accepts single or multiple sections.
After calling the list-sections tool, you MUST analyze the returned documentation sections (especially the use_cases field) and then use the get-documentation tool to fetch ALL documentation sections that are relevant for the user's task.

#### 3. svelte-autofixer

Analyzes Svelte code and returns issues and suggestions.
You MUST use this tool whenever writing Svelte code before sending it to the user. Keep calling it until no issues or suggestions are returned.

#### 4. playground-link

Generates a Svelte Playground link with the provided code.
After completing the code, ask the user if they want a playground link. Only call this tool after user confirmation and NEVER if code was written to files in their project.

### Svelte 5 Conventions

This project uses **Svelte 5** with the following patterns:

- **Runes**: Use `$state`, `$derived`, `$effect`, `$props` instead of legacy reactive declarations
- **Async components**: Enabled via `experimental.async` in svelte.config.js - can use top-level `await` in components
- **Props**: Use destructuring with `$props()` rune:

  ```typescript
  interface Props {
    title: string;
    count?: number;
  }

  let { title, count = 0 }: Props = $props();
  ```

- **State**: Use `$state()` for reactive variables:
  ```typescript
  let dialogOpen = $state(false);
  let items = $state<Item[]>([]);
  ```
- **Derived values**: Use `$derived()` instead of reactive declarations:
  ```typescript
  let doubled = $derived(count * 2);
  ```

### Remote Functions (Critical Pattern)

This project extensively uses **SvelteKit remote functions** instead of traditional `+page.server.ts` load functions. This is enabled via `experimental.remoteFunctions: true` in svelte.config.js.

**When to use remote functions:**

- For server-side data fetching
- For form actions
- For any server-only operations

**Pattern structure:**

```
/routes/
  ├── dashboard/
  │   ├── tasks/
  │   │   ├── +page.svelte          ← Client component
  │   │   └── tasks.remote.ts       ← Remote functions
```

**Example implementation:**

**File: `tasks.remote.ts`**

```typescript
import { query, getRequestEvent } from '$app/server';
import { createApiClient } from '$lib/services/ApiService';
import { TaskService } from '$lib/services/TaskService';
import { error } from '@sveltejs/kit';

export const getTasks = query(async () => {
  const event = getRequestEvent();
  const apiClient = createApiClient(event.cookies);
  const taskService = new TaskService(apiClient);

  const result = await taskService.getAllTasks();
  if (!result.success || !result.data) {
    error(result.status, { message: result.error || 'Failed to fetch tasks.' });
  }

  return result.data;
});
```

**File: `+page.svelte`**

```typescript
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

**For form actions, use the `form()` helper:**

**File: `login.remote.ts`**

```typescript
import { form, getRequestEvent } from '$app/server';
import * as v from 'valibot';

const LoginSchema = v.object({
  email: v.pipe(v.string(), v.email()),
  password: v.pipe(v.string(), v.nonEmpty())
});

export const login = form(LoginSchema, async (data) => {
  const event = getRequestEvent();
  // Handle login logic
});
```

**Examples in the codebase:**

- Query: `/src/routes/dashboard/tasks/tasks.remote.ts`
- Form: `/src/routes/(landing)/login/login.remote.ts`
- With params: `/src/routes/dashboard/tasks/[taskId]/task.remote.ts`
- Command: `/src/routes/dashboard/admin/contests/[contestId]/registration-requests/registration-requests.remote.ts`

### Remote Function Types

There are **three types** of remote functions in SvelteKit:

#### 1. `query` - For reading data

Use `query()` for server-side data fetching. Queries are reactive and can be refreshed.

**Without parameters:**

```typescript
export const getTasks = query(async () => {
  const { cookies } = getRequestEvent();
  const taskService = createTaskService(cookies);
  return await taskService.getAllTasks();
});
```

**With parameters (requires schema validation):**

```typescript
import * as v from 'valibot';

export const getTask = query(v.number(), async (taskId: number) => {
  const { cookies } = getRequestEvent();
  const taskService = createTaskService(cookies);
  return await taskService.getTaskById(taskId);
});
```

**Usage in component:**

```typescript
const tasksQuery = getTasks();
// or with params
const taskQuery = getTask(taskId);

// Access data: taskQuery.current
// Check loading: taskQuery.loading
// Check error: taskQuery.error
// Refresh: taskQuery.refresh()
```

#### 2. `form` - For form submissions with progressive enhancement

Use `form()` for traditional HTML form submissions. Prefers `form` where possible since it gracefully degrades if JavaScript is disabled.

```typescript
export const login = form(
  v.object({
    email: v.pipe(v.string(), v.email()),
    password: v.pipe(v.string(), v.nonEmpty())
  }),
  async (data) => {
    const { cookies } = getRequestEvent();
    // Handle form submission
    return { success: true };
  }
);
```

**Usage in component:**

```typescript
const loginAction = login();

<form method="POST" use:loginAction.enhance>
  <input name="email" type="email" />
  <button type="submit" disabled={loginAction.submitting}>
    Submit
  </button>
</form>
```

#### 3. `command` - For programmatic mutations

Use `command()` for mutations that are called programmatically (not from forms). Unlike `form`, it's not specific to an element and can be called from anywhere (e.g., event handlers).

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

**Usage in component:**

```typescript
async function handleApprove(userId: number) {
  try {
    await approveRequest({ contestId: data.contestId, userId });
    // Optionally refresh query
    requestsQuery.refresh();
  } catch (error) {
    console.error('Failed to approve:', error);
  }
}

<button onclick={() => handleApprove(user.id)}>
  Approve
</button>
```

**Important:** Commands cannot be called during render - only from event handlers or effects.

## Service Layer Architecture

All API interactions go through **service classes** that encapsulate business logic. Never make direct fetch calls in components or remote functions.

### Service Pattern

Services are located in `/src/lib/services/` and follow this structure:

```typescript
import { ApiError, type ApiService } from './ApiService';
import type { ApiResponse } from '../dto/response';

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
```

### Available Services

- **ApiService**: Base HTTP client with authentication, token refresh, error handling
- **AuthService**: Authentication operations (login, register, refresh)
- **TaskService**: Task management operations
- **UserService**: User profile and management
- **ContestService**: Contest operations
- **SubmissionService**: Code submission handling

And probably more...

### Using Services in Remote Functions

```typescript
import { createApiClient } from '$lib/services/ApiService';
import { TaskService } from '$lib/services/TaskService';
import { getRequestEvent } from '$app/server';

const event = getRequestEvent();
const apiClient = createApiClient(event.cookies);
const taskService = new TaskService(apiClient);
```

**Key points:**

- Always create `apiClient` with `createApiClient(event.cookies)` for proper authentication
- Services handle all error states - check `result.success` before accessing data
- Services return consistent response format: `{ success, status, data?, error? }`

## Using Swagger MCP for Backend API

This project has access to the **Swagger MCP server** for exploring the backend API definition. The Swagger definition is automatically downloaded and converted from YAML to JSON during the Copilot setup steps.

### Pre-configured Files

The setup creates:
- `swagger.json` - The converted Swagger/OpenAPI definition
- `.swagger-mcp` - Configuration file with the path to swagger.json

### Available Swagger MCP Tools

#### 1. listEndpoints

Lists all available API endpoints with their HTTP methods and descriptions:

```
swagger-listEndpoints(swaggerFilePath: "/path/to/swagger.json")
```

#### 2. listEndpointModels

Shows the request/response models for a specific endpoint:

```
swagger-listEndpointModels(
  swaggerFilePath: "/path/to/swagger.json",
  path: "/groups/",
  method: "GET"
)
```

#### 3. generateModelCode

Generates TypeScript interfaces from Swagger model definitions:

```
swagger-generateModelCode(
  swaggerFilePath: "/path/to/swagger.json",
  modelName: "Group"
)
```

#### 4. generateEndpointToolCode

Generates TypeScript code for calling an API endpoint:

```
swagger-generateEndpointToolCode(
  swaggerFilePath: "/path/to/swagger.json",
  path: "/groups/",
  method: "GET"
)
```

### When to Use Swagger MCP

- **Exploring new API endpoints**: Use `listEndpoints` to discover available APIs
- **Understanding request/response formats**: Use `listEndpointModels` and `generateModelCode`
- **Creating new services**: Reference the generated TypeScript interfaces for DTOs
- **Verifying API contracts**: Ensure your service implementations match the backend API

### Example Workflow

1. List all endpoints to find the one you need:
   ```
   swagger-listEndpoints(swaggerFilePath: "swagger.json")
   ```

2. Get the models for that endpoint:
   ```
   swagger-listEndpointModels(swaggerFilePath: "swagger.json", path: "/groups/", method: "GET")
   ```

3. Generate TypeScript interface for the model:
   ```
   swagger-generateModelCode(swaggerFilePath: "swagger.json", modelName: "Group")
   ```

4. Use the generated interface to create your DTO in `/src/lib/dto/`

## Internationalization (i18n)

This project uses **Paraglide** for internationalization with support for **English (en)** and **Polish (pl)**.

### Message Files

- **Location**: `/messages/en.json` and `/messages/pl.json`
- **Naming convention**: Use snake_case with clear hierarchy
  - Example: `admin_tasks_upload_title`, `validation_email_required`, `error_default_message`

### Adding New Strings

**ALWAYS add translations to BOTH files when adding user-facing text:**

```json
// messages/en.json
{
  "feature_title": "My Feature",
  "feature_description": "This is my feature description"
}

// messages/pl.json
{
  "feature_title": "Moja Funkcja",
  "feature_description": "To jest opis mojej funkcji"
}
```

### Using Messages in Components

```typescript
import * as m from '$lib/paraglide/messages';

// Simple usage
{
  m.admin_tasks_title();
}

// With parameters
{
  m.hello_world({ name: 'User' });
}

// In validation schemas
v.pipe(v.string(m.validation_email_required()), v.email(m.validation_email_invalid()));
```

**Key points:**

- Import as `* as m` for consistency
- Never hardcode user-facing strings
- Check existing messages before adding new ones to avoid duplicates

### Dashboard Page Title Translations

Dashboard pages display their title in the layout header using the `getDashboardTitleTranslationFromPathname()` utility function. This function maps routes to translation keys.

**Location**: `/src/lib/components/dashboard/utils.ts`

#### Static Routes

For static routes, add entries to the `routeTitleMap` object:

```typescript
const routeTitleMap: Record<string, () => string> = {
  [AppRoutes.Dashboard]: () => m.header_dashboard(),
  [AppRoutes.UserProfile]: () => m.sidebar_profile(),
  [AppRoutes.AdminContests]: () => m.sidebar_admin_contests()
  // Add new static routes here
};
```

#### Dynamic Routes

For dynamic routes with parameters (e.g., `/dashboard/tasks/[taskId]` or `/dashboard/admin/contests/[contestId]/registration-requests`), add pattern matching before the static route check:

```typescript
// Check for dynamic routes
if (path.startsWith(AppRoutes.TaskDetails)) {
  return m.header_task_details();
}

// Check for admin contest registration requests
if (path.match(/^\/dashboard\/admin\/contests\/\d+\/registration-requests/)) {
  return m.admin_registration_requests_title();
}
```

**Steps to add a new dashboard page with translation:**

1. **Add translation strings** to both `messages/en.json` and `messages/pl.json`:

   ```json
   {
     "admin_registration_requests_title": "Registration Requests"
   }
   ```

2. **Update routes** in `/src/lib/routes.ts` (if needed for route constants):

   ```typescript
   export enum AppRoutes {
     AdminContestsRegistrationRequests = '/dashboard/admin/contests/'
   }
   ```

3. **Update `getDashboardTitleTranslationFromPathname()`** in `/src/lib/components/dashboard/utils.ts`:
   - For static routes: Add to `routeTitleMap`
   - For dynamic routes: Add pattern matching with regex

4. **Compile Paraglide** after adding translations:
   ```bash
   pnpm run paraglide:compile
   ```

## TypeScript Conventions

### Configuration

- **Strict mode enabled**: All type checks enforced
- **Path alias**: `$lib` → `/src/lib`, `$routes` → `/src/routes`
- **ESModules**: Use ES module syntax exclusively

### Type Patterns

```typescript
// Component props with interface
interface Props {
  title: string;
  count?: number;
  onClick?: () => void;
}

let { title, count = 0, onClick }: Props = $props();

// DTOs in /src/lib/dto/
export interface Task {
  id: number;
  title: string;
  createdAt: string;
  createdByName: string;
}

// Service response types
type ServiceResponse<T> = {
  success: boolean;
  status: number;
  data?: T;
  error?: string;
};
```

### Validation with Valibot

Use Valibot for runtime validation, especially in form schemas:

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

## Styling and Design System

### Theme Colors

The app uses a consistent color scheme defined in `/src/app.css`:

**Light mode:**

- Primary: `oklch(0.3879 0.0851 237.33)` - Deep blue
- Secondary: `oklch(0.4725 0.0809 206.34)` - Lighter blue
- Background: `oklch(0.96 0.01 79.34)` - Off-white
- Foreground: `oklch(0.14 0.046 240.5)` - Dark blue

**Dark mode:**

- Automatically switches based on `.dark` class

### Tailwind CSS 4

- Uses Tailwind CSS 4 with custom theme
- Consistent spacing: Use Tailwind utilities (`gap-4`, `p-6`, `space-y-4`)
- Border radius: Default `--radius: 0.625rem` (use `rounded-2xl`, `rounded-lg`)
- Typography: Use `text-foreground`, `text-muted-foreground`, `text-primary-foreground`

### Component Styling Patterns

**Card pattern:**

```svelte
<div class="rounded-2xl border bg-card text-card-foreground shadow-md">
  <div class="p-6">
    <!-- Content -->
  </div>
</div>
```

**Section headers:**

```svelte
<h1 class="text-3xl font-bold text-foreground">
  {m.section_title()}
</h1>
```

**Consistent spacing:**

```svelte
<div class="space-y-6">
  <div class="space-y-4">
    <!-- Subsections -->
  </div>
</div>
```

### Design Consistency

When creating new pages or components, **match the existing design style**:

- **Reference pages**: Landing page (`/src/routes/+page.svelte`), Admin tasks page (`/src/routes/dashboard/admin/tasks/+page.svelte`), Task view page (`/src/routes/dashboard/tasks/[taskId]/+page.svelte`)
- **Color usage**: Use CSS variables (`text-foreground`, `bg-primary`, `border-border`)
- **Icons**: Use Lucide icons from `@lucide/svelte`
- **Components**: Reuse common components from `/src/lib/components/common/` (LoadingSpinner, ErrorCard, EmptyState)

## Component Organization

### Structure

```
/src/lib/components/
├── common/              ← Shared utilities (LoadingSpinner, ErrorCard)
├── ui/                  ← Base UI components (button, card, dialog)
├── landing_page/        ← Landing page sections
├── dashboard/           ← Dashboard-specific components
│   ├── admin/           ← Admin-only components
│   ├── tasks/           ← Task-related components
│   ├── profile/         ← Profile components
│   └── contests/        ← Contest components
├── Header.svelte
└── Footer.svelte
```

### Common Components

**Always use these for consistency:**

```typescript
import { LoadingSpinner, ErrorCard, EmptyState } from '$lib/components/common';

// Loading state
<LoadingSpinner message="Loading tasks..." />

// Error state
<ErrorCard
  title={m.error_title()}
  error={error}
  onRetry={() => query.refresh()}
/>

// Empty state
<EmptyState
  title={m.no_items_title()}
  description={m.no_items_description()}
  icon={Upload}
/>
```

### UI Components

Base components are in `/src/lib/components/ui/` (based on shadcn-svelte):

- `Button`: Primary interactive element
- `Card`: Content containers
- `Dialog`: Modal dialogs
- `Form`, `Input`, `Label`: Form elements
- `Separator`, `Skeleton`: Layout utilities

## Code Quality

### Linting and Formatting

**Before committing, always run:**

```bash
pnpm run format  # Auto-fix formatting
pnpm run lint    # Check for issues
pnpm run check   # TypeScript + Svelte checks
```

### Prettier Configuration

- **2 spaces** for indentation
- **Single quotes** for strings
- **No trailing commas**
- **100 character** line width
- **LF** line endings

### ESLint Rules

Key rules enforced:

- TypeScript strict checks
- Svelte-specific rules (keys in each blocks, resolve() for navigation)
- No unused variables
- Consistent prop naming

### Pre-commit Hooks

The project uses pre-commit hooks (`.pre-commit-config.yaml`):

- Syntax validation
- Trailing whitespace removal
- File size checks
- YAML validation

## Development Workflow

### Package Manager

**This project uses pnpm exclusively.**

- **DO use**: `pnpm install`, `pnpm add <package>`, `pnpm remove <package>`
- **DO NOT use**: `npm install` or `yarn` - this will create wrong lockfiles
- **Lockfile**: `pnpm-lock.yaml` (managed by pnpm, never edit manually)
- **NEVER create**: `package-lock.json` or `yarn.lock`

### Scripts

```bash
pnpm install       # Install dependencies
pnpm run dev       # Start dev server
pnpm run build     # Production build
pnpm run preview   # Preview production build
pnpm run format    # Format code with Prettier
pnpm run lint      # Lint code
pnpm run check     # Type checking
```

### File Naming

- **Components**: PascalCase (e.g., `TasksList.svelte`, `ErrorCard.svelte`)
- **Remote functions**: `*.remote.ts`
- **Routes**: Use SvelteKit conventions (`+page.svelte`, `+layout.svelte`, `+error.svelte`)
- **Services**: PascalCase with `Service` suffix (e.g., `TaskService.ts`)
- **Types/DTOs**: lowercase with dashes (e.g., `task.ts`, `auth.ts`)

### Route Structure

```
/src/routes/
├── (landing)/           ← Landing pages (grouping route)
│   ├── login/
│   └── register/
├── dashboard/           ← Authenticated area
│   ├── admin/           ← Admin-only routes
│   ├── user/            ← User-specific routes
│   ├── tasks/
│   └── contests/
├── +layout.svelte       ← Root layout
├── +page.svelte         ← Home page
└── +error.svelte        ← Error page
```

## Common Patterns

### Query Pattern with Loading/Error States

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
  <!-- Render data -->
  <div>{query.current.title}</div>
{/if}
```

### Form Submission Pattern

```svelte
<script lang="ts">
  import { submitForm } from './form.remote';

  const formAction = submitForm();
</script>

<form method="POST" use:formAction.enhance>
  <input name="email" type="email" />
  <button type="submit" disabled={formAction.submitting}> Submit </button>
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

## Key Files Reference

- **Routes with remote functions**: `/src/routes/dashboard/admin/tasks/+page.svelte` + `tasks.remote.ts`
- **Form with validation**: `/src/routes/(landing)/login/+page.svelte` + `login.remote.ts`
- **Service example**: `/src/lib/services/TaskService.ts`
- **API client**: `/src/lib/services/ApiService.ts`
- **Styling**: `/src/app.css`
- **Landing page style**: `/src/routes/+page.svelte`
- **Common components**: `/src/lib/components/common/`

## Authentication

- JWT tokens stored in HTTP-only cookies
- Token refresh handled automatically in `ApiService`
- Use `TokenManager` for cookie operations
- All API requests include authentication via `createApiClient(cookies)`

## Important Notes

1. **Always use remote functions** for server-side operations - don't use `+page.server.ts` unless absolutely necessary
2. **Always use services** - never make direct fetch calls
3. **Always add i18n strings to both languages** - check existing messages first
4. **Match the existing design** - refer to landing, admin, and task pages for styling
5. **Use Svelte 5 runes** - no legacy reactive syntax
6. **Run linting before committing** - but existing lint warnings are not your responsibility to fix
7. **Keep components focused** - extract reusable pieces to `/src/lib/components/`
8. **Validate with Valibot** - especially for form inputs
