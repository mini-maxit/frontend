<script lang="ts">
  import { toggleTaskVisibility } from '$routes/dashboard/teacher/tasks/tasks.remote';
  import { Checkbox } from '$lib/components/ui/checkbox';
  import { Label } from '$lib/components/ui/label';
  import { Button } from '$lib/components/ui/button';
  import * as Dialog from '$lib/components/ui/dialog';
  import { toast } from 'svelte-sonner';
  import * as m from '$lib/paraglide/messages';

  interface TaskVisibilityToggleProps {
    taskId: number;
    taskTitle: string;
    initialVisibility: boolean;
  }

  let { taskId, taskTitle, initialVisibility }: TaskVisibilityToggleProps = $props();

  let isVisible = $state(initialVisibility);
  let showConfirmDialog = $state(false);
  let pendingVisibility = $state(false);
  let checkboxKey = $state(0);

  function handleCheckboxChange(checked: boolean) {
    pendingVisibility = checked;
    showConfirmDialog = true;
  }

  async function confirmToggle() {
    try {
      await toggleTaskVisibility({ taskId, isVisible: pendingVisibility });
      isVisible = pendingVisibility;
      showConfirmDialog = false;
      toast.success(
        pendingVisibility ? m.admin_tasks_visibility_enabled() : m.admin_tasks_visibility_disabled()
      );
    } catch (error) {
      toast.error(m.admin_tasks_visibility_error());
      console.error('Failed to toggle visibility:', error);
    }
  }

  function cancelToggle() {
    showConfirmDialog = false;
    checkboxKey++; // Force checkbox to re-render with current isVisible value
  }
</script>

<div class="flex items-center space-x-2">
  {#key checkboxKey}
    <Checkbox
      id="visibility-{taskId}"
      checked={isVisible}
      onCheckedChange={handleCheckboxChange}
      class={isVisible ? '' : 'bg-card'}
    />
  {/key}
  <Label
    for="visibility-{taskId}"
    class="cursor-pointer text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
  >
    {m.admin_tasks_card_visible_to_users()}
  </Label>
</div>

<Dialog.Root bind:open={showConfirmDialog}>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>{m.admin_tasks_visibility_confirm_title()}</Dialog.Title>
      <Dialog.Description>
        {pendingVisibility
          ? m.admin_tasks_visibility_confirm_enable({ taskTitle })
          : m.admin_tasks_visibility_confirm_disable({ taskTitle })}
      </Dialog.Description>
    </Dialog.Header>
    <Dialog.Footer>
      <Button type="button" variant="outline" onclick={cancelToggle}>
        {m.admin_tasks_form_cancel()}
      </Button>
      <Button type="button" onclick={confirmToggle}>
        {m.admin_tasks_visibility_confirm()}
      </Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
