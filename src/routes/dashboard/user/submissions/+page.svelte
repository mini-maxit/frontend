<script lang="ts">
  import { getSubmissions } from './submissions.remote';
  import { SubmissionsList } from '$lib/components/dashboard/submissions';
  import { LoadingSpinner, ErrorCard, EmptyState } from '$lib/components/common';
  import FileQuestion from '@lucide/svelte/icons/file-question';
  import * as m from '$lib/paraglide/messages';

  const submissionsQuery = getSubmissions();
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
        card
        iconBackground
      />
    {:else if submissionsQuery.loading}
      <LoadingSpinner message={m.submissions_loading()} card size="h-12 w-12" />
    {:else if submissionsQuery.current && submissionsQuery.current.length === 0}
      <EmptyState
        title={m.submissions_empty_title()}
        description={m.submissions_empty_description()}
        icon={FileQuestion}
        card
        iconBackground
      />
    {:else if submissionsQuery.current}
      <SubmissionsList submissions={submissionsQuery.current} />
    {/if}
  </div>
</div>
