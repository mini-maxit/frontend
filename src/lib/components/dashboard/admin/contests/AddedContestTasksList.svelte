<script lang="ts">
  import type { ContestTask } from '$lib/dto/task';
  import { SortDirection, ContestTaskSortKey } from '$lib/dto/pagination';
  import * as Table from '$lib/components/ui/table';
  import * as Pagination from '$lib/components/ui/pagination';
  import * as Tooltip from '$lib/components/ui/tooltip';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import ListTodo from '@lucide/svelte/icons/list-todo';
  import User from '@lucide/svelte/icons/user';
  import Calendar from '@lucide/svelte/icons/calendar';
  import Search from '@lucide/svelte/icons/search';
  import Pencil from '@lucide/svelte/icons/pencil';
  import ArrowUp from '@lucide/svelte/icons/arrow-up';
  import ArrowDown from '@lucide/svelte/icons/arrow-down';
  import * as m from '$lib/paraglide/messages';
  import { getPaginationPages, getCurrentPage, getTotalPages, getOffset, formatDate } from '$lib/utils';
  import RemoveTaskFromContestButton from './RemoveTaskFromContestButton.svelte';

  interface AddedContestTasksListProps {
    contestTasks: ContestTask[];
    total: number;
    contestId: number;
    limit: number;
    offset: number;
    sortKey: ContestTaskSortKey;
    sortDir: SortDirection;
    search: string;
    onEdit: (contestTask: ContestTask) => void;
    onSuccess?: () => void;
  }

  let {
    contestTasks,
    total,
    contestId,
    limit = $bindable(),
    offset = $bindable(),
    sortKey = $bindable(),
    sortDir = $bindable(),
    search = $bindable(),
    onEdit,
    onSuccess
  }: AddedContestTasksListProps = $props();

  let currentPage = $derived(getCurrentPage(offset, limit));
  let totalPages = $derived(getTotalPages(total, limit));

  let paginationPages = $derived(getPaginationPages(currentPage, totalPages));

  function handleHeaderSort(key: ContestTaskSortKey) {
    const dir =
      sortKey === key
        ? sortDir === SortDirection.Asc
          ? SortDirection.Desc
          : SortDirection.Asc
        : SortDirection.Asc;

    sortKey = key;
    sortDir = dir;
    offset = 0;
  }

  function handleLimitChange(newLimit: number) {
    limit = newLimit;
    offset = 0;
  }

  function getAriaSortValue(key: ContestTaskSortKey): 'ascending' | 'descending' | 'none' {
    if (sortKey !== key) return 'none';
    return sortDir === SortDirection.Asc ? 'ascending' : 'descending';
  }

  const perPageOptions = [5, 10, 20];
</script>

<div class="space-y-3">
  <!-- Top bar: range + page size + search -->
  <div class="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
    <div class="relative w-full lg:max-w-xs">
      <Search class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="text"
        placeholder={m.admin_contest_tasks_search_placeholder()}
        bind:value={search}
        class="pl-9"
      />
    </div>

    <div class="flex flex-wrap items-center gap-2">
      <div class="text-xs text-muted-foreground">
        {m.admin_contest_tasks_pagination_showing_range({
          from: total === 0 ? 0 : offset + 1,
          to: Math.min(offset + contestTasks.length, total),
          total
        })}
      </div>
      <div class="flex items-center gap-1 text-xs">
        <span class="text-muted-foreground">{m.admin_contest_tasks_pagination_rows_per_page()}:</span>
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
        {m.admin_contest_tasks_pagination_page()}
        {currentPage}
        {m.admin_contest_tasks_pagination_of()}
        {totalPages}
      </div>
    </div>
  </div>

  <!-- Data table -->
  <Table.Root class="mt-1">
    <Table.Header>
      <Table.Row>
        <Table.Head class="w-14" aria-sort={getAriaSortValue(ContestTaskSortKey.Id)}>
          <button
            class="flex items-center gap-1"
            type="button"
            onclick={() => handleHeaderSort(ContestTaskSortKey.Id)}
          >
            {m.admin_contest_tasks_column_id()}
            {#if sortKey === ContestTaskSortKey.Id}{#if sortDir === SortDirection.Asc}<ArrowUp
                  class="h-3 w-3 text-muted-foreground"
                />{:else}<ArrowDown class="h-3 w-3 text-muted-foreground" />{/if}{/if}
          </button>
        </Table.Head>
        <Table.Head aria-sort={getAriaSortValue(ContestTaskSortKey.Title)}>
          <button
            class="flex items-center gap-1"
            type="button"
            onclick={() => handleHeaderSort(ContestTaskSortKey.Title)}
          >
            {m.admin_contest_tasks_column_title()}
            {#if sortKey === ContestTaskSortKey.Title}{#if sortDir === SortDirection.Asc}<ArrowUp
                  class="h-3 w-3 text-muted-foreground"
                />{:else}<ArrowDown class="h-3 w-3 text-muted-foreground" />{/if}{/if}
          </button>
        </Table.Head>
        <Table.Head class="hidden md:table-cell">
          {m.admin_contest_tasks_column_creator()}
        </Table.Head>
        <Table.Head aria-sort={getAriaSortValue(ContestTaskSortKey.StartAt)}>
          <button
            class="flex items-center gap-1"
            type="button"
            onclick={() => handleHeaderSort(ContestTaskSortKey.StartAt)}
          >
            {m.admin_contest_tasks_column_start_at()}
            {#if sortKey === ContestTaskSortKey.StartAt}{#if sortDir === SortDirection.Asc}<ArrowUp
                  class="h-3 w-3 text-muted-foreground"
                />{:else}<ArrowDown class="h-3 w-3 text-muted-foreground" />{/if}{/if}
          </button>
        </Table.Head>
        <Table.Head aria-sort={getAriaSortValue(ContestTaskSortKey.EndAt)}>
          <button
            class="flex items-center gap-1"
            type="button"
            onclick={() => handleHeaderSort(ContestTaskSortKey.EndAt)}
          >
            {m.admin_contest_tasks_column_end_at()}
            {#if sortKey === ContestTaskSortKey.EndAt}{#if sortDir === SortDirection.Asc}<ArrowUp
                  class="h-3 w-3 text-muted-foreground"
                />{:else}<ArrowDown class="h-3 w-3 text-muted-foreground" />{/if}{/if}
          </button>
        </Table.Head>
        <Table.Head class="text-right">{m.admin_contest_tasks_column_actions()}</Table.Head>
      </Table.Row>
    </Table.Header>

    <Table.Body>
      {#if contestTasks.length === 0}
        <Table.Row>
          <Table.Cell colspan={6} class="py-10 text-center text-sm text-muted-foreground">
            {m.admin_contest_tasks_no_results_title()}
          </Table.Cell>
        </Table.Row>
      {:else}
        {#each contestTasks as contestTask (contestTask.task.id)}
        <Table.Row>
          <Table.Cell class="font-mono text-xs">{contestTask.task.id}</Table.Cell>
          <Table.Cell>
            <div class="flex min-w-0 items-center gap-2">
              <ListTodo class="h-4 w-4 shrink-0 text-primary" />
              <Tooltip.Root>
                <Tooltip.Trigger class="min-w-0">
                  <span class="block max-w-48 truncate font-medium text-foreground">
                    {contestTask.task.title}
                  </span>
                </Tooltip.Trigger>
                <Tooltip.Content side="top">{contestTask.task.title}</Tooltip.Content>
              </Tooltip.Root>
            </div>
          </Table.Cell>
          <Table.Cell class="hidden md:table-cell">
            <div class="flex items-center gap-1.5 text-muted-foreground">
              <User class="h-3.5 w-3.5 shrink-0" />
              <span class="max-w-[160px] truncate">{contestTask.creatorName}</span>
            </div>
          </Table.Cell>
          <Table.Cell>
            <div class="flex items-center gap-1.5 text-muted-foreground">
              <Calendar class="h-3.5 w-3.5 shrink-0" />
              <span class="whitespace-nowrap">{formatDate(contestTask.startAt)}</span>
            </div>
          </Table.Cell>
          <Table.Cell class="text-muted-foreground">
            {#if contestTask.endAt}
              <div class="flex items-center gap-1.5">
                <Calendar class="h-3.5 w-3.5 shrink-0" />
                <span class="whitespace-nowrap">{formatDate(contestTask.endAt)}</span>
              </div>
            {:else}
              <span>{m.admin_contest_tasks_no_end_date()}</span>
            {/if}
          </Table.Cell>
          <Table.Cell class="text-right">
            <div class="flex items-center justify-end gap-1">
              <Button
                variant="ghost"
                size="icon"
                class="h-8 w-8 text-muted-foreground"
                title={m.admin_contest_tasks_edit_schedule_title()}
                onclick={() => onEdit(contestTask)}
              >
                <Pencil class="h-4 w-4" />
              </Button>
              <RemoveTaskFromContestButton
                {contestId}
                taskId={contestTask.task.id}
                taskTitle={contestTask.task.title}
                onSuccess={onSuccess}
              />
            </div>
          </Table.Cell>
        </Table.Row>
        {/each}
      {/if}
    </Table.Body>
  </Table.Root>

  {#if total > 0}
    <div class="flex flex-col items-center gap-2 pt-2">
    <Pagination.Root
      count={total}
      perPage={limit}
      page={currentPage}
      siblingCount={1}
      onPageChange={(p) => {
        if (p && p !== currentPage) offset = getOffset(p, limit);
      }}
    >
      <Pagination.Content>
        <Pagination.PrevButton disabled={currentPage === 1}>
          {m.admin_contest_tasks_pagination_prev()}
        </Pagination.PrevButton>

        {#each paginationPages as p (p)}
          {#if p === 'ellipsis'}
            <Pagination.Item>
              <Pagination.Ellipsis />
            </Pagination.Item>
          {:else}
            <Pagination.Item>
              <Pagination.Link page={{ type: 'page', value: p }} isActive={p === currentPage} />
            </Pagination.Item>
          {/if}
        {/each}

        <Pagination.NextButton disabled={currentPage === totalPages}>
          {m.admin_contest_tasks_pagination_next()}
        </Pagination.NextButton>
      </Pagination.Content>
    </Pagination.Root>

    <div class="text-xs text-muted-foreground">
      {m.admin_contest_tasks_pagination_total({ total })}
    </div>
    </div>
  {/if}
</div>
