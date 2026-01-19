import { browser } from '$app/environment';

/**
 * Query result interface exposing reactive state
 */
export interface Query<T> {
  readonly current: T | null;
  readonly loading: boolean;
  readonly error: Error | null;
  refresh: () => Promise<void>;
}

/**
 * Create a reactive query that fetches data and manages loading/error states
 * Works in both SSR and CSR contexts, but only auto-fetches in browser
 *
 * @param fetcher - Async function that fetches the data
 * @returns Query object with current data, loading state, error state, and refresh function
 *
 * @example
 * ```typescript
 * const tasksQuery = createQuery(async () => {
 *   const service = getClientTaskInstance();
 *   if (!service) throw new Error('Service unavailable');
 *   const result = await service.getAllTasks();
 *   if (!result.success) throw new Error(result.error || 'Failed to fetch');
 *   return result.data!;
 * });
 *
 * // In template:
 * {#if tasksQuery.error}
 *   <ErrorCard error={tasksQuery.error} onRetry={() => tasksQuery.refresh()} />
 * {:else if tasksQuery.loading}
 *   <LoadingSpinner />
 * {:else if tasksQuery.current}
 *   <TasksList tasks={tasksQuery.current} />
 * {/if}
 * ```
 */
export function createQuery<T>(fetcher: () => Promise<T>): Query<T> {
  let current = $state<T | null>(null);
  let loading = $state(true);
  let error = $state<Error | null>(null);

  async function fetchData(): Promise<void> {
    loading = true;
    error = null;
    try {
      const data = await fetcher();
      current = data;
    } catch (e) {
      error = e instanceof Error ? e : new Error('Unknown error occurred');
      current = null;
      console.error('Query error:', e);
    } finally {
      loading = false;
    }
  }

  // Auto-fetch on creation (browser only for client-side queries)
  if (browser) {
    fetchData();
  }

  return {
    get current() {
      return current;
    },
    get loading() {
      return loading;
    },
    get error() {
      return error;
    },
    refresh: fetchData
  };
}

/**
 * Create a parameterized query that automatically refetches when parameters change
 * Works in both SSR and CSR contexts, but only auto-fetches in browser
 *
 * @param param - Parameter value that the query depends on
 * @param fetcher - Async function that fetches data using the parameter
 * @returns Query object with current data, loading state, error state, and refresh function
 *
 * @example
 * ```typescript
 * const taskId = $derived(Number(page.params.taskId));
 *
 * const taskQuery = createParameterizedQuery(
 *   taskId,
 *   async (id) => {
 *     const service = getClientTaskInstance();
 *     if (!service) throw new Error('Service unavailable');
 *     const result = await service.getTaskById(id);
 *     if (!result.success) throw new Error(result.error || 'Failed to fetch');
 *     return result.data!;
 *   }
 * );
 * ```
 */
export function createParameterizedQuery<T, P>(
  param: P,
  fetcher: (param: P) => Promise<T>
): Query<T> {
  let current = $state<T | null>(null);
  let loading = $state(true);
  let error = $state<Error | null>(null);

  // Watch parameter changes and refetch automatically
  // This properly tracks reactive parameters like $derived values
  $effect(() => {
    // Access param to establish reactivity
    const currentParam = param;

    if (!browser) return;

    loading = true;
    error = null;

    fetcher(currentParam)
      .then((data) => {
        current = data;
        loading = false;
      })
      .catch((e) => {
        error = e instanceof Error ? e : new Error('Unknown error occurred');
        current = null;
        loading = false;
        console.error('Parameterized query error:', e);
      });
  });

  // Manual refresh function that uses current param value
  async function refresh(): Promise<void> {
    if (!browser) return;

    loading = true;
    error = null;

    try {
      const data = await fetcher(param);
      current = data;
    } catch (e) {
      error = e instanceof Error ? e : new Error('Unknown error occurred');
      current = null;
      console.error('Parameterized query error:', e);
    } finally {
      loading = false;
    }
  }

  return {
    get current() {
      return current;
    },
    get loading() {
      return loading;
    },
    get error() {
      return error;
    },
    refresh
  };
}
