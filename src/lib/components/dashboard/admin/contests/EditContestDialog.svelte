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
  import * as m from '$lib/paraglide/messages';
  import {
    DateFormatter,
    type DateValue,
    getLocalTimeZone,
    parseDate
  } from '@internationalized/date';
  import { cn, toLocalRFC3339 } from '$lib/utils';
  import type { CreatedContest } from '$lib/dto/contest';
  import { superForm, defaults } from 'sveltekit-superforms';
  import { valibot } from 'sveltekit-superforms/adapters';
  import { UpdateContestSchema } from '$lib/schemas';
  import { getContestsManagementInstance } from '$lib/services';

  interface Props {
    contest: CreatedContest;
    dialogOpen: boolean;
    onSuccess?: () => void;
  }

  let { contest, dialogOpen = $bindable(), onSuccess }: Props = $props();

  const contestsService = getContestsManagementInstance();

  // Initialize superform for SPA mode with client-side validation
  const { form, errors, enhance, submitting } = superForm(
    defaults(
      {
        id: contest.id,
        name: contest.name,
        description: contest.description,
        startAt: contest.startAt,
        endAt: contest.endAt || '',
        isRegistrationOpen: contest.isRegistrationOpen,
        isSubmissionOpen: contest.isSubmissionOpen,
        isVisible: contest.isVisible
      },
      valibot(UpdateContestSchema)
    ),
    {
      id: `edit-contest-${contest.id}`,
      validators: valibot(UpdateContestSchema),
      SPA: true,
      dataType: 'json',
      resetForm: false,
      async onUpdate({ form }) {
        if (!contestsService || !form.valid) return;

        try {
          await contestsService.updateContest(form.data.id, {
            name: form.data.name,
            description: form.data.description,
            startAt: form.data.startAt,
            endAt: form.data.endAt || undefined,
            isRegistrationOpen: form.data.isRegistrationOpen,
            isSubmissionOpen: form.data.isSubmissionOpen,
            isVisible: form.data.isVisible
          });
          toast.success(m.admin_contests_edit_success());
          dialogOpen = false;
          if (onSuccess) onSuccess();
        } catch (error) {
          console.error('Update contest error:', error);
          toast.error(m.admin_contests_edit_error());
        }
      }
    }
  );

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
  let hasEndTime = $state(!!contest.endAt);

  function getDateTimeString(date: DateValue | undefined, time: string | null): string {
    if (!date) return '';
    if (!time) return '';
    const [hours, minutes] = time.split(':').map(Number);
    const dateObj = date.toDate(getLocalTimeZone());
    dateObj.setHours(hours, minutes, 0, 0);

    return toLocalRFC3339(dateObj);
  }

  // Update form values when date/time changes
  $effect(() => {
    $form.startAt = getDateTimeString(startDate, startTime);
    $form.endAt = hasEndTime ? getDateTimeString(endDate, endTime) : '';
  });
</script>

<Dialog.Root bind:open={dialogOpen}>
  <Dialog.Content class="max-w-2xl">
    <Dialog.Header>
      <Dialog.Title>{m.admin_contests_edit_dialog_title()}</Dialog.Title>
      <Dialog.Description>
        {m.admin_contests_edit_dialog_description()}
      </Dialog.Description>
    </Dialog.Header>

    <form method="POST" use:enhance class="space-y-6">
      <div class="space-y-2">
        <Label for="name">{m.admin_contests_form_name_label()}</Label>
        <Input
          id="name"
          name="name"
          type="text"
          bind:value={$form.name}
          disabled={$submitting}
          aria-invalid={$errors.name ? 'true' : undefined}
          placeholder={m.admin_contests_form_name_placeholder()}
          class="transition-all duration-200 focus:ring-2 focus:ring-primary"
        />
        {#if $errors.name}
          <p class="text-sm text-destructive">{$errors.name}</p>
        {/if}
      </div>

      <div class="space-y-2">
        <Label for="description">{m.admin_contests_form_description_label()}</Label>
        <textarea
          id="description"
          name="description"
          bind:value={$form.description}
          disabled={$submitting}
          aria-invalid={$errors.description ? 'true' : undefined}
          placeholder={m.admin_contests_form_description_placeholder()}
          rows="4"
          class="flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
        ></textarea>
        {#if $errors.description}
          <p class="text-sm text-destructive">{$errors.description}</p>
        {/if}
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
              class="scheme-light transition-all duration-200 focus:ring-2 focus:ring-primary dark:scheme-dark"
            />
          </div>

          {#if $errors.startAt}
            <p class="text-sm text-destructive">{$errors.startAt}</p>
          {/if}
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

            {#if $errors.endAt}
              <p class="text-sm text-destructive">{$errors.endAt}</p>
            {/if}
          {/if}
        </div>
      </div>

      <div class="space-y-3">
        <Label>{m.admin_contests_form_options_label()}</Label>

        <div class="flex items-center gap-3">
          <Checkbox
            id="isRegistrationOpen"
            name="isRegistrationOpen"
            bind:checked={$form.isRegistrationOpen}
            disabled={$submitting}
          />
          <Label for="isRegistrationOpen" class="cursor-pointer text-sm font-normal">
            {m.admin_contests_form_registration_open()}
          </Label>
        </div>

        <div class="flex items-center gap-3">
          <Checkbox
            id="isSubmissionOpen"
            name="isSubmissionOpen"
            bind:checked={$form.isSubmissionOpen}
            disabled={$submitting}
          />
          <Label for="isSubmissionOpen" class="cursor-pointer text-sm font-normal">
            {m.admin_contests_form_submission_open()}
          </Label>
        </div>

        <div class="flex items-center gap-3">
          <Checkbox
            id="isVisible"
            name="isVisible"
            bind:checked={$form.isVisible}
            disabled={$submitting}
          />
          <Label for="isVisible" class="cursor-pointer text-sm font-normal">
            {m.admin_contests_form_visible()}
          </Label>
        </div>
      </div>

      <Dialog.Footer>
        <Button
          type="button"
          variant="outline"
          onclick={() => (dialogOpen = false)}
          disabled={$submitting}
        >
          {m.admin_contests_form_cancel()}
        </Button>
        <Button
          type="submit"
          disabled={$submitting}
          class="transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
        >
          {$submitting ? 'Updating...' : m.admin_contests_form_update()}
        </Button>
      </Dialog.Footer>
    </form>
  </Dialog.Content>
</Dialog.Root>
