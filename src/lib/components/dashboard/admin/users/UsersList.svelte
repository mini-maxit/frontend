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

<div class="space-y-3">
  {#each users as user (user.id)}
    <Card.Root class="transition-all duration-200 hover:shadow-lg">
      <Card.Content class="p-4">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <!-- Left Section: User Info -->
          <div class="flex flex-1 items-center gap-3">
            <div
              class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10"
            >
              <UserIcon class="h-5 w-5 text-primary" />
            </div>
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-2">
                <h3 class="font-semibold text-foreground">
                  {user.name}
                  {user.surname}
                </h3>
                <span
                  class="{getRoleBadgeClass(
                    user.role
                  )} rounded-full px-2.5 py-0.5 text-xs font-semibold"
                >
                  {getRoleBadgeLabel(user.role)}
                </span>
              </div>
              <p class="text-sm text-muted-foreground">@{user.username}</p>
            </div>
          </div>

          <!-- Middle Section: Details -->
          <div class="grid grid-cols-2 gap-3">
            <!-- Email -->
            <div class="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail class="h-4 w-4 flex-shrink-0" />
              <span class="truncate">{user.email}</span>
            </div>

            <!-- Created Date -->
            <div class="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar class="h-4 w-4 flex-shrink-0" />
              <span>
                {m.admin_users_created()}
                {formatDistanceToNow(new Date(user.createdAt), {
                  addSuffix: true
                })}
              </span>
            </div>
          </div>

          <!-- Right Section: Action -->
          <div class="lg:w-auto">
            <Button variant="outline" size="sm" onclick={() => onEdit(user)}>
              <Edit class="mr-2 h-4 w-4" />
              {m.admin_users_edit_user()}
            </Button>
          </div>
        </div>
      </Card.Content>
    </Card.Root>
  {/each}
</div>
