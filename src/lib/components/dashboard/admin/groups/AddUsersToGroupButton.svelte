<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import * as Dialog from '$lib/components/ui/dialog';
	import { LoadingSpinner, ErrorCard } from '$lib/components/common';
	import UserPlus from '@lucide/svelte/icons/user-plus';
	import { toast } from 'svelte-sonner';
	import * as m from '$lib/paraglide/messages';
	import { SvelteSet } from 'svelte/reactivity';
	import { createQuery, createParameterizedQuery } from '$lib/utils/query.svelte';
	import { getUserManagementInstance, getGroupsManagementInstance } from '$lib/services';
	import type { User } from '$lib/dto/user';

	interface Props {
		groupId: number;
		onSuccess?: () => void;
	}

	let { groupId, onSuccess }: Props = $props();

	let dialogOpen = $state(false);
	let searchQuery = $state('');
	let selectedUserIds = $state(new SvelteSet<number>());
	let submitting = $state(false);

	const userManagementService = getUserManagementInstance();
	const groupsService = getGroupsManagementInstance();

	// Fetch all users
	const usersQuery = createQuery(async () => {
		if (!userManagementService) throw new Error('User service unavailable');
		const result = await userManagementService.getAllUsers();
		if (!result.success) throw new Error(result.error || 'Failed to fetch users');
		return result.data!;
	});

	// Fetch current group members
	const membersQuery = createParameterizedQuery(groupId, async (id) => {
		if (!groupsService) throw new Error('Groups service unavailable');
		const members = await groupsService.getGroupMembers(id);
		return members;
	});

	// Filter out users who are already members
	let availableUsers = $derived.by(() => {
		if (!usersQuery.current?.items || !membersQuery.current) return [];
		const memberIds = new SvelteSet(membersQuery.current.map((m) => m.id));
		return usersQuery.current.items.filter((user: User) => !memberIds.has(user.id));
	});

	// Filter by search query
	let filteredUsers = $derived.by(() => {
		if (!searchQuery.trim()) return availableUsers;
		const query = searchQuery.toLowerCase();
		return availableUsers.filter(
			(user: User) =>
				user.username.toLowerCase().includes(query) ||
				user.email.toLowerCase().includes(query) ||
				user.name.toLowerCase().includes(query) ||
				user.surname.toLowerCase().includes(query)
		);
	});

	function toggleUser(userId: number) {
		const newSet = new SvelteSet(selectedUserIds);
		if (newSet.has(userId)) {
			newSet.delete(userId);
		} else {
			newSet.add(userId);
		}
		selectedUserIds = newSet;
	}

	async function handleSubmit() {
		if (!groupsService || selectedUserIds.size === 0) {
			toast.error(m.group_members_add_error());
			return;
		}

		submitting = true;
		try {
			await groupsService.addUsersToGroup(groupId, Array.from(selectedUserIds));
			toast.success(m.group_members_add_success());
			dialogOpen = false;
			selectedUserIds = new SvelteSet();
			searchQuery = '';

			// Refresh the members list
			await membersQuery.refresh();

			if (onSuccess) onSuccess();
		} catch (error) {
			console.error('Add users error:', error);
			toast.error(m.group_members_add_error());
		} finally {
			submitting = false;
		}
	}

	function resetForm() {
		selectedUserIds = new SvelteSet();
		searchQuery = '';
	}
</script>

<Dialog.Root bind:open={dialogOpen} onOpenChange={(open) => !open && resetForm()}>
	<button
		onclick={() => (dialogOpen = true)}
		class="group relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary to-secondary p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
	>
		<div
			class="absolute inset-0 bg-gradient-to-br from-white/0 to-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
		></div>

		<div class="relative flex flex-col items-center gap-4 text-center">
			<div
				class="flex h-16 w-16 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110"
			>
				<UserPlus class="h-8 w-8 text-primary-foreground" />
			</div>
			<div>
				<h3 class="text-lg font-bold text-primary-foreground">
					{m.group_members_add_title()}
				</h3>
				<p class="mt-1 text-sm text-primary-foreground/80">
					{m.group_members_add_description()}
				</p>
			</div>
		</div>
	</button>

	<Dialog.Content class="max-w-2xl">
		<Dialog.Header>
			<Dialog.Title>{m.group_members_add_dialog_title()}</Dialog.Title>
			<Dialog.Description>
				{m.group_members_add_dialog_description()}
			</Dialog.Description>
		</Dialog.Header>

		<div class="space-y-4">
			<!-- Search -->
			<div class="space-y-2">
				<Label for="search">{m.group_members_add_search_label()}</Label>
				<Input
					id="search"
					type="text"
					bind:value={searchQuery}
					placeholder={m.group_members_add_search_placeholder()}
					class="transition-all duration-200 focus:ring-2 focus:ring-primary"
				/>
			</div>

			<!-- Selected Count -->
			<div class="flex justify-end">
				<span class="text-sm text-muted-foreground">
					{m.group_members_add_selected_count({ count: selectedUserIds.size.toString() })}
				</span>
			</div>

			<!-- User List -->
			{#if usersQuery.error || membersQuery.error}
				<ErrorCard
					error={usersQuery.error || membersQuery.error}
					onRetry={() => {
						usersQuery.refresh();
						membersQuery.refresh();
					}}
				/>
			{:else if usersQuery.loading || membersQuery.loading}
				<LoadingSpinner message={m.groups_loading()} />
			{:else if filteredUsers.length === 0}
				<p class="text-sm text-muted-foreground">{m.group_members_no_users_found()}</p>
			{:else}
				<div class="max-h-96 space-y-2 overflow-y-auto rounded-md border p-4">
					{#each filteredUsers as user (user.id)}
						<div class="flex items-center space-x-3 rounded-md p-2 hover:bg-accent">
							<Checkbox
								id={`user-${user.id}`}
								checked={selectedUserIds.has(user.id)}
								onCheckedChange={() => toggleUser(user.id)}
							/>
							<label
								for={`user-${user.id}`}
								class="flex-1 cursor-pointer space-y-1 text-sm leading-none"
							>
								<div class="font-medium">{user.username}</div>
								<div class="text-muted-foreground">
									{user.name}
									{user.surname} - {user.email}
								</div>
							</label>
						</div>
					{/each}
				</div>
			{/if}
		</div>

		<Dialog.Footer>
			<Button type="button" variant="outline" onclick={() => (dialogOpen = false)} disabled={submitting}>
				{m.group_members_add_cancel()}
			</Button>
			<Button type="button" onclick={handleSubmit} disabled={selectedUserIds.size === 0 || submitting}>
				{submitting ? 'Adding...' : m.group_members_add_submit()}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
