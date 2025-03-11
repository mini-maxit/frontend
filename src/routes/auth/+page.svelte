<script lang="ts">
	import type { PageServerData } from './$types';
	import RegisterForm from '$components/auth/RegisterForm.svelte';
	import LoginForm from '$components/auth/LoginForm.svelte';
	import Separator from '$components/ui/separator/separator.svelte';

	let { data }: { data: PageServerData } = $props();
</script>

<div class="flex min-h-screen items-center justify-center bg-gray-100 p-8">
	<div class="w-full max-w-md">
		<div
			class="bg-white shadow-md rounded p-8 flex flex-col-reverse space-y-reverse space-y-8 sm:space-y-0 sm:flex-row sm:space-x-4"
		>
			<RegisterForm data={data.registerForm} />
			<LoginForm data={data.loginForm} />
		</div>
	</div>
</div>
