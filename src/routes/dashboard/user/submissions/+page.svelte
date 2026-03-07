<script lang="ts">
  import { createQuery } from '$lib/utils/query.svelte';
  import { getSubmissionInstance } from '$lib/services';
  import { SubmissionsList } from '$lib/components/dashboard/submissions';
  import { LoadingSpinner, ErrorCard, EmptyState } from '$lib/components/common';
  import FileQuestion from '@lucide/svelte/icons/file-question';
  import * as m from '$lib/paraglide/messages';

  const submissionService = getSubmissionInstance();
  const submissionsQuery = createQuery(async () => {
    if (!submissionService) throw new Error('Service unavailable');
    const result = await submissionService.getMySubmissions();
    if (!result.success) throw new Error(result.error || 'Failed to fetch submissions');
    return result.data!;
  });
</script>

<div class="space-y-8 p-4 sm:p-6 lg:p-8">
  <!-- Page Header -->
  <div class="space-y-2">
    <h1 class="text-4xl font-bold tracking-tight text-foreground">
      {m.submissions_page_title()}
    </h1>
    <p class="text-lg text-muted-foreground">
      {m.submissions_page_description()}
    </p>
  </div>

  <!-- Submissions List -->
  <div class="space-y-4">
    <h2 class="text-2xl font-bold text-foreground">{m.submissions_all_submissions()}</h2>

    {#if submissionsQuery.error}
      <ErrorCard
        title={m.submissions_load_error()}
        error={submissionsQuery.error}
        onRetry={() => submissionsQuery.refresh()}
        inCard
        iconBackground
      />
    {:else if submissionsQuery.loading}
      <LoadingSpinner message={m.submissions_loading()} inCard size="h-12 w-12" />
    {:else if submissionsQuery.current && submissionsQuery.current.length === 0}
      <EmptyState
        title={m.submissions_empty_title()}
        description={m.submissions_empty_description()}
        icon={FileQuestion}
        inCard
        iconBackground
      />
    {:else if submissionsQuery.current}
      <SubmissionsList submissions={submissionsQuery.current} />
    {/if}
  </div>
</div>
