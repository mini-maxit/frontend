<script lang="ts">
  import Trophy from '@lucide/svelte/icons/trophy';
  import * as m from '$lib/paraglide/messages';
</script>

<div
  class="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/30 py-12 text-center"
>
  <Trophy class="h-12 w-12 text-muted-foreground" />
  <p class="mt-4 text-lg font-medium text-foreground">{m.admin_contests_no_contests_title()}</p>
  <p class="mt-1 text-sm text-muted-foreground">{m.admin_contests_no_contests_description()}</p>
</div>
