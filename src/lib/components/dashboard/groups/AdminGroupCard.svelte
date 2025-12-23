<script lang="ts">
  import * as Card from '$lib/components/ui/card';
  import { Button } from '$lib/components/ui/button';
  import Users from '@lucide/svelte/icons/users';
  import Calendar from '@lucide/svelte/icons/calendar';
  import User from '@lucide/svelte/icons/user';
  import Clock from '@lucide/svelte/icons/clock';
  import type { Group } from '$lib/dto/group';
  import * as m from '$lib/paraglide/messages';
  import { formatDate } from '$lib/utils';

  interface AdminGroupCardProps {
    group: Group;
  }

  let { group }: AdminGroupCardProps = $props();
</script>

<Card.Root
  class="group relative flex h-full flex-col overflow-hidden border-border shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
>
  <!-- Gradient Background Overlay -->
  <div
    class="absolute inset-0 bg-linear-to-br from-primary/5 via-secondary/5 to-primary/10 opacity-30 transition-opacity duration-300 group-hover:opacity-50"
  ></div>

  <Card.Header class="relative">
    <div class="flex items-start justify-between gap-2">
      <span
        class="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary"
      >
        {m.admin_groups_card_id_prefix()}{group.id}
      </span>
    </div>
    <Card.Title
      class="mt-3 flex items-start gap-2 text-lg transition-colors group-hover:text-primary"
    >
      <Users class="mt-0.5 h-5 w-5 flex-shrink-0" />
      <span class="break-words">{group.name}</span>
    </Card.Title>
  </Card.Header>

  <Card.Content class="relative mt-auto space-y-4">
    <!-- Group Metadata -->
    <div class="space-y-2">
      <div class="flex items-center gap-2 text-sm">
        <Calendar class="h-4 w-4 text-muted-foreground" />
        <span class="text-muted-foreground">{m.admin_groups_card_created()}</span>
        <span class="font-medium text-foreground">{formatDate(group.createdAt)}</span>
      </div>

      <div class="flex items-center gap-2 text-sm">
        <Clock class="h-4 w-4 text-muted-foreground" />
        <span class="text-muted-foreground">{m.admin_groups_card_updated()}</span>
        <span class="font-medium text-foreground">{formatDate(group.updatedAt)}</span>
      </div>

      <div class="flex items-center gap-2 text-sm">
        <User class="h-4 w-4 text-muted-foreground" />
        <span class="text-muted-foreground">{m.admin_groups_card_created_by()}</span>
        <span class="font-medium text-foreground"
          >{m.admin_groups_card_user_prefix()}{group.createdBy}</span
        >
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex flex-col gap-2">
      <Button
        variant="outline"
        class="w-full transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
      >
        {m.admin_groups_card_view_details()}
      </Button>
    </div>
  </Card.Content>
</Card.Root>
