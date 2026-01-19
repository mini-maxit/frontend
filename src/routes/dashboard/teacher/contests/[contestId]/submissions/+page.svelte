<script lang="ts">
  // TODO: getContestSubmissions was imported from submissions.remote which no longer exists
  // import { getContestSubmissions } from './submissions.remote';
  import { LoadingSpinner, ErrorCard, EmptyState } from '$lib/components/common';

  // Placeholder function - to be replaced when remote function is implemented
  const getContestSubmissions = (params: any) => ({ current: null, loading: true, error: null, refresh: () => {} });
  import type { Submission } from '$lib/dto/submission';
  import { SubmissionsList } from '$lib/components/dashboard/submissions';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import * as Card from '$lib/components/ui/card';
  import * as Pagination from '$lib/components/ui/pagination';
  import FileText from '@lucide/svelte/icons/file-text';
  import X from '@lucide/svelte/icons/x';
  import * as m from '$lib/paraglide/messages';
  import Label from '$lib/components/ui/label/label.svelte';
  import { getPaginationPages, getCurrentPage, getTotalPages, getOffset } from '$lib/utils';

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

    return submissionsQuery.current.items.filter((submission: Submission) => {
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
      <SubmissionsList submissions={filteredSubmissions} />

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
