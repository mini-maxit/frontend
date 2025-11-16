<script lang="ts">
  import * as Card from '$lib/components/ui/card';
  import { Button } from '$lib/components/ui/button';
  import Target from '@lucide/svelte/icons/target';
  import TrendingUp from '@lucide/svelte/icons/trending-up';
  import Code from '@lucide/svelte/icons/code';
  import * as m from '$lib/paraglide/messages';
  import { AppRoutes } from '$lib/routes';
  import { localizeHref } from '$lib/paraglide/runtime';

  interface UserTaskCardProps {
    contestId: number;
    id: number;
    title: string;
    createdAt: string;
    attemptCount: number;
    bestScore: number;
  }

  let { contestId, id, title, createdAt, attemptCount, bestScore }: UserTaskCardProps = $props();

  const scorePercentage = $derived(bestScore);
  const hasAttempts = $derived(attemptCount > 0);
</script>

<Card.Root
  class="group relative flex h-full flex-col overflow-hidden shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
>
  <!-- Gradient Background Overlay -->
  <div
    class="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
  ></div>

  <Card.Header class="relative">
    <Card.Title class="text-lg transition-colors group-hover:text-primary">
      {title}
    </Card.Title>
    <p class="mt-1 text-xs text-muted-foreground">
      {m.tasks_card_created()}
      {new Date(createdAt).toLocaleDateString()}
    </p>
  </Card.Header>

  <Card.Content class="relative mt-auto space-y-4">
    {#if hasAttempts}
      <!-- Score Display -->
      <div class="space-y-2">
        <div class="flex items-center justify-between text-sm">
          <span class="flex items-center gap-1.5 text-muted-foreground">
            <Target class="h-3.5 w-3.5" />
            {m.contest_task_best_score()}
          </span>
          <span class="font-bold text-foreground">
            {bestScore}%
          </span>
        </div>
        <!-- Progress Bar -->
        <div class="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            class="h-full rounded-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-500"
            style="width: {scorePercentage}%"
          ></div>
        </div>
      </div>

      <!-- Attempts -->
      <div class="rounded-lg border border-border bg-card p-3 transition-colors hover:bg-accent">
        <div class="flex items-center justify-between">
          <span class="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <TrendingUp class="h-3.5 w-3.5 text-primary" />
            {m.contest_task_attempts()}
          </span>
          <span class="text-sm font-bold text-foreground">{attemptCount}</span>
        </div>
      </div>
    {:else}
      <!-- Not Started Placeholder -->
      <div class="rounded-lg border-2 border-dashed border-border bg-muted/30 p-6 text-center">
        <Code class="mx-auto h-8 w-8 text-muted-foreground" />
        <p class="mt-2 text-sm text-muted-foreground">{m.user_tasks_no_attempts()}</p>
      </div>
    {/if}

    <!-- Action Button -->
    <Button
      variant={hasAttempts ? 'outline' : 'default'}
      size="sm"
      class="w-full"
      href={localizeHref(`${AppRoutes.UserContestTask}${contestId}/tasks/${id}`)}
    >
      {m.tasks_card_view()}
    </Button>
  </Card.Content>
</Card.Root>
