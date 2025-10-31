<script lang="ts">
  import { LoadingSpinner, ErrorCard } from '$lib/components/common';
  import * as m from '$lib/paraglide/messages';
  import { Button } from '$lib/components/ui/button';
  import * as Card from '$lib/components/ui/card';
  import ListTodo from '@lucide/svelte/icons/list-todo';
  import Trophy from '@lucide/svelte/icons/trophy';
  import Target from '@lucide/svelte/icons/target';

  interface Props {
    data: {
      contestId: number;
    };
  }

  let { data }: Props = $props();

  // TODO: Add remote function to fetch contest details and tasks
  // For now, placeholder until we have the proper endpoint
</script>

<div class="space-y-6 p-4 sm:p-6 lg:p-8">
  <div class="space-y-2">
    <h1 class="text-4xl font-bold tracking-tight text-foreground">
      Contest Details
    </h1>
    <p class="text-lg text-muted-foreground">
      View contest information and available tasks
    </p>
  </div>

  <Card.Root>
    <Card.Header>
      <Card.Title class="flex items-center gap-2">
        <ListTodo class="h-5 w-5" />
        Contest Tasks
      </Card.Title>
    </Card.Header>
    <Card.Content>
      <p class="text-muted-foreground">
        Contest ID: {data.contestId}
      </p>
      <p class="text-sm text-muted-foreground mt-2">
        Task list will be displayed here once the endpoint is connected.
      </p>
    </Card.Content>
  </Card.Root>
</div>
