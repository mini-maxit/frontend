<script lang="ts">
  import { createParameterizedQuery } from '#lib/utils/query.svelte.js';
  import { getUserInstance } from '#lib/services/index.js';
  import { UsersList, UserEditDialog } from '#lib/components/dashboard/admin/users/index.js';
  import { LoadingSpinner, ErrorCard, EmptyState } from '#lib/components/common/index.js';
  import { Input } from '#lib/components/ui/input/index.js';
  import * as Select from '#lib/components/ui/select/index.js';
  import type { User } from '#lib/dto/user.js';
  import { UserRole } from '#lib/dto/jwt.js';
  import { SortDirection, UserSortKey } from '#lib/dto/pagination.js';
  import { readIntParam, readParam, writeSearchParams } from '#lib/utils/url-state.js';
  import { page } from '$app/state';
  import Users from '@lucide/svelte/icons/users';
  import Search from '@lucide/svelte/icons/search';
  import * as m from '#lib/paraglide/messages.js';

  const userService = getUserInstance();

  const initialSort = readParam(page.url, 'sort');
  const [initialSortKey, initialSortDir] = initialSort.split(':');
  const isValidSortKey = Object.values(UserSortKey).includes(initialSortKey as UserSortKey);
  const isValidSortDir = Object.values(SortDirection).includes(initialSortDir as SortDirection);

  let limit = $state(readIntParam(page.url, 'limit', 20));
  let offset = $state(readIntParam(page.url, 'offset', 0));
  let sortKey = $state<UserSortKey>(
    isValidSortKey ? (initialSortKey as UserSortKey) : UserSortKey.Id
  );
  let sortDir = $state<SortDirection>(
    isValidSortDir ? (initialSortDir as SortDirection) : SortDirection.Asc
  );

  $effect(() => {
    writeSearchParams({
      limit,
      offset,
      sort: `${sortKey}:${sortDir}`,
      q: searchApplied || null,
      role: roleFilterValue === 'all' ? null : roleFilterValue
    });
  });

  let searchQuery = $state(readParam(page.url, 'q'));
  let searchApplied = $state(readParam(page.url, 'q'));
  let roleFilterValue = $state(readParam(page.url, 'role') || 'all');

  let searchTimer: ReturnType<typeof setTimeout> | undefined;
  $effect(() => {
    const value = searchQuery.trim();
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      if (value === searchApplied) return;
      searchApplied = value;
      offset = 0;
    }, 300);
  });

  const getQueryParams = () => ({
    limit,
    offset,
    sort: `${sortKey}:${sortDir}`,
    search: searchApplied,
    role: roleFilterValue === 'all' ? undefined : roleFilterValue
  });

  const usersQuery = createParameterizedQuery(getQueryParams, async (params) => {
    if (!userService) throw new Error('Service unavailable');
    const result = await userService.getUsers(params);
    if (!result.success) throw new Error(result.error || 'Failed to fetch users');
    return result.data!;
  });

  let editDialogOpen = $state(false);
  let selectedUser = $state<User | null>(null);

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

  const users: User[] = $derived(usersQuery.current?.items ?? []);
  const hasFilters = $derived(searchApplied !== '' || roleFilterValue !== 'all');
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
          if (value && value !== roleFilterValue) {
            roleFilterValue = value;
            offset = 0;
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
            count: users.length,
            total: usersQuery.current.pagination.totalItems
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
    {:else if users.length === 0 && !hasFilters}
      <EmptyState
        title={m.admin_users_no_users_title()}
        description={m.admin_users_no_users_description()}
        icon={Users}
      />
    {:else if users.length === 0}
      <EmptyState
        title={m.admin_users_no_matching_title()}
        description={m.admin_users_no_matching_description()}
        icon={Users}
      />
    {:else}
      <UsersList
        {users}
        total={usersQuery.current ? usersQuery.current.pagination.totalItems : 0}
        bind:limit
        bind:offset
        bind:sortKey
        bind:sortDir
        onEdit={handleEditUser}
      />
    {/if}
  </div>
</div>

<UserEditDialog bind:open={editDialogOpen} user={selectedUser} onSuccess={handleEditSuccess} />
