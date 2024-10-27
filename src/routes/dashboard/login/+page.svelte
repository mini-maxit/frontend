<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<div class="flex min-h-screen items-center justify-center bg-gray-100">
	<div class="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
		<h1 class="text-2xl font-semibold text-center text-gray-700 mb-6">Login/Register</h1>
		<form method="post" action="?/login" use:enhance class="space-y-4">
			<div class="flex flex-col">
				<label for="username" class="mb-2 font-medium text-gray-600">Username</label>
				<input
					id="username"
					name="username"
					class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
					placeholder="Enter your username"
				/>
			</div>
			<div class="flex flex-col">
				<label for="password" class="mb-2 font-medium text-gray-600">Password</label>
				<input
					id="password"
					type="password"
					name="password"
					class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
					placeholder="Enter your password"
				/>
			</div>
			<div class="flex justify-between items-center pt-4">
				<button
					class="w-full py-2 mr-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
				>
					Login
				</button>
				<button
					formaction="?/register"
					class="w-full py-2 ml-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
				>
					Register
				</button>
			</div>
		</form>
		<p class="mt-4 text-center text-red-500">{form?.message ?? ''}</p>
	</div>
</div>
