<script lang="ts">
  import { Card, CardContent } from '#lib/components/ui/card/index.js';
  import Info from '@lucide/svelte/icons/info';
  import * as m from '#lib/paraglide/messages.js';

  interface Props {
    resource: 'task' | 'contest' | 'group';
  }

  let { resource }: Props = $props();

  const levels = $derived([
    {
      label: m.task_collaborators_permission_edit(),
      text: {
        task: m.collab_info_edit_task(),
        contest: m.collab_info_edit_contest(),
        group: m.collab_info_edit_group()
      }[resource]
    },
    { label: m.task_collaborators_permission_manage(), text: m.collab_info_manage() },
    { label: m.task_collaborators_permission_owner(), text: m.collab_info_owner() }
  ]);
</script>

<Card>
  <CardContent class="space-y-3 pt-6">
    <h2 class="flex items-center gap-2 text-lg font-semibold text-foreground">
      <Info class="h-4 w-4" />
      {m.collab_info_title()}
    </h2>
    <dl class="space-y-2 text-sm">
      {#each levels as level (level.label)}
        <div>
          <dt class="inline font-semibold text-foreground">{level.label}:</dt>
          <dd class="inline text-muted-foreground">{level.text}</dd>
        </div>
      {/each}
    </dl>
    <p class="text-xs text-muted-foreground">{m.collab_info_note()}</p>
  </CardContent>
</Card>
