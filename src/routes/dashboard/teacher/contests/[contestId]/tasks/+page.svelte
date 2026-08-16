<script lang="ts">
  import { LoadingSpinner, ErrorCard } from '$lib/components/common';
  import { showApiError } from '$lib/errors/backend-error';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { Calendar } from '$lib/components/ui/calendar';
  import { Checkbox } from '$lib/components/ui/checkbox';
  import * as Dialog from '$lib/components/ui/dialog';
  import * as Popover from '$lib/components/ui/popover';
  import { buttonVariants } from '$lib/components/ui/button';
  import {
    AddedContestTasksList,
    AssignableContestTasksList
  } from '$lib/components/dashboard/admin/contests';
  import { SortDirection, ContestTaskSortKey, AssignableTaskSortKey } from '$lib/dto/pagination';
  import type { ContestTask } from '$lib/dto/task';
  import CalendarIcon from '@lucide/svelte/icons/calendar';
  import ChartBar from '@lucide/svelte/icons/chart-bar';
  import { toast } from 'svelte-sonner';
  import * as m from '$lib/paraglide/messages';
  import {
    DateFormatter,
    type DateValue,
    CalendarDate,
    getLocalTimeZone,
    today
  } from '@internationalized/date';
  import { cn, toLocalRFC3339 } from '$lib/utils';
  import { SvelteDate } from 'svelte/reactivity';
  import { createParameterizedQuery } from '$lib/utils/query.svelte';
  import { getContestsManagementInstance } from '$lib/services';

  interface Props {
    data: {
      contestId: number;
    };
  }
  let { data }: Props = $props();
  const contestId = $derived(data.contestId);
  const contestsService = getContestsManagementInstance();

  // Added tasks query (server-side pagination + sorting + search)
  let addedLimit = $state(5);
  let addedOffset = $state(0);
  let addedSortKey = $state<ContestTaskSortKey>(ContestTaskSortKey.StartAt);
  let addedSortDir = $state<SortDirection>(SortDirection.Asc);
  let addedSearch = $state('');
  let addedSearchApplied = $state('');

  let addedSearchTimer: ReturnType<typeof setTimeout> | undefined;
  $effect(() => {
    const value = addedSearch;
    clearTimeout(addedSearchTimer);
    addedSearchTimer = setTimeout(() => {
      addedSearchApplied = value;
      addedOffset = 0;
    }, 300);
  });

  const getAddedParams = () => ({
    limit: addedLimit,
    offset: addedOffset,
    sort: `${addedSortKey}:${addedSortDir}`,
    search: addedSearchApplied
  });

  const addedTasksQuery = createParameterizedQuery(getAddedParams, async (params) => {
    if (!contestsService) throw new Error('Service unavailable');
    return await contestsService.getContestTasks(contestId, params);
  });

  // Assignable tasks query (server-side pagination + sorting + search)
  let assignableLimit = $state(5);
  let assignableOffset = $state(0);
  let assignableSortKey = $state<AssignableTaskSortKey>(AssignableTaskSortKey.Title);
  let assignableSortDir = $state<SortDirection>(SortDirection.Asc);
  let assignableSearch = $state('');
  let assignableSearchApplied = $state('');

  let assignableSearchTimer: ReturnType<typeof setTimeout> | undefined;
  $effect(() => {
    const value = assignableSearch;
    clearTimeout(assignableSearchTimer);
    assignableSearchTimer = setTimeout(() => {
      assignableSearchApplied = value;
      assignableOffset = 0;
    }, 300);
  });

  const getAssignableParams = () => ({
    limit: assignableLimit,
    offset: assignableOffset,
    sort: `${assignableSortKey}:${assignableSortDir}`,
    search: assignableSearchApplied
  });

  const assignableTasksQuery = createParameterizedQuery(getAssignableParams, async (params) => {
    if (!contestsService) throw new Error('Service unavailable');
    return await contestsService.getAssignableTasks(contestId, params);
  });

  // Add/Edit task schedule dialog
  let dialogOpen = $state(false);
  let dialogMode = $state<'add' | 'edit'>('add');
  let selectedTaskId = $state<number | null>(null);
  let submitting = $state(false);

  const df = new DateFormatter('en-US', {
    dateStyle: 'long'
  });

  function pad(value: number): string {
    return String(value).padStart(2, '0');
  }

  function parseDateTime(iso: string | null): { date: DateValue; time: string } {
    const d = iso ? new Date(iso) : new Date();
    const date = new CalendarDate(d.getFullYear(), d.getMonth() + 1, d.getDate());
    return { date, time: `${pad(d.getHours())}:${pad(d.getMinutes())}` };
  }

  function getDefaultStartDateTime() {
    const now = new Date();
    const date = today(getLocalTimeZone());
    const time = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
    return { date, time };
  }

  function getDefaultEndDateTime() {
    const tomorrow = new SvelteDate();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const date = today(getLocalTimeZone()).add({ days: 1 });
    const time = `${pad(tomorrow.getHours())}:${pad(tomorrow.getMinutes())}`;
    return { date, time };
  }

  let startDate = $state<DateValue | undefined>(getDefaultStartDateTime().date);
  let startTime = $state<string>(getDefaultStartDateTime().time);
  let endDate = $state<DateValue | undefined>(getDefaultEndDateTime().date);
  let endTime = $state<string | null>(getDefaultEndDateTime().time);
  let hasEndTime = $state(false);

  function buildDateTime(date: DateValue | undefined, time: string | null): string {
    if (!date || !time) return '';
    const [hours, minutes] = time.split(':').map(Number);
    const dateObj = date.toDate(getLocalTimeZone());
    dateObj.setHours(hours, minutes, 0, 0);
    return toLocalRFC3339(dateObj);
  }

  let startAtValue = $derived(buildDateTime(startDate, startTime));
  let endAtValue = $derived(hasEndTime ? buildDateTime(endDate, endTime) : '');

  function openAddDialog(taskId: number) {
    dialogMode = 'add';
    selectedTaskId = taskId;
    const defaultStart = getDefaultStartDateTime();
    const defaultEnd = getDefaultEndDateTime();
    startDate = defaultStart.date;
    startTime = defaultStart.time;
    endDate = defaultEnd.date;
    endTime = defaultEnd.time;
    hasEndTime = false;
    dialogOpen = true;
  }

  function openEditDialog(contestTask: ContestTask) {
    dialogMode = 'edit';
    selectedTaskId = contestTask.task.id;
    const start = parseDateTime(contestTask.startAt);
    startDate = start.date;
    startTime = start.time;
    if (contestTask.endAt) {
      const end = parseDateTime(contestTask.endAt);
      endDate = end.date;
      endTime = end.time;
      hasEndTime = true;
    } else {
      const defaultEnd = getDefaultEndDateTime();
      endDate = defaultEnd.date;
      endTime = defaultEnd.time;
      hasEndTime = false;
    }
    dialogOpen = true;
  }

  async function handleSubmit(event: Event) {
    event.preventDefault();

    if (!contestsService || !selectedTaskId || !startAtValue) {
      toast.error(m.admin_contest_tasks_add_error());
      return;
    }

    submitting = true;
    try {
      const schedule = {
        startAt: startAtValue,
        endAt: hasEndTime ? endAtValue : null
      };
      if (dialogMode === 'edit') {
        await contestsService.updateTaskInContest(contestId, selectedTaskId, schedule);
        toast.success(m.admin_contest_tasks_update_success());
      } else {
        await contestsService.addTaskToContest(contestId, { taskId: selectedTaskId, ...schedule });
        toast.success(m.admin_contest_tasks_add_success());
      }
      dialogOpen = false;
      selectedTaskId = null;
      await addedTasksQuery.refresh();
      await assignableTasksQuery.refresh();
    } catch (error){
      console.error('Save task schedule error:', error);
      showApiError(error, 
        dialogMode === 'edit'
          ? m.admin_contest_tasks_update_error()
          : m.admin_contest_tasks_add_error()
      );
    } finally {
      submitting = false;
    }
  }

  async function handleTasksChanged() {
    await addedTasksQuery.refresh();
    await assignableTasksQuery.refresh();
  }
</script>

<div class="space-y-6">
  <div class="flex items-center justify-between">
    <h1 class="text-3xl font-bold text-foreground">
      {m.admin_contest_tasks_page_title({ contestId: data.contestId })}
    </h1>
    <Button
      href={`/dashboard/teacher/contests/${contestId}/user-stats`}
      variant="default"
      class="gap-2"
    >
      <ChartBar class="h-4 w-4" />
      {m.admin_contest_view_all_user_stats()}
    </Button>
  </div>

  <div class="space-y-8">
    <!-- Added Tasks -->
    <section class="space-y-4">
      <h2 class="text-2xl font-bold text-foreground">{m.admin_contest_tasks_added()}</h2>

      {#if addedTasksQuery.error}
        <ErrorCard
          title={m.user_contest_tasks_load_error()}
          error={addedTasksQuery.error}
          onRetry={() => addedTasksQuery.refresh()}
        />
      {:else if !addedTasksQuery.current && addedTasksQuery.loading}
        <LoadingSpinner />
      {:else if addedTasksQuery.current}
        <AddedContestTasksList
          {contestId}
          contestTasks={addedTasksQuery.current.items}
          total={addedTasksQuery.current.pagination.totalItems}
          bind:limit={addedLimit}
          bind:offset={addedOffset}
          bind:sortKey={addedSortKey}
          bind:sortDir={addedSortDir}
          bind:search={addedSearch}
          onEdit={openEditDialog}
          onSuccess={handleTasksChanged}
        />
      {/if}
    </section>

    <!-- Assignable Tasks -->
    <section class="space-y-4">
      <h2 class="text-2xl font-bold text-foreground">{m.admin_contest_tasks_available()}</h2>

      {#if assignableTasksQuery.error}
        <ErrorCard
          title={m.admin_tasks_load_error_title()}
          error={assignableTasksQuery.error}
          onRetry={() => assignableTasksQuery.refresh()}
        />
      {:else if !assignableTasksQuery.current && assignableTasksQuery.loading}
        <LoadingSpinner />
      {:else if assignableTasksQuery.current}
        <AssignableContestTasksList
          tasks={assignableTasksQuery.current.items}
          total={assignableTasksQuery.current.pagination.totalItems}
          bind:limit={assignableLimit}
          bind:offset={assignableOffset}
          bind:sortKey={assignableSortKey}
          bind:sortDir={assignableSortDir}
          bind:search={assignableSearch}
          onAdd={openAddDialog}
        />
      {/if}
    </section>
  </div>
</div>

<!-- Add/Edit Task Schedule Dialog -->
<Dialog.Root bind:open={dialogOpen}>
  <Dialog.Content class="max-w-2xl">
    <Dialog.Header>
      <Dialog.Title>
        {dialogMode === 'edit'
          ? m.admin_contest_tasks_edit_dialog_title()
          : m.admin_contest_tasks_dialog_title()}
      </Dialog.Title>
      <Dialog.Description>
        {dialogMode === 'edit'
          ? m.admin_contest_tasks_edit_dialog_description()
          : m.admin_contest_tasks_dialog_description()}
      </Dialog.Description>
    </Dialog.Header>

    <form class="space-y-6" onsubmit={handleSubmit}>
      <div class="grid gap-4 sm:grid-cols-2">
        <!-- Start Date & Time -->
        <div class="space-y-3">
          <Label class="h-8">{m.admin_contests_form_start_label()}</Label>

          <div class="space-y-2">
            <span class="block text-sm text-muted-foreground">
              {m.admin_contests_form_start_date()}
            </span>
            <Popover.Root>
              <Popover.Trigger
                class={cn(
                  buttonVariants({
                    variant: 'outline',
                    class: 'w-full justify-start text-left font-normal'
                  }),
                  !startDate && 'text-muted-foreground'
                )}
              >
                <CalendarIcon class="mr-2 h-4 w-4" />
                {startDate
                  ? df.format(startDate.toDate(getLocalTimeZone()))
                  : m.admin_contests_form_pick_date()}
              </Popover.Trigger>
              <Popover.Content class="w-auto p-0">
                <Calendar type="single" bind:value={startDate} />
              </Popover.Content>
            </Popover.Root>
          </div>

          <div class="space-y-2">
            <Label for="startTime" class="text-sm text-muted-foreground">
              {m.admin_contests_form_start_time()}
            </Label>
            <Input
              type="time"
              id="startTime"
              name="startTime"
              autocomplete="off"
              bind:value={startTime}
              required
              class="scheme-light transition-all duration-200 focus:ring-2 focus:ring-primary dark:scheme-dark"
            />
          </div>
        </div>

        <!-- End Date & Time -->
        <div class="space-y-3">
          <div class="flex h-8 items-center gap-2">
            <Checkbox id="hasEndTime" bind:checked={hasEndTime} />
            <Label for="hasEndTime" class="cursor-pointer">
              {m.admin_contests_form_end_label()}
            </Label>
          </div>

          {#if hasEndTime}
            <div class="space-y-2">
              <span class="block text-sm text-muted-foreground">
                {m.admin_contests_form_end_date()}
              </span>
              <Popover.Root>
                <Popover.Trigger
                  class={cn(
                    buttonVariants({
                      variant: 'outline',
                      class: 'w-full justify-start text-left font-normal'
                    }),
                    !endDate && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon class="mr-2 h-4 w-4" />
                  {endDate
                    ? df.format(endDate.toDate(getLocalTimeZone()))
                    : m.admin_contests_form_pick_date()}
                </Popover.Trigger>
                <Popover.Content class="w-auto p-0">
                  <Calendar type="single" bind:value={endDate} />
                </Popover.Content>
              </Popover.Root>
            </div>

            <div class="space-y-2">
              <Label for="endTime" class="text-sm text-muted-foreground">
                {m.admin_contests_form_end_time()}
              </Label>
              <Input
                type="time"
                id="endTime"
                name="endTime"
                autocomplete="off"
                bind:value={endTime}
                required
                class="scheme-light transition-all duration-200 focus:ring-2 focus:ring-primary dark:scheme-dark"
              />
            </div>
          {/if}
        </div>
      </div>

      <Dialog.Footer>
        <Button
          type="button"
          variant="outline"
          onclick={() => {
            dialogOpen = false;
            selectedTaskId = null;
          }}
        >
          {m.admin_contests_form_cancel()}
        </Button>
        <Button
          type="submit"
          disabled={submitting}
          class="transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
        >
          {submitting
            ? 'Saving...'
            : dialogMode === 'edit'
              ? m.admin_contest_tasks_update_button()
              : m.admin_contest_tasks_add_button()}
        </Button>
      </Dialog.Footer>
    </form>
  </Dialog.Content>
</Dialog.Root>
