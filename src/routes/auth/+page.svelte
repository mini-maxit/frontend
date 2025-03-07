<script lang="ts">
	import type { PageServerData } from './$types';
	import RegisterForm from '$components/auth/RegisterForm.svelte';
	import LoginForm from '$components/auth/LoginForm.svelte';

	let { data }: { data: PageServerData } = $props();
</script>

<div class="flex min-h-screen items-center justify-center bg-gray-100">
	<div class="w-full max-w-md">
		<div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-row space-x-4">
			<RegisterForm data={data.registerForm} />
			<LoginForm data={data.loginForm} />
		</div>
	</div>
</div>
