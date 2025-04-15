<script lang="ts">
	import type { PageServerData } from './$types';
	import RegisterForm from '$components/auth/RegisterForm.svelte';
	import LoginForm from '$components/auth/LoginForm.svelte';
	import Separator from '$components/ui/separator/separator.svelte';

	let { data }: { data: PageServerData } = $props();
</script>

<div class="flex items-center justify-center w-full p-8">
    <div class="w-full max-w-2xl">
        <div
            class="bg-white shadow-md rounded p-8 flex flex-col-reverse space-y-reverse space-y-8 sm:space-y-0 sm:flex-row sm:space-x-4"
        >
            <RegisterForm data={data.registerForm} />
            <LoginForm data={data.loginForm} />
        </div>
    </div>
</div>