<script lang="ts">
  import * as Card from '$lib/components/ui/card';
  import FileQuestion from '@lucide/svelte/icons/file-question';
  import * as m from '$lib/paraglide/messages';
</script>

<Card.Root class="shadow-md">
  <Card.Content class="p-12">
    <div class="flex flex-col items-center gap-4 text-center">
      <div class="rounded-full bg-muted p-4">
        <FileQuestion class="h-12 w-12 text-muted-foreground" />
      </div>
      <div class="space-y-2">
        <h3 class="text-xl font-semibold text-foreground">
          {m.submissions_empty_title()}
        </h3>
        <p class="text-sm text-muted-foreground">
          {m.submissions_empty_description()}
        </p>
      </div>
    </div>
  </Card.Content>
</Card.Root>
