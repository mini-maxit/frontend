<script lang="ts">
  import { getSubmissions } from './submissions.remote';
  import {
    SubmissionsList,
    SubmissionsErrorCard,
    SubmissionsLoadingSpinner,
    SubmissionsEmptyState
  } from '$lib/components/dashboard/submissions';
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
      <SubmissionsErrorCard
        error={submissionsQuery.error}
        onRetry={() => submissionsQuery.refresh()}
      />
    {:else if submissionsQuery.loading}
      <SubmissionsLoadingSpinner />
    {:else if submissionsQuery.current && submissionsQuery.current.length === 0}
      <SubmissionsEmptyState />
    {:else if submissionsQuery.current}
      <SubmissionsList submissions={submissionsQuery.current} />
    {/if}
  </div>
</div>
