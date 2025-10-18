<script lang="ts">
  import * as m from '$lib/paraglide/messages';
  import Loader from '@lucide/svelte/icons/loader-circle';
</script>

<div class="flex flex-col items-center justify-center space-y-4 py-12">
  <Loader class="h-8 w-8 animate-spin text-primary" />
  <p class="text-sm text-muted-foreground">{m.user_tasks_loading()}</p>
</div>
