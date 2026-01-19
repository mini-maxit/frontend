<script lang="ts">
  // TODO: getAssignableTasks, addTaskToContest were imported from tasks.remote which no longer exists
  // import { getAssignableTasks, addTaskToContest } from './tasks.remote';
  import { LoadingSpinner, ErrorCard, EmptyState } from '$lib/components/common';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { Calendar } from '$lib/components/ui/calendar';
  import { Checkbox } from '$lib/components/ui/checkbox';
  import * as Dialog from '$lib/components/ui/dialog';
  import * as Popover from '$lib/components/ui/popover';
  import * as Card from '$lib/components/ui/card';
  import { buttonVariants } from '$lib/components/ui/button';
  import ListTodo from '@lucide/svelte/icons/list-todo';
  import Plus from '@lucide/svelte/icons/plus';
  import CalendarIcon from '@lucide/svelte/icons/calendar';
  import { toast } from 'svelte-sonner';
  import { isHttpError } from '@sveltejs/kit';
  import * as m from '$lib/paraglide/messages';
  import { DateFormatter, type DateValue, getLocalTimeZone, today } from '@internationalized/date';
  import { cn, formatDate, toLocalRFC3339 } from '$lib/utils';
  import { SvelteDate } from 'svelte/reactivity';

  // Placeholder functions - to be replaced when remote functions are implemented
  const getAssignableTasks = (contestId: number) => ({
    current: null,
    loading: true,
    error: null,
    refresh: () => {}
  });
  const addTaskToContest = {
    enhance: (callback: any) => callback,
    fields: {
      contestId: { as: (t: string) => ({}) },
      taskId: { as: (t: string) => ({}) },
      startAt: { as: (t: string) => ({}) },
      endAt: { as: (t: string) => ({}) }
    }
  };

  interface Props {
    data: {
      contestId: number;
    };
  }
  let { data }: Props = $props();
  const tasksQuery = getAssignableTasks(data.contestId);

  let dialogOpen = $state(false);
  let selectedTaskId = $state<number | null>(null);

  // Date formatters
  const df = new DateFormatter('en-US', {
    dateStyle: 'long'
  });

  // Get default date/time values
  function getDefaultStartDateTime() {
    const now = new Date();
    const date = today(getLocalTimeZone());
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    return { date, time };
  }

  function getDefaultEndDateTime() {
    const tomorrow = new SvelteDate();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const date = today(getLocalTimeZone()).add({ days: 1 });
    const time = `${String(tomorrow.getHours()).padStart(2, '0')}:${String(tomorrow.getMinutes()).padStart(2, '0')}`;
    return { date, time };
  }

  // Date and time states
  let startDate = $state<DateValue | undefined>(getDefaultStartDateTime().date);
  let startTime = $state<string>(getDefaultStartDateTime().time);
  let endDate = $state<DateValue | undefined>(getDefaultEndDateTime().date);
  let endTime = $state<string | null>(getDefaultEndDateTime().time);
  let hasEndTime = $state(false);

  function getDateTimeString(date: DateValue | undefined, time: string | null): string {
    if (!date) return '';
    if (!time) return '';
    const [hours, minutes] = time.split(':').map(Number);
    const dateObj = date.toDate(getLocalTimeZone());
    dateObj.setHours(hours, minutes, 0, 0);

    // Use shared utility to encode local timezone into RFC3339
    return toLocalRFC3339(dateObj);
  }

  let startAtValue = $derived(getDateTimeString(startDate, startTime));
  let endAtValue = $derived(hasEndTime ? getDateTimeString(endDate, endTime) : '');

  function openDialog(taskId: number) {
    selectedTaskId = taskId;
    // Reset to defaults when opening dialog
    const defaultStart = getDefaultStartDateTime();
    const defaultEnd = getDefaultEndDateTime();
    startDate = defaultStart.date;
    startTime = defaultStart.time;
    endDate = defaultEnd.date;
    endTime = defaultEnd.time;
    hasEndTime = false;
    dialogOpen = true;
  }
</script>

<div class="space-y-6">
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-3xl font-bold text-foreground">
        {m.admin_contest_tasks_title()}
      </h1>
      <p class="mt-2 text-muted-foreground">
        {m.admin_contest_tasks_subtitle()}
      </p>
    </div>
  </div>

  <!-- Tasks List Section -->
  <div class="space-y-4">
    <h2 class="text-2xl font-bold text-foreground">{m.admin_contest_tasks_available()}</h2>

    {#if tasksQuery.error}
      <ErrorCard
        title={m.admin_tasks_load_error_title()}
        error={tasksQuery.error}
        onRetry={() => tasksQuery.refresh()}
      />
    {:else if tasksQuery.loading}
      <LoadingSpinner />
    {:else if tasksQuery.current && tasksQuery.current.length === 0}
      <EmptyState
        title={m.admin_tasks_no_tasks_title()}
        description={m.admin_tasks_no_tasks_description()}
        icon={ListTodo}
      />
    {:else if tasksQuery.current}
      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {#each tasksQuery.current as task (task.id)}
          <Card.Root
            class="group relative overflow-hidden border-border transition-all duration-300 hover:shadow-lg"
          >
            <div
              class="absolute inset-0 bg-linear-to-br from-primary/5 via-secondary/5 to-primary/10 opacity-30 transition-opacity duration-300 group-hover:opacity-50"
            ></div>

            <Card.Header class="relative">
              <div class="flex items-start justify-between gap-2">
                <span
                  class="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary"
                >
                  #{task.id}
                </span>
              </div>
              <Card.Title class="mt-3 flex items-start gap-2 text-lg">
                <ListTodo class="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <span class="wrap-break-word">{task.title}</span>
              </Card.Title>
            </Card.Header>

            <Card.Content class="relative">
              <div class="space-y-2 text-sm text-muted-foreground">
                <p>{m.admin_contest_tasks_created()}: {formatDate(task.createdAt)}</p>
              </div>

              <div class="mt-4">
                <Button
                  onclick={() => openDialog(task.id)}
                  class="w-full transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                >
                  <Plus class="mr-2 h-4 w-4" />
                  {m.admin_contest_tasks_add_button()}
                </Button>
              </div>
            </Card.Content>
          </Card.Root>
        {/each}
      </div>
    {/if}
  </div>
</div>

<!-- Add Task Dialog -->
<Dialog.Root bind:open={dialogOpen}>
  <Dialog.Content class="max-w-2xl">
    <Dialog.Header>
      <Dialog.Title>{m.admin_contest_tasks_dialog_title()}</Dialog.Title>
      <Dialog.Description>
        {m.admin_contest_tasks_dialog_description()}
      </Dialog.Description>
    </Dialog.Header>

    <form
      {...addTaskToContest.enhance(async ({ submit }: { submit: () => Promise<void> }) => {
        try {
          await submit();
          toast.success(m.admin_contest_tasks_add_success());
          dialogOpen = false;
          selectedTaskId = null;
        } catch (error: unknown) {
          if (isHttpError(error)) {
            toast.error(error.body.message);
          } else {
            toast.error(m.admin_contest_tasks_add_error());
          }
        }
      })}
      class="space-y-6"
    >
      <!-- Hidden inputs for form submission -->
      <input
        {...addTaskToContest.fields.contestId.as('number')}
        bind:value={data.contestId}
        hidden
      />
      <input {...addTaskToContest.fields.taskId.as('number')} bind:value={selectedTaskId} hidden />
      <input {...addTaskToContest.fields.startAt.as('text')} bind:value={startAtValue} hidden />
      <input {...addTaskToContest.fields.endAt.as('text')} bind:value={endAtValue} hidden />

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

          {#each addTaskToContest.fields.startAt.issues() as issue (issue.message)}
            <p class="text-sm text-destructive">{issue.message}</p>
          {/each}
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

            {#each addTaskToContest.fields.endAt.issues() as issue (issue.message)}
              <p class="text-sm text-destructive">{issue.message}</p>
            {/each}
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
          class="transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
        >
          {m.admin_contest_tasks_add_button()}
        </Button>
      </Dialog.Footer>
    </form>
  </Dialog.Content>
</Dialog.Root>
