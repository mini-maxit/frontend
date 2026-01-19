<script lang="ts">
  import { Button, buttonVariants } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { Calendar } from '$lib/components/ui/calendar';
  import { Checkbox } from '$lib/components/ui/checkbox';
  import * as Dialog from '$lib/components/ui/dialog';
  import * as Popover from '$lib/components/ui/popover';
  import Plus from '@lucide/svelte/icons/plus';
  import CalendarIcon from '@lucide/svelte/icons/calendar';
  import { toast } from 'svelte-sonner';
  import * as m from '$lib/paraglide/messages';
  import { DateFormatter, type DateValue, getLocalTimeZone, today } from '@internationalized/date';
  import { cn, toLocalRFC3339 } from '$lib/utils';
  import { SvelteDate } from 'svelte/reactivity';
  import { superForm, defaults } from 'sveltekit-superforms';
  import { valibot } from 'sveltekit-superforms/adapters';
  import { CreateContestSchema } from '$lib/schemas';
  import { getContestsManagementInstance } from '$lib/services';

  interface Props {
    onSuccess?: () => void;
  }

  let { onSuccess }: Props = $props();

  const contestsService = getContestsManagementInstance();

  let dialogOpen = $state(false);

  // Initialize superform for SPA mode with client-side validation
  const { form, errors, enhance, submitting } = superForm(
    defaults(
      {
        name: '',
        description: '',
        startAt: '',
        endAt: '',
        isRegistrationOpen: false,
        isSubmissionOpen: false,
        isVisible: false
      },
      valibot(CreateContestSchema)
    ),
    {
      id: 'create-contest',
      validators: valibot(CreateContestSchema),
      SPA: true,
      dataType: 'json',
      resetForm: false,
      async onUpdate({ form }) {
        if (!contestsService || !form.valid) return;

        try {
          await contestsService.createContest({
            name: form.data.name,
            description: form.data.description,
            startAt: form.data.startAt,
            endAt: form.data.endAt || undefined,
            isRegistrationOpen: form.data.isRegistrationOpen,
            isSubmissionOpen: form.data.isSubmissionOpen,
            isVisible: form.data.isVisible
          });
          toast.success(m.admin_contests_create_success());
          dialogOpen = false;
          if (onSuccess) onSuccess();
        } catch (error) {
          console.error('Create contest error:', error);
          toast.error(m.admin_contests_create_error());
        }
      }
    }
  );

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
    tomorrow.setHours(tomorrow.getHours() + 24);
    const date = today(getLocalTimeZone()).add({ days: 1 });
    const time = `${String(tomorrow.getHours()).padStart(2, '0')}:${String(tomorrow.getMinutes()).padStart(2, '0')}`;
    return { date, time };
  }

  // Date and time states
  let startDate = $state<DateValue | undefined>(getDefaultStartDateTime().date);
  let startTime = $state<string>(getDefaultStartDateTime().time);
  let endDate = $state<DateValue | undefined>(getDefaultEndDateTime().date);
  let endTime = $state<string | null>(getDefaultEndDateTime().time);

  // Checkbox states
  let hasEndTime = $state(false);

  function getDateTimeString(date: DateValue | undefined, time: string | null): string {
    if (!date) return '';
    if (!time) return '';
    const [hours, minutes] = time.split(':').map(Number);
    const dateObj = date.toDate(getLocalTimeZone());
    dateObj.setHours(hours, minutes, 0, 0);

    // Build RFC3339 string using utility
    return toLocalRFC3339(dateObj);
  }

  // Update form values when date/time changes
  $effect(() => {
    $form.startAt = getDateTimeString(startDate, startTime);
    $form.endAt = hasEndTime ? getDateTimeString(endDate, endTime) : '';
  });
</script>

<Dialog.Root bind:open={dialogOpen}>
  <button
    onclick={() => (dialogOpen = true)}
    class="group relative overflow-hidden rounded-2xl border border-border bg-linear-to-br from-primary to-secondary p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
  >
    <div
      class="absolute inset-0 bg-linear-to-br from-white/0 to-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
    ></div>

    <div class="relative flex flex-col items-center gap-4 text-center">
      <div
        class="flex h-16 w-16 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110"
      >
        <Plus class="h-8 w-8 text-primary-foreground" />
      </div>
      <div>
        <h3 class="text-lg font-bold text-primary-foreground">
          {m.admin_contests_create_title()}
        </h3>
        <p class="mt-1 text-sm text-primary-foreground/80">
          {m.admin_contests_create_description()}
        </p>
      </div>
    </div>
  </button>

  <Dialog.Content class="max-w-2xl">
    <Dialog.Header>
      <Dialog.Title>{m.admin_contests_dialog_title()}</Dialog.Title>
      <Dialog.Description>
        {m.admin_contests_dialog_description()}
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
          {$submitting ? 'Creating...' : m.admin_contests_form_create()}
        </Button>
      </Dialog.Footer>
    </form>
  </Dialog.Content>
</Dialog.Root>
