<script lang="ts">
  import type { User } from '$lib/dto/user';
  import { SortDirection, UserSortKey } from '$lib/dto/pagination';
  import * as Table from '$lib/components/ui/table';
  import { Button } from '$lib/components/ui/button';
  import * as Tooltip from '$lib/components/ui/tooltip';
  import * as Pagination from '$lib/components/ui/pagination';
  import UserIcon from '@lucide/svelte/icons/user';
  import Mail from '@lucide/svelte/icons/mail';
  import Calendar from '@lucide/svelte/icons/calendar';
  import Edit from '@lucide/svelte/icons/edit';
  import ArrowUp from '@lucide/svelte/icons/arrow-up';
  import ArrowDown from '@lucide/svelte/icons/arrow-down';
  import { formatDistanceToNow, format, isSameDay } from 'date-fns';
  import * as m from '$lib/paraglide/messages';

  interface UsersListProps {
    users: User[];
    total: number;
    limit: number;
    offset: number;
    sortKey: UserSortKey;
    sortDir: SortDirection;
    onEdit: (user: User) => void;
    onChangePage: (page: number) => void;
    onChangeSort: (sort: { key: UserSortKey; dir: SortDirection }) => void;
    onChangeLimit?: (limit: number) => void;
  }

  let {
    users,
    total,
    limit,
    offset,
    sortKey,
    sortDir,
    onEdit,
    onChangePage,
    onChangeSort,
    onChangeLimit
  }: UsersListProps = $props();

  let currentPage = $derived(Math.floor(offset / limit) + 1);
  let totalPages = $derived(Math.max(1, Math.ceil(total / limit)));
  let pages = $derived(Array.from({ length: totalPages }, (_, i) => i + 1));

  function handleHeaderSort(key: UserSortKey) {
    const dir =
      sortKey === key
        ? sortDir === SortDirection.Asc
          ? SortDirection.Desc
          : SortDirection.Asc
        : SortDirection.Asc;
    onChangeSort({ key, dir });
  }

  function handleLimitChange(newLimit: number) {
    if (onChangeLimit) onChangeLimit(newLimit);
  }

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

  function formatCreatedAt(createdAt: string): string {
    const date = new Date(createdAt);
    const now = new Date();
    if (isSameDay(date, now)) {
      return formatDistanceToNow(date, { addSuffix: true });
    }
    return format(date, 'dd/MMM/yyyy');
  }

  const perPageOptions = [10, 20, 50, 100];
</script>

<div class="space-y-3">
  <!-- Top bar: range + page size -->
  <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
    <div class="text-xs text-muted-foreground">
      {m.admin_users_pagination_showing_range({
        from: total === 0 ? 0 : offset + 1,
        to: Math.min(offset + users.length, total),
        total
      })}
    </div>

    <div class="flex flex-wrap items-center gap-2">
      <div class="flex items-center gap-1 text-xs">
        <span class="text-muted-foreground">{m.admin_users_pagination_rows_per_page()}:</span>
        <select
          class="rounded-md border bg-background px-2 py-1 text-xs"
          value={limit}
          onchange={(e) => handleLimitChange(Number((e.target as HTMLSelectElement).value))}
        >
          {#each perPageOptions as opt (opt)}
            <option value={opt} selected={opt === limit}>{opt}</option>
          {/each}
        </select>
      </div>
      <div class="text-xs font-medium">
        {m.admin_users_pagination_page()}
        {currentPage}
        {m.admin_users_pagination_of()}
        {totalPages}
      </div>
    </div>
  </div>

  <!-- Data table -->
  <Table.Root class="mt-1">
    <Table.Header>
      <Table.Row>
        <Table.Head class="w-14">
          <button
            class="flex items-center gap-1"
            type="button"
            onclick={() => handleHeaderSort(UserSortKey.Id)}
          >
            {m.admin_users_column_id()}
            {#if sortKey === UserSortKey.Id}{#if sortDir === SortDirection.Asc}<ArrowUp
                  class="h-3 w-3 text-muted-foreground"
                />{:else}<ArrowDown class="h-3 w-3 text-muted-foreground" />{/if}{/if}
          </button>
        </Table.Head>
        <Table.Head>
          <button
            class="flex items-center gap-1"
            type="button"
            onclick={() => handleHeaderSort(UserSortKey.Name)}
          >
            {m.admin_users_column_name()}
            {#if sortKey === UserSortKey.Name}{#if sortDir === SortDirection.Asc}<ArrowUp
                  class="h-3 w-3 text-muted-foreground"
                />{:else}<ArrowDown class="h-3 w-3 text-muted-foreground" />{/if}{/if}
          </button>
        </Table.Head>
        <Table.Head class="hidden sm:table-cell">
          <button
            class="flex items-center gap-1"
            type="button"
            onclick={() => handleHeaderSort(UserSortKey.Username)}
          >
            {m.admin_users_column_username()}
            {#if sortKey === UserSortKey.Username}{#if sortDir === SortDirection.Asc}<ArrowUp
                  class="h-3 w-3 text-muted-foreground"
                />{:else}<ArrowDown class="h-3 w-3 text-muted-foreground" />{/if}{/if}
          </button>
        </Table.Head>
        <Table.Head class="hidden md:table-cell">
          <button
            class="flex items-center gap-1"
            type="button"
            onclick={() => handleHeaderSort(UserSortKey.Email)}
          >
            {m.admin_users_column_email()}
            {#if sortKey === UserSortKey.Email}{#if sortDir === SortDirection.Asc}<ArrowUp
                  class="h-3 w-3 text-muted-foreground"
                />{:else}<ArrowDown class="h-3 w-3 text-muted-foreground" />{/if}{/if}
          </button>
        </Table.Head>
        <Table.Head class="hidden lg:table-cell">
          <button
            class="flex items-center gap-1"
            type="button"
            onclick={() => handleHeaderSort(UserSortKey.Role)}
          >
            {m.admin_users_column_role()}
            {#if sortKey === UserSortKey.Role}{#if sortDir === SortDirection.Asc}<ArrowUp
                  class="h-3 w-3 text-muted-foreground"
                />{:else}<ArrowDown class="h-3 w-3 text-muted-foreground" />{/if}{/if}
          </button>
        </Table.Head>
        <Table.Head class="hidden md:table-cell">
          <button
            class="flex items-center gap-1"
            type="button"
            onclick={() => handleHeaderSort(UserSortKey.CreatedAt)}
          >
            {m.admin_users_column_created_at()}
            {#if sortKey === UserSortKey.CreatedAt}{#if sortDir === SortDirection.Asc}<ArrowUp
                  class="h-3 w-3 text-muted-foreground"
                />{:else}<ArrowDown class="h-3 w-3 text-muted-foreground" />{/if}{/if}
          </button>
        </Table.Head>
        <Table.Head class="text-right">{m.admin_users_column_actions()}</Table.Head>
      </Table.Row>
    </Table.Header>

    <Table.Body>
      {#each users as user (user.id)}
        <Table.Row>
          <Table.Cell class="font-mono text-xs">{user.id}</Table.Cell>
          <Table.Cell>
            <div class="flex items-center gap-2">
              <div class="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                <UserIcon class="h-4 w-4 text-primary" />
              </div>
              <div class="flex min-w-0 flex-col">
                <span class="truncate font-medium text-foreground">{user.name} {user.surname}</span>
                <span class="text-xs text-muted-foreground sm:hidden">@{user.username}</span>
              </div>
            </div>
          </Table.Cell>
          <Table.Cell class="hidden text-muted-foreground sm:table-cell"
            >@{user.username}</Table.Cell
          >
          <Table.Cell class="hidden md:table-cell">
            <div class="flex items-center gap-2">
              <Mail class="h-4 w-4 shrink-0 text-muted-foreground" />
              <span class="max-w-[180px] truncate">{user.email}</span>
            </div>
          </Table.Cell>
          <Table.Cell class="hidden lg:table-cell">
            <span
              class="{getRoleBadgeClass(
                user.role
              )} inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold"
            >
              {getRoleBadgeLabel(user.role)}
            </span>
          </Table.Cell>
          <Table.Cell class="hidden md:table-cell">
            <div class="flex items-center gap-2 text-muted-foreground">
              <Calendar class="h-4 w-4" />
              <span class="whitespace-nowrap">
                {formatCreatedAt(user.createdAt)}
              </span>
            </div>
          </Table.Cell>
          <Table.Cell class="text-right">
            <Tooltip.Root>
              <Tooltip.Trigger>
                <Button variant="ghost" size="icon" onclick={() => onEdit(user)}>
                  <Edit class="h-4 w-4" />
                </Button>
              </Tooltip.Trigger>
              <Tooltip.Content side="top">{m.admin_users_action_edit()}</Tooltip.Content>
            </Tooltip.Root>
          </Table.Cell>
        </Table.Row>
      {/each}
    </Table.Body>
  </Table.Root>

  <div class="flex flex-col items-center gap-2 pt-2">
    <Pagination.Root
      count={total}
      perPage={limit}
      page={currentPage}
      siblingCount={1}
      onPageChange={(p) => {
        if (p && p !== currentPage) onChangePage(p);
      }}
    >
      <Pagination.Content>
        <Pagination.PrevButton
          disabled={currentPage === 1}
          onclick={() => currentPage > 1 && onChangePage(currentPage - 1)}
        >
          {m.admin_users_pagination_prev()}
        </Pagination.PrevButton>

        {#each pages as p (p)}
          <Pagination.Item>
            <Pagination.Link
              page={{ type: 'page', value: p }}
              isActive={p === currentPage}
              onclick={() => onChangePage(p)}
            />
          </Pagination.Item>
        {/each}

        <Pagination.NextButton
          disabled={currentPage === totalPages}
          onclick={() => currentPage < totalPages && onChangePage(currentPage + 1)}
        >
          {m.admin_users_pagination_next()}
        </Pagination.NextButton>
      </Pagination.Content>
    </Pagination.Root>

    <div class="text-xs text-muted-foreground">
      {m.admin_users_pagination_total({ total })}
    </div>
  </div>
</div>
