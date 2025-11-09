<script lang="ts">
  import { getWorkerStatus } from './worker-status.remote';
  import { LoadingSpinner, ErrorCard } from '$lib/components/common';
  import * as m from '$lib/paraglide/messages';
  import { formatDistanceToNow } from 'date-fns';

  const workerStatusQuery = getWorkerStatus();
</script>

<div class="space-y-6">
  <div class="flex items-center justify-between">
    <h1 class="text-3xl font-bold text-foreground">{m.admin_dashboard_title()}</h1>
  </div>

  <!-- System Monitoring Section -->
  <div class="space-y-4">
    <h2 class="text-2xl font-bold text-foreground">{m.admin_dashboard_system_monitoring()}</h2>

    {#if workerStatusQuery.error}
      <ErrorCard
        title={m.admin_dashboard_worker_status_error()}
        error={workerStatusQuery.error}
        onRetry={() => workerStatusQuery.refresh()}
      />
    {:else if workerStatusQuery.loading}
      <LoadingSpinner />
    {:else if workerStatusQuery.current}
      {@const status = workerStatusQuery.current}
      {@const availableWorkers = status.totalWorkers - status.busyWorkers}

      <div class="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
        <h3 class="mb-4 text-xl font-semibold">{m.admin_dashboard_worker_status()}</h3>

        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <!-- Total Workers -->
          <div class="rounded-md bg-muted/50 p-4">
            <p class="text-sm text-muted-foreground">{m.admin_dashboard_total_workers()}</p>
            <p class="mt-1 text-3xl font-bold">{status.totalWorkers}</p>
          </div>

          <!-- Busy Workers -->
          <div class="rounded-md bg-muted/50 p-4">
            <p class="text-sm text-muted-foreground">{m.admin_dashboard_busy_workers()}</p>
            <p class="mt-1 text-3xl font-bold text-orange-600 dark:text-orange-400">
              {status.busyWorkers}
            </p>
          </div>

          <!-- Available Workers -->
          <div class="rounded-md bg-muted/50 p-4">
            <p class="text-sm text-muted-foreground">{m.admin_dashboard_available_workers()}</p>
            <p class="mt-1 text-3xl font-bold text-green-600 dark:text-green-400">
              {availableWorkers}
            </p>
          </div>
        </div>

        <!-- Last Updated -->
        <div class="mt-4 text-sm text-muted-foreground">
          {m.admin_dashboard_last_updated()}:
          {formatDistanceToNow(new Date(status.statusTime), { addSuffix: true })}
        </div>

        <!-- Worker Details -->
        {#if Object.keys(status.workerStatus).length > 0}
          <div class="mt-6">
            <h4 class="mb-3 text-lg font-semibold">{m.admin_dashboard_worker_details()}</h4>
            <div class="space-y-2">
              {#each Object.entries(status.workerStatus) as [workerId, workerState] (workerId)}
                <div class="flex items-center justify-between rounded-md bg-muted/50 p-3">
                  <span class="font-medium">{workerId}</span>
                  <span
                    class="rounded-full px-3 py-1 text-xs font-semibold"
                    class:bg-green-100={workerState === 'idle'}
                    class:text-green-800={workerState === 'idle'}
                    class:dark:bg-green-900={workerState === 'idle'}
                    class:dark:text-green-200={workerState === 'idle'}
                    class:bg-orange-100={workerState === 'busy'}
                    class:text-orange-800={workerState === 'busy'}
                    class:dark:bg-orange-900={workerState === 'busy'}
                    class:dark:text-orange-200={workerState === 'busy'}
                  >
                    {workerState}
                  </span>
                </div>
              {/each}
            </div>
          </div>
        {/if}
      </div>
    {/if}
  </div>
</div>
