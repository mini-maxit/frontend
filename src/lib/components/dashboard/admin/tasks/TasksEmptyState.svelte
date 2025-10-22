<script lang="ts">
  import Upload from '@lucide/svelte/icons/upload';
  import * as m from '$lib/paraglide/messages';
</script>

<div
  class="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/30 py-12 text-center"
>
  <Upload class="h-12 w-12 text-muted-foreground" />
  <p class="mt-4 text-lg font-medium text-foreground">{m.admin_tasks_no_tasks_title()}</p>
  <p class="mt-1 text-sm text-muted-foreground">{m.admin_tasks_no_tasks_description()}</p>
</div>
