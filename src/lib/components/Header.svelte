<script lang="ts">
	import Button from './ui/button/button.svelte';
	import ChangeLanguage from './ChangeLanguage.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import { UserRole, type UserData } from '$lib/backendSchemas';
	import { enhance } from '$app/forms';

	let { localUser }: { localUser: UserData | null } = $props();
</script>

<header class="z-50 sticky top-0 flex items-center justify-between bg-white shadow-md">
	<a href="/" class="flex items-center space-x-2">
		<img src="/MaxitLogo.svg" alt="Maxit Logo" class="h-10 w-10" />
		<span class="text-lg font-semibold hidden sm:block">Maxit</span>
	</a>
	<nav class="flex space-x-4 px-4">
		<Button href="/dashboard" variant="link" class="my-2">{m.dashboard_header_button()}</Button>
		<Button href="/dashboard/tasks" variant="link" class="my-2 hidden sm:block">{m.tasks()}</Button>
		{#if localUser?.role ?? UserRole.Student !== UserRole.Student}
			<Button href="/dashboard/admin" variant="link" class="my-2">{m.admin()}</Button>
		{/if}
		{#if localUser}
		<div class="relative group py-2 hidden sm:block">
			<Button variant="link">{m.profile()}</Button>
			<div class="absolute right-0 w-48 mt-2 bg-white border rounded shadow-lg hidden group-hover:block">
				<Button href="/dashboard/users/{localUser.id}" variant="ghost" class="block w-full text-left">{m.my_profile()}</Button>
				<Button href="/dashboard/users/{localUser.id}" variant="ghost" class="block w-full text-left">{m.settings()}</Button>
				<form method="post" action="/dashboard?/logout" use:enhance>
					<Button variant="ghost" class="block w-full text-left" type="submit">{m.logout()}</Button>
				</form>
			</div>
		</div>
		{/if}
	</nav>
	<ChangeLanguage />
</header>
