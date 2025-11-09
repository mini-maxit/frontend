<script lang="ts">
  import { getContestSubmissions } from './submissions.remote';
  import { LoadingSpinner, ErrorCard, EmptyState } from '$lib/components/common';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import * as Select from '$lib/components/ui/select';
  import * as Card from '$lib/components/ui/card';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
  import * as Table from '$lib/components/ui/table';
  import FileText from '@lucide/svelte/icons/file-text';
  import Download from '@lucide/svelte/icons/download';
  import X from '@lucide/svelte/icons/x';
  import { toast } from 'svelte-sonner';
  import * as m from '$lib/paraglide/messages';
  import { formatDate } from '$lib/utils';
  import { SubmissionStatus } from '$lib/dto/submission';

  interface Props {
    data: {
      contestId: number;
    };
  }

  let { data }: Props = $props();

  // Query parameters
  let limit = $state(50);
  let offset = $state(0);
  let sort = $state<string | undefined>(undefined);

  // Filters
  let userFilter = $state('');
  let taskFilter = $state('');
  let statusFilter = $state<string>('');

  // Query submissions
  const submissionsQuery = getContestSubmissions({
    contestId: data.contestId,
    limit,
    offset,
    sort
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

      const matchesStatus = !statusFilter || submission.status === statusFilter;

      return matchesUser && matchesTask && matchesStatus;
    });
  });

  function clearFilters() {
    userFilter = '';
    taskFilter = '';
    statusFilter = '';
  }

  function exportAsCSV() {
    if (!filteredSubmissions.length) {
      toast.error('No submissions to export');
      return;
    }

    const headers = [
      'ID',
      'User',
      'User Email',
      'Task',
      'Status',
      'Language',
      'Submitted At',
      'Result Code',
      'Result Message'
    ];

    const rows = filteredSubmissions.map((s) => [
      s.id,
      `${s.user.name} ${s.user.surname} (${s.user.username})`,
      s.user.email,
      s.task.title,
      s.status,
      `${s.language.language} ${s.language.version}`,
      s.submittedAt,
      s.result?.code || '',
      s.result?.message || ''
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    downloadFile(csv, 'submissions.csv', 'text/csv');
    toast.success(m.admin_contest_submissions_export_success());
  }

  function exportAsJSON() {
    if (!filteredSubmissions.length) {
      toast.error('No submissions to export');
      return;
    }

    const json = JSON.stringify(filteredSubmissions, null, 2);
    downloadFile(json, 'submissions.json', 'application/json');
    toast.success(m.admin_contest_submissions_export_success());
  }

  function downloadFile(content: string, filename: string, mimeType: string) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function getStatusColor(status: string): string {
    switch (status) {
      case SubmissionStatus.Evaluated:
        return 'text-green-600 bg-green-50 dark:bg-green-950 dark:text-green-400';
      case SubmissionStatus.SentForEvaluation:
        return 'text-blue-600 bg-blue-50 dark:bg-blue-950 dark:text-blue-400';
      case SubmissionStatus.Received:
        return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-950 dark:text-yellow-400';
      case SubmissionStatus.Lost:
        return 'text-red-600 bg-red-50 dark:bg-red-950 dark:text-red-400';
      default:
        return 'text-gray-600 bg-gray-50 dark:bg-gray-950 dark:text-gray-400';
    }
  }

  function getResultBadgeColor(code: string): string {
    if (code.toLowerCase().includes('success') || code.toLowerCase().includes('accepted')) {
      return 'text-green-600 bg-green-50 dark:bg-green-950 dark:text-green-400';
    }
    if (code.toLowerCase().includes('error') || code.toLowerCase().includes('failed')) {
      return 'text-red-600 bg-red-50 dark:bg-red-950 dark:text-red-400';
    }
    return 'text-gray-600 bg-gray-50 dark:bg-gray-950 dark:text-gray-400';
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
          <label for="userFilter" class="mb-2 block text-sm font-medium">
            {m.admin_contest_submissions_filter_by_user()}
          </label>
          <Input
            id="userFilter"
            type="text"
            placeholder="Search by username, name..."
            bind:value={userFilter}
          />
        </div>

        <!-- Task Filter -->
        <div class="min-w-[200px] flex-1">
          <label for="taskFilter" class="mb-2 block text-sm font-medium">
            {m.admin_contest_submissions_filter_by_task()}
          </label>
          <Input
            id="taskFilter"
            type="text"
            placeholder="Search by task name or ID..."
            bind:value={taskFilter}
          />
        </div>

        <!-- Status Filter -->
        <div class="min-w-[200px] flex-1">
          <label for="statusFilter" class="mb-2 block text-sm font-medium">
            {m.admin_contest_submissions_filter_by_status()}
          </label>
          <Select.Root
            selected={{ value: statusFilter, label: statusFilter || 'All' }}
            onSelectedChange={(v) => (statusFilter = v?.value || '')}
          >
            <Select.Trigger id="statusFilter">
              <Select.Value placeholder="All statuses" />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="">All</Select.Item>
              <Select.Item value={SubmissionStatus.Received}
                >{SubmissionStatus.Received}</Select.Item
              >
              <Select.Item value={SubmissionStatus.SentForEvaluation}
                >{SubmissionStatus.SentForEvaluation}</Select.Item
              >
              <Select.Item value={SubmissionStatus.Evaluated}
                >{SubmissionStatus.Evaluated}</Select.Item
              >
              <Select.Item value={SubmissionStatus.Lost}>{SubmissionStatus.Lost}</Select.Item>
            </Select.Content>
          </Select.Root>
        </div>

        <!-- Clear & Export -->
        <div class="flex gap-2">
          <Button variant="outline" onclick={clearFilters}>
            <X class="mr-2 h-4 w-4" />
            {m.admin_contest_submissions_clear_filters()}
          </Button>

          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild let:builder>
              <Button builders={[builder]} variant="default">
                <Download class="mr-2 h-4 w-4" />
                {m.admin_contest_submissions_export()}
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
              <DropdownMenu.Item on:click={exportAsCSV}>
                {m.admin_contest_submissions_export_csv()}
              </DropdownMenu.Item>
              <DropdownMenu.Item on:click={exportAsJSON}>
                {m.admin_contest_submissions_export_json()}
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </div>
      </div>
    </Card.Content>
  </Card.Root>

  <!-- Submissions Table -->
  <Card.Root>
    <Card.Content class="p-0">
      {#if submissionsQuery.error}
        <div class="p-6">
          <ErrorCard
            title={m.admin_contest_submissions_load_error()}
            error={submissionsQuery.error}
            onRetry={() => submissionsQuery.refresh()}
          />
        </div>
      {:else if submissionsQuery.loading}
        <div class="p-6">
          <LoadingSpinner message={m.admin_contest_submissions_loading()} />
        </div>
      {:else if !filteredSubmissions.length}
        <div class="p-6">
          <EmptyState
            title={m.admin_contest_submissions_no_submissions_title()}
            description={m.admin_contest_submissions_no_submissions_description()}
            icon={FileText}
          />
        </div>
      {:else}
        <div class="overflow-x-auto">
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.Head>ID</Table.Head>
                <Table.Head>{m.admin_contest_submissions_user()}</Table.Head>
                <Table.Head>{m.admin_contest_submissions_task()}</Table.Head>
                <Table.Head>{m.admin_contest_submissions_status()}</Table.Head>
                <Table.Head>{m.admin_contest_submissions_language()}</Table.Head>
                <Table.Head>{m.admin_contest_submissions_submitted_at()}</Table.Head>
                <Table.Head>{m.admin_contest_submissions_result()}</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {#each filteredSubmissions as submission (submission.id)}
                <Table.Row>
                  <Table.Cell class="font-medium">#{submission.id}</Table.Cell>
                  <Table.Cell>
                    <div class="flex flex-col">
                      <span class="font-medium">{submission.user.username}</span>
                      <span class="text-sm text-muted-foreground">
                        {submission.user.name}
                        {submission.user.surname}
                      </span>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <div class="flex flex-col">
                      <span class="font-medium">{submission.task.title}</span>
                      <span class="text-sm text-muted-foreground">ID: {submission.task.id}</span>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <span
                      class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium {getStatusColor(
                        submission.status
                      )}"
                    >
                      {submission.status}
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    {submission.language.language}
                    {submission.language.version}
                  </Table.Cell>
                  <Table.Cell class="whitespace-nowrap">
                    {formatDate(submission.submittedAt)}
                  </Table.Cell>
                  <Table.Cell>
                    {#if submission.result}
                      <div class="flex flex-col gap-1">
                        <span
                          class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium {getResultBadgeColor(
                            submission.result.code
                          )}"
                        >
                          {submission.result.code}
                        </span>
                        {#if submission.result.message}
                          <span
                            class="max-w-xs truncate text-xs text-muted-foreground"
                            title={submission.result.message}
                          >
                            {submission.result.message}
                          </span>
                        {/if}
                        {#if submission.result.testResults}
                          <span class="text-xs text-muted-foreground">
                            {submission.result.testResults.filter((t) => t.passed)
                              .length}/{submission.result.testResults.length} passed
                          </span>
                        {/if}
                      </div>
                    {:else}
                      <span class="text-muted-foreground">-</span>
                    {/if}
                  </Table.Cell>
                </Table.Row>
              {/each}
            </Table.Body>
          </Table.Root>
        </div>

        <!-- Results count -->
        <div class="border-t px-6 py-4 text-sm text-muted-foreground">
          Showing {filteredSubmissions.length} submission{filteredSubmissions.length !== 1
            ? 's'
            : ''}
        </div>
      {/if}
    </Card.Content>
  </Card.Root>
</div>
