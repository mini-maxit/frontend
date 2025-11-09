<script lang="ts">
  import type { User } from '$lib/dto/user';
  import * as Card from '$lib/components/ui/card';
  import { Button } from '$lib/components/ui/button';
  import UserIcon from '@lucide/svelte/icons/user';
  import Mail from '@lucide/svelte/icons/mail';
  import Calendar from '@lucide/svelte/icons/calendar';
  import Edit from '@lucide/svelte/icons/edit';
  import { formatDistanceToNow } from 'date-fns';

  interface UsersListProps {
    users: User[];
    onEdit: (user: User) => void;
  }

  let { users, onEdit }: UsersListProps = $props();

  function getRoleBadgeClass(role: string): string {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'teacher':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'student':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  }
</script>

<div class="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {#each users as user (user.id)}
    <Card.Root class="transition-all duration-200 hover:shadow-lg">
      <Card.Header>
        <div class="flex items-start justify-between">
          <div class="flex items-center gap-3">
            <div
              class="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10"
            >
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
            class="{getRoleBadgeClass(
              user.role
            )} rounded-full px-2.5 py-0.5 text-xs font-semibold"
          >
            {user.role}
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
            Created {formatDistanceToNow(new Date(user.createdAt), {
              addSuffix: true
            })}
          </span>
        </div>
      </Card.Content>

      <Card.Footer>
        <Button
          variant="outline"
          size="sm"
          class="w-full"
          onclick={() => onEdit(user)}
        >
          <Edit class="mr-2 h-4 w-4" />
          Edit User
        </Button>
      </Card.Footer>
    </Card.Root>
  {/each}
</div>
