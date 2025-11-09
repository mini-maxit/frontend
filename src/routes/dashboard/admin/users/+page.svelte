<script lang="ts">
  import { getUsers } from './users.remote';
  import { UsersList, UserEditDialog } from '$lib/components/dashboard/admin/users';
  import { LoadingSpinner, ErrorCard, EmptyState } from '$lib/components/common';
  import { Input } from '$lib/components/ui/input';
  import * as Select from '$lib/components/ui/select';
  import type { User } from '$lib/dto/user';
  import { UserRole } from '$lib/dto/jwt';
  import Users from '@lucide/svelte/icons/users';
  import Search from '@lucide/svelte/icons/search';
  import * as m from '$lib/paraglide/messages';

  const usersQuery = getUsers();

  let editDialogOpen = $state(false);
  let selectedUser = $state<User | null>(null);
  let searchQuery = $state('');
  let roleFilter = $state<{ value: string; label: string } | undefined>(undefined);

  const roleFilterOptions = [
    { value: 'all', label: 'All Roles' },
    { value: UserRole.Student, label: 'Student' },
    { value: UserRole.Teacher, label: 'Teacher' },
    { value: UserRole.Admin, label: 'Admin' }
  ];

  function handleEditUser(user: User) {
    selectedUser = user;
    editDialogOpen = true;
  }

  function handleEditSuccess() {
    usersQuery.refresh();
  }

  let filteredUsers = $derived.by(() => {
    if (!usersQuery.current) return [];

    let filtered = usersQuery.current;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(query) ||
          user.surname.toLowerCase().includes(query) ||
          user.username.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query)
      );
    }

    // Apply role filter
    if (roleFilter && roleFilter.value !== 'all') {
      filtered = filtered.filter((user) => user.role === roleFilter.value);
    }

    return filtered;
  });
</script>

<div class="space-y-6">
  <div class="flex items-center justify-between">
    <h1 class="text-3xl font-bold text-foreground">User Management</h1>
  </div>

  <!-- Filters Section -->
  <div class="space-y-4">
    <h2 class="text-2xl font-bold text-foreground">Search & Filter</h2>

    <div class="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      <!-- Search Input -->
      <div class="relative">
        <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search by name, username, or email..."
          bind:value={searchQuery}
          class="pl-9"
        />
      </div>

      <!-- Role Filter -->
      <Select.Root
        selected={roleFilter}
        onSelectedChange={(v) => {
          roleFilter = v;
        }}
      >
        <Select.Trigger class="w-full">
          <Select.Value placeholder="Filter by role" />
        </Select.Trigger>
        <Select.Content>
          {#each roleFilterOptions as option}
            <Select.Item value={option.value} label={option.label}>
              {option.label}
            </Select.Item>
          {/each}
        </Select.Content>
      </Select.Root>
    </div>
  </div>

  <!-- Users List Section -->
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold text-foreground">All Users</h2>
      {#if usersQuery.current}
        <p class="text-sm text-muted-foreground">
          Showing {filteredUsers.length} of {usersQuery.current.length} users
        </p>
      {/if}
    </div>

    {#if usersQuery.error}
      <ErrorCard
        title="Failed to load users"
        error={usersQuery.error}
        onRetry={() => usersQuery.refresh()}
      />
    {:else if usersQuery.loading}
      <LoadingSpinner />
    {:else if usersQuery.current && usersQuery.current.length === 0}
      <EmptyState
        title="No users found"
        description="There are no users in the system yet."
        icon={Users}
      />
    {:else if filteredUsers.length === 0}
      <EmptyState
        title="No matching users"
        description="No users match your search criteria. Try adjusting your filters."
        icon={Users}
      />
    {:else}
      <UsersList users={filteredUsers} onEdit={handleEditUser} />
    {/if}
  </div>
</div>

<UserEditDialog
  bind:open={editDialogOpen}
  user={selectedUser}
  onSuccess={handleEditSuccess}
/>
