<script lang="ts">
  import { createParameterizedQuery } from '#lib/utils/query.svelte.js';
  import { getSubmissionInstance } from '#lib/services/index.js';
  import { SubmissionsList } from '#lib/components/dashboard/submissions/index.js';
  import { LoadingSpinner, ErrorCard, EmptyState } from '#lib/components/common/index.js';
  import { Button } from '#lib/components/ui/button/index.js';
  import { formatUserName } from '#lib/utils/user.js';
  import { localizeHref } from '#lib/paraglide/runtime.js';
  import { page } from '$app/state';
  import FileQuestion from '@lucide/svelte/icons/file-question';
  import ArrowLeft from '@lucide/svelte/icons/arrow-left';
  import * as m from '#lib/paraglide/messages.js';

  const LIMIT = 20;
  const submissionService = getSubmissionInstance();
  const userId = $derived(Number(page.params.userId));
  let offset = $state(0);

  const activityQuery = createParameterizedQuery(
    () => ({ userId, offset }),
    async ({ userId, offset }) => {
      if (!submissionService) throw new Error('Service unavailable');
      const result = await submissionService.getUserSubmissions(userId, { limit: LIMIT, offset });
      if (!result.success) throw new Error(result.error || 'Failed to fetch submissions');
      return result.data!;
    }
  );

  const submissions = $derived(activityQuery.current?.items ?? []);
  const total = $derived(activityQuery.current?.pagination.totalItems ?? 0);
  const user = $derived(submissions[0]?.user);
</script>

<div class="space-y-6">
  <div class="space-y-2">
    <Button variant="ghost" size="sm" href={localizeHref('/dashboard/admin/users')}>
      <ArrowLeft class="h-4 w-4" />
      {m.admin_users_title()}
    </Button>
    <h1 class="text-3xl font-bold text-foreground">
      {m.admin_user_activity_title()}: {user ? formatUserName(user) : `#${userId}`}
    </h1>
  </div>

  {#if activityQuery.error}
    <ErrorCard
      title={m.submissions_load_error()}
      error={activityQuery.error}
      onRetry={() => activityQuery.refresh()}
    />
  {:else if activityQuery.loading}
    <LoadingSpinner />
  {:else if submissions.length === 0}
    <EmptyState
      title={m.admin_user_activity_empty()}
      description={m.submissions_empty_description()}
      icon={FileQuestion}
    />
  {:else}
    <SubmissionsList {submissions} />
    <div class="flex items-center justify-between text-sm text-muted-foreground">
      <span>
        {m.admin_users_pagination_showing_range({
          from: offset + 1,
          to: offset + submissions.length,
          total
        })}
      </span>
      <div class="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={offset === 0}
          onclick={() => (offset = Math.max(0, offset - LIMIT))}
        >
          {m.admin_users_pagination_prev()}
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={offset + LIMIT >= total}
          onclick={() => (offset += LIMIT)}
        >
          {m.admin_users_pagination_next()}
        </Button>
      </div>
    </div>
  {/if}
</div>
