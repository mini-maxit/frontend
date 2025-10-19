<script lang="ts">
  import * as Card from '$lib/components/ui/card';
  import Loader from '@lucide/svelte/icons/loader-circle';
  import * as m from '$lib/paraglide/messages';
</script>

<Card.Root class="shadow-md">
  <Card.Content class="flex items-center justify-center p-12">
    <div class="flex flex-col items-center gap-4 text-center">
      <Loader class="h-12 w-12 animate-spin text-primary" />
      <p class="text-lg font-medium text-muted-foreground">
        {m.submissions_loading()}
      </p>
    </div>
  </Card.Content>
</Card.Root>
