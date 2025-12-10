<script lang="ts">
  import { getContestSubmissions } from './submissions.remote';
  import { LoadingSpinner, ErrorCard, EmptyState } from '$lib/components/common';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import * as Card from '$lib/components/ui/card';
  import * as Pagination from '$lib/components/ui/pagination';
  import FileText from '@lucide/svelte/icons/file-text';
  import X from '@lucide/svelte/icons/x';
  import User from '@lucide/svelte/icons/user';
  import ListTodo from '@lucide/svelte/icons/list-todo';
  import ChevronDown from '@lucide/svelte/icons/chevron-down';
  import ChevronUp from '@lucide/svelte/icons/chevron-up';
  import * as m from '$lib/paraglide/messages';
  import { formatDate } from '$lib/utils';
  import { SubmissionStatus } from '$lib/dto/submission';
  import Label from '$lib/components/ui/label/label.svelte';
  import { getPaginationPages, getCurrentPage, getTotalPages, getOffset } from '$lib/utils';
  import TestCaseResult from '$lib/components/dashboard/submissions/TestCaseResult.svelte';

  interface Props {
    data: {
      contestId: number;
    };
  }

  let { data }: Props = $props();

  // Pagination state
  let limit = $state(20);
  let offset = $state(0);

  // Filters
  let userFilter = $state('');
  let taskFilter = $state('');

  // Track which submissions have expanded test cases
  let expandedTestCases = $state<Set<number>>(new Set());

  const toggleTestCases = (submissionId: number) => {
    const newSet = new Set(expandedTestCases);
    if (newSet.has(submissionId)) {
      newSet.delete(submissionId);
    } else {
      newSet.add(submissionId);
    }
    expandedTestCases = newSet;
  };

  // Query submissions with pagination
  const submissionsQuery = $derived(
    getContestSubmissions({
      contestId: data.contestId,
      limit,
      offset
    })
  );

  // Pagination calculations
  let currentPage = $derived(getCurrentPage(offset, limit));
  let totalPages = $derived(
    submissionsQuery.current
      ? getTotalPages(submissionsQuery.current.pagination.totalItems, limit)
      : 1
  );
  let paginationPages = $derived(getPaginationPages(currentPage, totalPages));

  // Filtered submissions
  const filteredSubmissions = $derived.by(() => {
    if (!submissionsQuery.current) return [];

    return submissionsQuery.current.items.filter((submission) => {
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

  function handleLimitChange(newLimit: number) {
    limit = newLimit;
    offset = 0;
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

  const perPageOptions = [10, 20, 50, 100];
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

  <!-- Pagination Top Bar -->
  {#if submissionsQuery.current}
    <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div class="text-xs text-muted-foreground">
        {m.admin_users_pagination_showing_range({
          from: submissionsQuery.current.pagination.totalItems === 0 ? 0 : offset + 1,
          to: Math.min(
            offset + submissionsQuery.current.items.length,
            submissionsQuery.current.pagination.totalItems
          ),
          total: submissionsQuery.current.pagination.totalItems
        })}
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <div class="flex items-center gap-1 text-xs">
          <span class="text-muted-foreground">{m.admin_users_pagination_rows_per_page()}:</span>
          <select
            class="rounded-md border bg-background px-2 py-1 text-xs"
            value={limit}
            onchange={(e) => handleLimitChange(Number((e.target as HTMLSelectElement).value))}
          >
            {#each perPageOptions as opt (opt)}
              <option value={opt}>{opt}</option>
            {/each}
          </select>
        </div>
        <div class="text-xs font-medium">
          {m.admin_users_pagination_page()}
          {currentPage}
          {m.admin_users_pagination_of()}
          {totalPages}
        </div>
      </div>
    </div>
  {/if}

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

                <!-- Test Cases Section -->
                {#if submission.result.testResults && submission.result.testResults.length > 0}
                  <div class="mt-4">
                    <button
                      onclick={() => toggleTestCases(submission.id)}
                      class="flex w-full items-center justify-between text-left transition-colors hover:text-primary"
                    >
                      <h4 class="text-sm font-semibold text-foreground">Test Cases</h4>
                      {#if expandedTestCases.has(submission.id)}
                        <ChevronUp class="h-4 w-4 text-muted-foreground" />
                      {:else}
                        <ChevronDown class="h-4 w-4 text-muted-foreground" />
                      {/if}
                    </button>

                    {#if expandedTestCases.has(submission.id)}
                      <div class="mt-3 space-y-2">
                        {#each submission.result.testResults as testResult, index (testResult.id)}
                          <TestCaseResult {testResult} testNumber={index + 1} />
                        {/each}
                      </div>
                    {/if}
                  </div>
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

      <!-- Pagination Controls -->
      {#if submissionsQuery.current && submissionsQuery.current.pagination.totalItems > limit}
        <div class="flex flex-col items-center gap-2 pt-4">
          <Pagination.Root
            count={submissionsQuery.current.pagination.totalItems}
            perPage={limit}
            page={currentPage}
            siblingCount={1}
            onPageChange={(p) => {
              if (p && p !== currentPage) offset = getOffset(p, limit);
            }}
          >
            <Pagination.Content>
              <Pagination.PrevButton disabled={currentPage === 1}>
                {m.admin_users_pagination_prev()}
              </Pagination.PrevButton>

              {#each paginationPages as p, i (p === 'ellipsis' ? `ellipsis-${i}` : p)}
                {#if p === 'ellipsis'}
                  <Pagination.Item>
                    <Pagination.Ellipsis />
                  </Pagination.Item>
                {:else}
                  <Pagination.Item>
                    <Pagination.Link
                      page={{ type: 'page', value: p }}
                      isActive={p === currentPage}
                    />
                  </Pagination.Item>
                {/if}
              {/each}

              <Pagination.NextButton disabled={currentPage === totalPages}>
                {m.admin_users_pagination_next()}
              </Pagination.NextButton>
            </Pagination.Content>
          </Pagination.Root>

          <div class="text-xs text-muted-foreground">
            {m.admin_users_pagination_total({
              total: submissionsQuery.current.pagination.totalItems
            })}
          </div>
        </div>
      {/if}
    </div>
  {/if}
</div>
