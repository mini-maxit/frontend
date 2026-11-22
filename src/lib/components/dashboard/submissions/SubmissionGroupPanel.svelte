<script lang="ts">
  import SubmissionsList from './SubmissionsList.svelte';
  import { createParameterizedQuery } from '#lib/utils/query.svelte.js';
  import { getSubmissionInstance } from '#lib/services/index.js';
  import { LoadingSpinner, ErrorCard } from '#lib/components/common/index.js';
  import { Button } from '#lib/components/ui/button/index.js';
  import type { SubmissionGroup, SubmissionGroupBy } from '#lib/dto/submission.js';
  import { formatDate } from '#lib/utils.js';
  import ChevronDown from '@lucide/svelte/icons/chevron-down';
  import * as m from '#lib/paraglide/messages.js';

  interface SubmissionGroupPanelProps {
    userId: number;
    groupBy: SubmissionGroupBy;
    group: SubmissionGroup;
  }

  let { userId, groupBy, group }: SubmissionGroupPanelProps = $props();

  const PAGE = 10;
  const submissionService = getSubmissionInstance();
  // Sticky: stays true after the first expand so closing doesn't drop loaded submissions.
  let opened = $state(false);
  let limit = $state(PAGE);

  // Maps a group key back to the list filter that selects exactly that group's submissions.
  const groupFilter = $derived(groupBy === 'task' ? { taskId: Number(group.key) } : {});

  const query = createParameterizedQuery(
    () => ({ opened, limit, filter: groupFilter }),
    async ({ opened, limit, filter }) => {
      if (!opened) return null;
      if (!submissionService) throw new Error('Service unavailable');
      const result = await submissionService.getUserSubmissions(userId, {
        limit,
        offset: 0,
        ...filter
      });
      if (!result.success) throw new Error(result.error || 'Failed to fetch submissions');
      return result.data!;
    }
  );

  const items = $derived(query.current?.items ?? []);
  const total = $derived(query.current?.pagination.totalItems ?? group.count);
</script>

<details
  class="group rounded-lg border bg-card"
  ontoggle={(e) => {
    // Read the element itself: a bind:open value isn't updated yet when this handler runs.
    if (e.currentTarget.open) opened = true;
  }}
>
  <summary
    class="flex cursor-pointer list-none items-center justify-between gap-2 px-4 py-3 text-foreground [&::-webkit-details-marker]:hidden"
  >
    <span class="min-w-0 truncate font-semibold">
      {group.label}
      <span class="ml-1 text-sm font-normal text-muted-foreground">({group.count})</span>
    </span>
    <span class="flex shrink-0 items-center gap-3 text-sm text-muted-foreground">
      <span class="hidden sm:inline">{formatDate(group.lastSubmittedAt)}</span>
      <ChevronDown class="h-4 w-4 transition-transform group-open:rotate-180" />
    </span>
  </summary>

  <div class="space-y-3 border-t p-4">
    {#if query.error}
      <ErrorCard
        title={m.submissions_load_error()}
        error={query.error}
        onRetry={() => query.refresh()}
      />
    {:else if query.loading && items.length === 0}
      <LoadingSpinner />
    {:else}
      <SubmissionsList submissions={items} />
      {#if items.length < total}
        <div class="flex justify-center">
          <Button
            variant="outline"
            size="sm"
            disabled={query.loading}
            onclick={() => (limit += PAGE)}
          >
            {m.admin_user_activity_load_more({ shown: items.length, total })}
          </Button>
        </div>
      {/if}
    {/if}
  </div>
</details>
