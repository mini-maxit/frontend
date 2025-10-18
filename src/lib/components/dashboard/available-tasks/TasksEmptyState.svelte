<script lang="ts">
  import * as Card from '$lib/components/ui/card';
  import FileQuestion from '@lucide/svelte/icons/file-question';
  import * as m from '$lib/paraglide/messages';
</script>

<Card.Root>
  <Card.Content class="flex flex-col items-center justify-center space-y-4 py-12">
    <FileQuestion class="h-12 w-12 text-muted-foreground" />
    <div class="text-center">
      <h3 class="font-semibold">{m.user_tasks_no_tasks()}</h3>
      <p class="text-sm text-muted-foreground">{m.user_tasks_no_tasks_description()}</p>
    </div>
  </Card.Content>
</Card.Root>
