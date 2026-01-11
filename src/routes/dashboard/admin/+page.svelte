<script lang="ts">
  import { getWorkerStatus } from './worker-status.remote';
  import { LoadingSpinner, ErrorCard } from '$lib/components/common';
  import * as Card from '$lib/components/ui/card';
  import * as m from '$lib/paraglide/messages';
  import { formatDistanceToNow } from 'date-fns';
  import Server from '@lucide/svelte/icons/server';
  import Activity from '@lucide/svelte/icons/activity';
  import CheckCircle from '@lucide/svelte/icons/check-circle';
  import Clock from '@lucide/svelte/icons/clock';
  import { WorkerStatusType } from '$lib/dto/worker';

  const workerStatusQuery = getWorkerStatus();

  // Status styling configuration
  const statusStyles = {
    [WorkerStatusType.Idle]: 'bg-primary/10 text-primary',
    [WorkerStatusType.Busy]: 'bg-secondary/10 text-secondary-foreground'
  } as const;

  function getStatusStyle(status: WorkerStatusType): string {
    return statusStyles[status] || 'bg-muted/10 text-muted-foreground';
  }
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

      <!-- Worker Stats Cards -->
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <!-- Total Workers -->
        <Card.Root
          class="group relative overflow-hidden shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
        >
          <div
            class="absolute inset-0 bg-linear-to-br from-(--primary)/5 via-(--secondary)/5 to-(--primary)/10 opacity-30 transition-opacity duration-300 group-hover:opacity-50"
          ></div>

          <Card.Content class="relative p-6">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <p class="text-sm font-medium text-muted-foreground">
                  {m.admin_dashboard_total_workers()}
                </p>
                <p class="mt-2 text-4xl font-bold text-foreground">{status.totalWorkers}</p>
                <p class="mt-1 text-xs text-muted-foreground">
                  {m.admin_dashboard_total_workers_description()}
                </p>
              </div>
              <div
                class="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-primary to-secondary shadow-md transition-transform duration-300 group-hover:scale-110"
              >
                <Server class="h-6 w-6 text-primary-foreground" />
              </div>
            </div>

            <!-- Progress bar -->
            <div class="mt-4 h-1 w-full overflow-hidden rounded-full bg-muted">
              <div
                class="h-full origin-left scale-x-0 transform rounded-full bg-linear-to-r from-primary to-secondary transition-transform duration-500 group-hover:scale-x-100"
              ></div>
            </div>
          </Card.Content>
        </Card.Root>

        <!-- Busy Workers -->
        <Card.Root
          class="group relative overflow-hidden shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
        >
          <div
            class="absolute inset-0 bg-linear-to-br from-(--primary)/5 via-(--secondary)/5 to-(--primary)/10 opacity-30 transition-opacity duration-300 group-hover:opacity-50"
          ></div>

          <Card.Content class="relative p-6">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <p class="text-sm font-medium text-muted-foreground">
                  {m.admin_dashboard_busy_workers()}
                </p>
                <p class="mt-2 text-4xl font-bold text-foreground">{status.busyWorkers}</p>
                <p class="mt-1 text-xs text-muted-foreground">
                  {m.admin_dashboard_busy_workers_description()}
                </p>
              </div>
              <div
                class="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-primary to-secondary shadow-md transition-transform duration-300 group-hover:scale-110"
              >
                <Activity class="h-6 w-6 text-primary-foreground" />
              </div>
            </div>

            <!-- Progress bar -->
            <div class="mt-4 h-1 w-full overflow-hidden rounded-full bg-muted">
              <div
                class="h-full origin-left scale-x-0 transform rounded-full bg-linear-to-r from-primary to-secondary transition-transform duration-500 group-hover:scale-x-100"
              ></div>
            </div>
          </Card.Content>
        </Card.Root>

        <!-- Available Workers -->
        <Card.Root
          class="group relative overflow-hidden shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
        >
          <div
            class="absolute inset-0 bg-linear-to-br from-(--primary)/5 via-(--secondary)/5 to-(--primary)/10 opacity-30 transition-opacity duration-300 group-hover:opacity-50"
          ></div>

          <Card.Content class="relative p-6">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <p class="text-sm font-medium text-muted-foreground">
                  {m.admin_dashboard_available_workers()}
                </p>
                <p class="mt-2 text-4xl font-bold text-foreground">{availableWorkers}</p>
                <p class="mt-1 text-xs text-muted-foreground">
                  {m.admin_dashboard_available_workers_description()}
                </p>
              </div>
              <div
                class="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-primary to-secondary shadow-md transition-transform duration-300 group-hover:scale-110"
              >
                <CheckCircle class="h-6 w-6 text-primary-foreground" />
              </div>
            </div>

            <!-- Progress bar -->
            <div class="mt-4 h-1 w-full overflow-hidden rounded-full bg-muted">
              <div
                class="h-full origin-left scale-x-0 transform rounded-full bg-linear-to-r from-primary to-secondary transition-transform duration-500 group-hover:scale-x-100"
              ></div>
            </div>
          </Card.Content>
        </Card.Root>
      </div>

      <!-- Worker Details Card -->
      {#if status.workerStatus.length > 0}
        <Card.Root
          class="group relative overflow-hidden border-border shadow-md transition-all duration-300 hover:shadow-lg"
        >
          <!-- Gradient Background Overlay -->
          <div
            class="absolute inset-0 bg-linear-to-br from-(--primary)/5 via-(--secondary)/5 to-(--primary)/10 opacity-30 transition-opacity duration-300 group-hover:opacity-50"
          ></div>

          <Card.Header class="relative">
            <Card.Title class="flex items-center gap-2 text-xl">
              <Server class="h-5 w-5" />
              {m.admin_dashboard_worker_details()}
            </Card.Title>
            <div class="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
              <Clock class="h-4 w-4" />
              {m.admin_dashboard_last_updated()}:
              {formatDistanceToNow(new Date(status.statusTime), { addSuffix: true })}
            </div>
          </Card.Header>

          <Card.Content class="relative">
            <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {#each status.workerStatus as worker (worker.id)}
                <div
                  class="group/item relative overflow-hidden rounded-lg border border-border bg-card p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                >
                  <div
                    class="absolute inset-0 bg-linear-to-br from-primary to-secondary opacity-5 transition-opacity duration-300 group-hover/item:opacity-10"
                  ></div>

                  <div class="relative space-y-2">
                    <div class="flex items-center justify-between">
                      <p class="font-mono text-sm font-medium text-foreground">
                        {m.admin_dashboard_worker_id({ id: worker.id })}
                      </p>
                      <span
                        class="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold shadow-sm {getStatusStyle(
                          worker.status
                        )}"
                      >
                        {worker.status}
                      </span>
                    </div>
                    {#if worker.processingMessageId}
                      <div class="text-xs text-muted-foreground">
                        <span class="font-medium">{m.admin_dashboard_worker_processing()}</span>
                        <span class="font-mono">{worker.processingMessageId}</span>
                      </div>
                    {/if}
                  </div>
                </div>
              {/each}
            </div>
          </Card.Content>
        </Card.Root>
      {/if}
    {/if}
  </div>
</div>
