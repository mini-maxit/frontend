<script lang="ts">
	import { superForm, defaults } from 'sveltekit-superforms';
	import { valibot } from 'sveltekit-superforms/adapters';
	import { UpdateUserSchema } from '$lib/schemas';
	import { getUserManagementInstance } from '$lib/services';
	import { toast } from 'svelte-sonner';
	import * as m from '$lib/paraglide/messages';
	import type { User } from '$lib/dto/user';
	import { UserRole } from '$lib/dto/jwt';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Select from '$lib/components/ui/select';

	interface Props {
		open: boolean;
		user: User | null;
		onSuccess: () => void;
	}

	let { open = $bindable(), user, onSuccess }: Props = $props();

	const userManagementService = getUserManagementInstance();

	// Initialize superform for SPA mode with client-side validation
	const { form, errors, enhance, submitting } = superForm(
		defaults(
			user
				? {
						userId: user.id,
						name: user.name,
						surname: user.surname,
						username: user.username,
						email: user.email,
						role: user.role
					}
				: {},
			valibot(UpdateUserSchema)
		),
		{
			id: user ? `edit-user-${user.id}` : 'edit-user',
			validators: valibot(UpdateUserSchema),
			SPA: true,
			dataType: 'json',
			resetForm: false,
			async onUpdate({ form }) {
				if (!userManagementService || !form.valid) return;

				try {
					const result = await userManagementService.updateUser(form.data.userId, {
						name: form.data.name,
						surname: form.data.surname,
						username: form.data.username,
						email: form.data.email,
						role: form.data.role
					});

					if (result.success) {
						toast.success(m.admin_users_edit_success());
						open = false;
						onSuccess();
					} else {
						toast.error(result.error || m.admin_users_edit_error());
					}
				} catch (error) {
					console.error('Update user error:', error);
					toast.error(m.admin_users_edit_error());
				}
			}
		}
	);

	const roleOptions = [
		{ value: UserRole.Student, label: m.admin_users_role_student() },
		{ value: UserRole.Teacher, label: m.admin_users_role_teacher() },
		{ value: UserRole.Admin, label: m.admin_users_role_admin() }
	];

	const selectedRoleLabel = $derived.by(() => {
		const option = roleOptions.find((opt) => opt.value === $form.role);
		return option?.label || m.admin_users_filter_role_label();
	});

	function handleCancel() {
		open = false;
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>{m.admin_users_edit_dialog_title()}</Dialog.Title>
			<Dialog.Description>
				{m.admin_users_edit_dialog_description()}
			</Dialog.Description>
		</Dialog.Header>

		{#if user}
			<form method="POST" use:enhance class="space-y-4">
				<div class="grid grid-cols-2 gap-4">
					<div class="space-y-2">
						<Label for="name">{m.register_name_label()}</Label>
						<Input
							id="name"
							name="name"
							type="text"
							bind:value={$form.name}
							disabled={$submitting}
							aria-invalid={$errors.name ? 'true' : undefined}
							placeholder={m.register_name_placeholder()}
						/>
						{#if $errors.name}
							<p class="text-sm text-destructive">{$errors.name}</p>
						{/if}
					</div>

					<div class="space-y-2">
						<Label for="surname">{m.register_surname_label()}</Label>
						<Input
							id="surname"
							name="surname"
							type="text"
							bind:value={$form.surname}
							disabled={$submitting}
							aria-invalid={$errors.surname ? 'true' : undefined}
							placeholder={m.register_surname_placeholder()}
						/>
						{#if $errors.surname}
							<p class="text-sm text-destructive">{$errors.surname}</p>
						{/if}
					</div>
				</div>

				<div class="space-y-2">
					<Label for="username">{m.register_username_label()}</Label>
					<Input
						id="username"
						name="username"
						type="text"
						bind:value={$form.username}
						disabled={$submitting}
						aria-invalid={$errors.username ? 'true' : undefined}
						placeholder={m.register_username_placeholder()}
					/>
					{#if $errors.username}
						<p class="text-sm text-destructive">{$errors.username}</p>
					{/if}
				</div>

				<div class="space-y-2">
					<Label for="email">{m.register_email_label()}</Label>
					<Input
						id="email"
						name="email"
						type="email"
						bind:value={$form.email}
						disabled={$submitting}
						aria-invalid={$errors.email ? 'true' : undefined}
						placeholder={m.register_email_placeholder()}
					/>
					{#if $errors.email}
						<p class="text-sm text-destructive">{$errors.email}</p>
					{/if}
				</div>

				<div class="space-y-2">
					<Label for="role">{m.admin_registration_requests_role()}</Label>
					<Select.Root
						type="single"
						value={$form.role}
						onValueChange={(value) => {
							if (value) {
								$form.role = value;
							}
						}}
						disabled={$submitting}
					>
						<Select.Trigger id="role" class="w-full">
							{selectedRoleLabel}
						</Select.Trigger>
						<Select.Content>
							{#each roleOptions as role (role.value)}
								<Select.Item value={role.value}>
									{role.label}
								</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
					{#if $errors.role}
						<p class="text-sm text-destructive">{$errors.role}</p>
					{/if}
				</div>

				<Dialog.Footer>
					<Button type="button" variant="outline" onclick={handleCancel} disabled={$submitting}>
						{m.admin_contests_form_cancel()}
					</Button>
					<Button type="submit" disabled={$submitting}>
						{$submitting ? 'Saving...' : m.admin_tasks_save_changes()}
					</Button>
				</Dialog.Footer>
			</form>
		{/if}
	</Dialog.Content>
</Dialog.Root>
