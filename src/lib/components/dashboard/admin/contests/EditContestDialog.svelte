<script lang="ts">
  import { Button, buttonVariants } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { Calendar } from '$lib/components/ui/calendar';
  import { Checkbox } from '$lib/components/ui/checkbox';
  import * as Dialog from '$lib/components/ui/dialog';
  import * as Popover from '$lib/components/ui/popover';
  import CalendarIcon from '@lucide/svelte/icons/calendar';
  import { toast } from 'svelte-sonner';
  import { isHttpError, type HttpError } from '@sveltejs/kit';
  import * as m from '$lib/paraglide/messages';
  import { DateFormatter, type DateValue, getLocalTimeZone, parseDate } from '@internationalized/date';
  import { cn } from '$lib/utils';
  import type { Contest } from '$lib/dto/contest';
  import type { UpdateContestForm } from '$routes/dashboard/admin/contests/contests.remote';

  interface Props {
    contest: Contest;
    updateContest: UpdateContestForm;
    dialogOpen: boolean;
  }

  let { contest, updateContest, dialogOpen = $bindable() }: Props = $props();

  // Date formatters
  const df = new DateFormatter('en-US', {
    dateStyle: 'long'
  });

  // Parse existing contest dates
  function parseDateTime(dateString: string | null): { date: DateValue | undefined; time: string } {
    if (!dateString) {
      const now = new Date();
      return {
        date: undefined,
        time: `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
      };
    }
    
    const date = new Date(dateString);
    return {
      date: parseDate(dateString.split('T')[0]),
      time: `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
    };
  }

  // Initialize state with contest values
  const startDateTime = parseDateTime(contest.startAt);
  const endDateTime = parseDateTime(contest.endAt);

  let startDate = $state<DateValue | undefined>(startDateTime.date);
  let startTime = $state<string>(startDateTime.time);
  let endDate = $state<DateValue | undefined>(endDateTime.date);
  let endTime = $state<string | null>(endDateTime.time);

  // Checkbox states - need to get from the contest data
  // Since the Contest interface doesn't have these fields in the response,
  // we'll default them to true for now
  let isRegistrationOpen = $state(true);
  let isSubmissionOpen = $state(true);
  let isVisible = $state(true);
  let hasEndTime = $state(!!contest.endAt);

  function getDateTimeString(date: DateValue | undefined, time: string | null): string {
    if (!date) return '';
    if (!time) return '';
    const [hours, minutes] = time.split(':').map(Number);
    const dateObj = date.toDate(getLocalTimeZone());
    dateObj.setHours(hours, minutes, 0, 0);

    // Build YYYY-MM-DDTHH:mm string from local components to avoid timezone conversion
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    const hour = String(dateObj.getHours()).padStart(2, '0');
    const minute = String(dateObj.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hour}:${minute}`;
  }

  let startAtValue = $derived(getDateTimeString(startDate, startTime));
  let endAtValue = $derived(hasEndTime ? getDateTimeString(endDate, endTime) : '');
</script>

<Dialog.Root bind:open={dialogOpen}>
  <Dialog.Content class="max-w-2xl">
    <Dialog.Header>
      <Dialog.Title>{m.admin_contests_edit_dialog_title()}</Dialog.Title>
      <Dialog.Description>
        {m.admin_contests_edit_dialog_description()}
      </Dialog.Description>
    </Dialog.Header>

    <form
      {...updateContest.enhance(async ({ submit }) => {
        try {
          await submit();
          toast.success(m.admin_contests_edit_success());
          dialogOpen = false;
        } catch (error: HttpError | unknown) {
          if (isHttpError(error)) {
            toast.error(error.body.message);
          } else {
            toast.error(m.admin_contests_edit_error());
          }
        }
      })}
      class="space-y-6"
    >
      <!-- Hidden inputs for form submission -->
      <input
        {...updateContest.fields.id.as('number')}
        type="hidden"
        value={contest.id}
      />
      <input
        {...updateContest.fields.startAt.as('datetime-local')}
        bind:value={startAtValue}
        hidden
      />
      <input {...updateContest.fields.endAt.as('datetime-local')} bind:value={endAtValue} hidden />
      <input
        {...updateContest.fields.isRegistrationOpen.as('checkbox')}
        type="checkbox"
        bind:checked={isRegistrationOpen}
        hidden
      />
      <input
        {...updateContest.fields.isSubmissionOpen.as('checkbox')}
        type="checkbox"
        bind:checked={isSubmissionOpen}
        hidden
      />
      <input
        {...updateContest.fields.isVisible.as('checkbox')}
        type="checkbox"
        bind:checked={isVisible}
        hidden
      />

      <div class="space-y-2">
        <Label for="name">{m.admin_contests_form_name_label()}</Label>
        <Input
          {...updateContest.fields.name.as('text')}
          id="name"
          name="name"
          value={contest.name}
          autocomplete="off"
          placeholder={m.admin_contests_form_name_placeholder()}
          required
          class="transition-all duration-200 focus:ring-2 focus:ring-primary"
        />
        {#each updateContest.fields.name.issues() ?? [] as issue (issue.message)}
          <p class="text-sm text-destructive">{issue.message}</p>
        {/each}
      </div>

      <div class="space-y-2">
        <Label for="description">{m.admin_contests_form_description_label()}</Label>
        <textarea
          {...updateContest.fields.description.as('text')}
          id="description"
          name="description"
          value={contest.description}
          autocomplete="off"
          placeholder={m.admin_contests_form_description_placeholder()}
          required
          rows="4"
          class="flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
        ></textarea>
        {#each updateContest.fields.description.issues() ?? [] as issue (issue.message)}
          <p class="text-sm text-destructive">{issue.message}</p>
        {/each}
      </div>

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
              class="[color-scheme:light] transition-all duration-200 focus:ring-2 focus:ring-primary dark:[color-scheme:dark]"
            />
          </div>

          {#each updateContest.fields.startAt.issues() ?? [] as issue (issue.message)}
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
                class="[color-scheme:light] transition-all duration-200 focus:ring-2 focus:ring-primary dark:[color-scheme:dark]"
              />
            </div>

            {#each updateContest.fields.endAt.issues() ?? [] as issue (issue.message)}
              <p class="text-sm text-destructive">{issue.message}</p>
            {/each}
          {/if}
        </div>
      </div>

      <div class="space-y-3">
        <Label>{m.admin_contests_form_options_label()}</Label>

        <div class="flex items-center gap-3">
          <Checkbox id="isRegistrationOpen" bind:checked={isRegistrationOpen} />
          <Label for="isRegistrationOpen" class="cursor-pointer text-sm font-normal">
            {m.admin_contests_form_registration_open()}
          </Label>
        </div>

        <div class="flex items-center gap-3">
          <Checkbox id="isSubmissionOpen" bind:checked={isSubmissionOpen} />
          <Label for="isSubmissionOpen" class="cursor-pointer text-sm font-normal">
            {m.admin_contests_form_submission_open()}
          </Label>
        </div>

        <div class="flex items-center gap-3">
          <Checkbox id="isVisible" bind:checked={isVisible} />
          <Label for="isVisible" class="cursor-pointer text-sm font-normal">
            {m.admin_contests_form_visible()}
          </Label>
        </div>
      </div>

      <Dialog.Footer>
        <Button
          type="button"
          variant="outline"
          onclick={() => {
            dialogOpen = false;
          }}
        >
          {m.admin_contests_form_cancel()}
        </Button>
        <Button
          type="submit"
          class="transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
        >
          {m.admin_contests_form_update()}
        </Button>
      </Dialog.Footer>
    </form>
  </Dialog.Content>
</Dialog.Root>

