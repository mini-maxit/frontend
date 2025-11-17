<script lang="ts">
  import type { User } from '$lib/dto/user';
  import * as Card from '$lib/components/ui/card';
  import { Button } from '$lib/components/ui/button';
  import UserIcon from '@lucide/svelte/icons/user';
  import Mail from '@lucide/svelte/icons/mail';
  import Calendar from '@lucide/svelte/icons/calendar';
  import Edit from '@lucide/svelte/icons/edit';
  import { formatDistanceToNow } from 'date-fns';
  import * as m from '$lib/paraglide/messages';

  interface UsersListProps {
    users: User[];
    onEdit: (user: User) => void;
  }

  let { users, onEdit }: UsersListProps = $props();

  function getRoleBadgeClass(role: string): string {
    switch (role) {
      case 'admin':
        return 'bg-primary/10 text-primary border border-primary/20';
      case 'teacher':
        return 'bg-secondary/10 text-secondary border border-secondary/20';
      case 'student':
        return 'bg-muted text-muted-foreground border border-border';
      default:
        return 'bg-muted text-muted-foreground border border-border';
    }
  }

  function getRoleBadgeLabel(role: string): string {
    switch (role) {
      case 'admin':
        return m.admin_users_role_admin();
      case 'teacher':
        return m.admin_users_role_teacher();
      case 'student':
        return m.admin_users_role_student();
      default:
        return role;
    }
  }
</script>

<div class="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {#each users as user (user.id)}
    <Card.Root class="transition-all duration-200 hover:shadow-lg">
      <Card.Header>
        <div class="flex items-start justify-between">
          <div class="flex items-center gap-3">
            <div class="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <UserIcon class="h-5 w-5 text-primary" />
            </div>
            <div>
              <Card.Title class="text-lg">
                {user.name}
                {user.surname}
              </Card.Title>
              <p class="text-sm text-muted-foreground">@{user.username}</p>
            </div>
          </div>
          <span
            class="{getRoleBadgeClass(user.role)} rounded-full px-2.5 py-0.5 text-xs font-semibold"
          >
            {getRoleBadgeLabel(user.role)}
          </span>
        </div>
      </Card.Header>

      <Card.Content class="space-y-3">
        <div class="flex items-center gap-2 text-sm text-muted-foreground">
          <Mail class="h-4 w-4" />
          <span class="truncate">{user.email}</span>
        </div>

        <div class="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar class="h-4 w-4" />
          <span>
            {m.admin_users_created()}
            {formatDistanceToNow(new Date(user.createdAt), {
              addSuffix: true
            })}
          </span>
        </div>
      </Card.Content>

      <Card.Footer>
        <Button variant="outline" size="sm" class="w-full" onclick={() => onEdit(user)}>
          <Edit class="mr-2 h-4 w-4" />
          {m.admin_users_edit_user()}
        </Button>
      </Card.Footer>
    </Card.Root>
  {/each}
</div>
