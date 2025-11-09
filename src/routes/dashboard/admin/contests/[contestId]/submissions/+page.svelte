<script lang="ts">
  import { getContestSubmissions } from './submissions.remote';
  import { LoadingSpinner, ErrorCard, EmptyState } from '$lib/components/common';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import * as Card from '$lib/components/ui/card';
  import FileText from '@lucide/svelte/icons/file-text';
  import X from '@lucide/svelte/icons/x';
  import User from '@lucide/svelte/icons/user';
  import ListTodo from '@lucide/svelte/icons/list-todo';
  import * as m from '$lib/paraglide/messages';
  import { formatDate } from '$lib/utils';
  import { SubmissionStatus } from '$lib/dto/submission';
  import Label from '$lib/components/ui/label/label.svelte';

  interface Props {
    data: {
      contestId: number;
    };
  }

  let { data }: Props = $props();

  // Filters
  let userFilter = $state('');
  let taskFilter = $state('');

  // Query submissions - using fixed limit for now
  const submissionsQuery = getContestSubmissions({
    contestId: data.contestId,
    limit: 1000,
    offset: 0
  });

  // Filtered submissions
  const filteredSubmissions = $derived.by(() => {
    if (!submissionsQuery.current) return [];

    return submissionsQuery.current.filter((submission) => {
      const matchesUser =
        !userFilter ||
        submission.user.username.toLowerCase().includes(userFilter.toLowerCase()) ||
        submission.user.name.toLowerCase().includes(userFilter.toLowerCase()) ||
        submission.user.surname.toLowerCase().includes(userFilter.toLowerCase());

      const matchesTask =
        !taskFilter ||
        submission.task.title.toLowerCase().includes(taskFilter.toLowerCase()) ||
        submission.task.id.toString().includes(taskFilter);

      return matchesUser && matchesTask;
    });
  });

  function clearFilters() {
    userFilter = '';
    taskFilter = '';
  }

  function getStatusColor(status: string): string {
    switch (status) {
      case SubmissionStatus.Evaluated:
        return 'bg-primary/10 text-primary';
      case SubmissionStatus.SentForEvaluation:
        return 'bg-secondary/10 text-secondary-foreground';
      case SubmissionStatus.Received:
        return 'bg-accent/10 text-accent-foreground';
      case SubmissionStatus.Lost:
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  }

  function getResultBadgeColor(code: string): string {
    if (code.toLowerCase().includes('success') || code.toLowerCase().includes('accepted')) {
      return 'bg-primary/10 text-primary';
    }
    if (code.toLowerCase().includes('error') || code.toLowerCase().includes('failed')) {
      return 'bg-muted text-muted-foreground';
    }
    return 'bg-muted text-muted-foreground';
  }
</script>

<div class="space-y-6">
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-3xl font-bold text-foreground">
        {m.admin_contest_submissions_title()}
      </h1>
      <p class="mt-2 text-muted-foreground">
        {m.admin_contest_submissions_subtitle()}
      </p>
    </div>
  </div>

  <!-- Filters and Export -->
  <Card.Root>
    <Card.Content class="pt-6">
      <div class="flex flex-wrap items-end gap-4">
        <!-- User Filter -->
        <div class="min-w-[200px] flex-1">
          <Label for="userFilter" class="mb-2 block text-sm font-medium">
            {m.admin_contest_submissions_filter_by_user()}
          </Label>
          <Input
            id="userFilter"
            type="text"
            placeholder={m.admin_contest_submissions_placeholder_user()}
            bind:value={userFilter}
          />
        </div>

        <!-- Task Filter -->
        <div class="min-w-[200px] flex-1">
          <Label for="taskFilter" class="mb-2 block text-sm font-medium">
            {m.admin_contest_submissions_filter_by_task()}
          </Label>
          <Input
            id="taskFilter"
            type="text"
            placeholder={m.admin_contest_submissions_placeholder_task()}
            bind:value={taskFilter}
          />
        </div>

        <!-- Clear Filters -->
        <div class="flex gap-2">
          <Button variant="outline" onclick={clearFilters}>
            <X class="mr-2 h-4 w-4" />
            {m.admin_contest_submissions_clear_filters()}
          </Button>
        </div>
      </div>
    </Card.Content>
  </Card.Root>

  <!-- Submissions List -->
  {#if submissionsQuery.error}
    <ErrorCard
      title={m.admin_contest_submissions_load_error()}
      error={submissionsQuery.error}
      onRetry={() => submissionsQuery.refresh()}
    />
  {:else if submissionsQuery.loading}
    <LoadingSpinner message={m.admin_contest_submissions_loading()} />
  {:else if !filteredSubmissions.length}
    <EmptyState
      title={m.admin_contest_submissions_no_submissions_title()}
      description={m.admin_contest_submissions_no_submissions_description()}
      icon={FileText}
    />
  {:else}
    <div class="space-y-4">
      {#each filteredSubmissions as submission (submission.id)}
        <Card.Root class="transition-shadow hover:shadow-md">
          <Card.Content class="pt-6">
            <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <!-- Submission ID & Status -->
              <div class="space-y-2">
                <div class="flex items-center gap-2">
                  <span class="text-sm font-medium text-muted-foreground"
                    >{m.admin_contest_submissions_id_label()}</span
                  >
                  <span class="font-bold text-foreground">#{submission.id}</span>
                </div>
                <span
                  class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium {getStatusColor(
                    submission.status
                  )}"
                >
                  {submission.status}
                </span>
              </div>

              <!-- User Info -->
              <div class="space-y-1">
                <div class="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <User class="h-4 w-4" />
                  <span>{m.admin_contest_submissions_user()}</span>
                </div>
                <div class="flex flex-col">
                  <span class="font-medium text-foreground">{submission.user.username}</span>
                  <span class="text-sm text-muted-foreground">
                    {submission.user.name}
                    {submission.user.surname}
                  </span>
                </div>
              </div>

              <!-- Task Info -->
              <div class="space-y-1">
                <div class="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <ListTodo class="h-4 w-4" />
                  <span>{m.admin_contest_submissions_task()}</span>
                </div>
                <div class="flex flex-col">
                  <span class="font-medium text-foreground">{submission.task.title}</span>
                  <span class="text-sm text-muted-foreground"
                    >{m.admin_contest_submissions_task_id_label()} {submission.task.id}</span
                  >
                </div>
              </div>

              <!-- Language & Submission Time -->
              <div class="space-y-2">
                <div>
                  <div class="text-sm font-medium text-muted-foreground">
                    {m.admin_contest_submissions_language()}
                  </div>
                  <div class="text-foreground">
                    {submission.language.language}
                    {submission.language.version}
                  </div>
                </div>
                <div>
                  <div class="text-sm font-medium text-muted-foreground">
                    {m.admin_contest_submissions_submitted_at()}
                  </div>
                  <div class="text-foreground">{formatDate(submission.submittedAt)}</div>
                </div>
              </div>
            </div>

            <!-- Result Section -->
            {#if submission.result}
              <div class="mt-4 border-t pt-4">
                <div class="text-sm font-medium text-muted-foreground">
                  {m.admin_contest_submissions_result()}
                </div>
                <div class="mt-2 flex flex-wrap items-center gap-2">
                  <span
                    class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium {getResultBadgeColor(
                      submission.result.code
                    )}"
                  >
                    {submission.result.code}
                  </span>
                  {#if submission.result.testResults}
                    <span class="text-sm text-muted-foreground">
                      {m.admin_contest_submissions_tests_passed({
                        passed: submission.result.testResults.filter((t) => t.passed).length,
                        total: submission.result.testResults.length
                      })}
                    </span>
                  {/if}
                </div>
                {#if submission.result.message}
                  <p class="mt-2 text-sm text-muted-foreground">{submission.result.message}</p>
                {/if}
              </div>
            {/if}
          </Card.Content>
        </Card.Root>
      {/each}

      <!-- Results count -->
      <div class="text-center text-sm text-muted-foreground">
        {filteredSubmissions.length === 1
          ? m.admin_contest_submissions_showing_count({ count: filteredSubmissions.length })
          : m.admin_contest_submissions_showing_count_plural({ count: filteredSubmissions.length })}
      </div>
    </div>
  {/if}
</div>
