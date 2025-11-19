<script lang="ts">
  import { getUsers } from './users.remote';
  import { UsersList, UserEditDialog } from '$lib/components/dashboard/admin/users';
  import { LoadingSpinner, ErrorCard, EmptyState } from '$lib/components/common';
  import { Input } from '$lib/components/ui/input';
  import * as Select from '$lib/components/ui/select';
  import type { User } from '$lib/dto/user';
  import { UserRole } from '$lib/dto/jwt';
  import { SortDirection, UserSortKey } from '$lib/dto/pagination';
  import Users from '@lucide/svelte/icons/users';
  import Search from '@lucide/svelte/icons/search';
  import * as m from '$lib/paraglide/messages';

  let limit = $state(20);
  let offset = $state(0);
  let sortKey = $state<UserSortKey>(UserSortKey.Id);
  let sortDir = $state<SortDirection>(SortDirection.Asc);

  let usersQuery = $derived(
    getUsers({
      limit,
      offset,
      sort: `${sortKey}:${sortDir}`
    })
  );

  let editDialogOpen = $state(false);
  let selectedUser = $state<User | null>(null);
  let searchQuery = $state('');
  let roleFilterValue = $state<string>('all');

  const roleFilterOptions = [
    { value: 'all', label: m.admin_users_filter_all_roles() },
    { value: UserRole.Student, label: m.admin_users_role_student() },
    { value: UserRole.Teacher, label: m.admin_users_role_teacher() },
    { value: UserRole.Admin, label: m.admin_users_role_admin() }
  ];

  const roleFilterLabel = $derived.by(() => {
    const option = roleFilterOptions.find((opt) => opt.value === roleFilterValue);
    return option?.label || m.admin_users_filter_role_label();
  });

  function handleEditUser(user: User) {
    selectedUser = user;
    editDialogOpen = true;
  }

  function handleEditSuccess() {
    usersQuery.refresh();
  }

  function handleChangePage(page: number) {
    offset = (page - 1) * limit;
  }

  function handleChangeSort({ key, dir }: { key: UserSortKey; dir: SortDirection }) {
    sortKey = key;
    sortDir = dir;
    offset = 0;
  }

  function handleChangeLimit(newLimit: number) {
    limit = newLimit;
    offset = 0;
  }

  let filteredUsers: User[] = $derived.by(() => {
    if (!usersQuery.current) return [];

    let filtered = usersQuery.current.items;

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

    if (roleFilterValue !== 'all') {
      filtered = filtered.filter((user) => user.role === roleFilterValue);
    }

    return filtered;
  });
</script>

<div class="space-y-6">
  <div class="flex items-center justify-between">
    <h1 class="text-3xl font-bold text-foreground">{m.admin_users_title()}</h1>
  </div>

  <div class="space-y-4">
    <h2 class="text-2xl font-bold text-foreground">{m.admin_users_search_filter()}</h2>

    <div class="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      <div class="relative">
        <Search class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder={m.admin_users_search_placeholder()}
          bind:value={searchQuery}
          class="pl-9"
        />
      </div>

      <Select.Root
        type="single"
        value={roleFilterValue}
        onValueChange={(value) => {
          if (value) {
            roleFilterValue = value;
          }
        }}
      >
        <Select.Trigger class="w-full">
          {roleFilterLabel}
        </Select.Trigger>
        <Select.Content>
          {#each roleFilterOptions as option (option.value)}
            <Select.Item value={option.value}>
              {option.label}
            </Select.Item>
          {/each}
        </Select.Content>
      </Select.Root>
    </div>
  </div>

  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold text-foreground">{m.admin_users_all_users()}</h2>
      {#if usersQuery.current}
        <p class="text-sm text-muted-foreground">
          {m.admin_users_showing_count({
            count: filteredUsers.length,
            total: filteredUsers.length
          })}
        </p>
      {/if}
    </div>

    {#if usersQuery.error}
      <ErrorCard
        title={m.admin_users_load_error()}
        error={usersQuery.error}
        onRetry={() => usersQuery.refresh()}
      />
    {:else if usersQuery.loading}
      <LoadingSpinner />
    {:else if usersQuery.current && usersQuery.current.items.length === 0}
      <EmptyState
        title={m.admin_users_no_users_title()}
        description={m.admin_users_no_users_description()}
        icon={Users}
      />
    {:else if filteredUsers.length === 0}
      <EmptyState
        title={m.admin_users_no_matching_title()}
        description={m.admin_users_no_matching_description()}
        icon={Users}
      />
    {:else}
      <UsersList
        users={filteredUsers}
        total={usersQuery.current ? usersQuery.current.pagination.totalItems : 0}
        {limit}
        {offset}
        {sortKey}
        {sortDir}
        onEdit={handleEditUser}
        onChangePage={handleChangePage}
        onChangeSort={handleChangeSort}
        onChangeLimit={handleChangeLimit}
      />
    {/if}
  </div>
</div>

<UserEditDialog bind:open={editDialogOpen} user={selectedUser} onSuccess={handleEditSuccess} />
