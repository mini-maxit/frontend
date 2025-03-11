<script lang="ts">
	import { page } from '$app/state';
	import * as Card from '$components/ui/card/index.js';
	import * as m from '$lib/paraglide/messages.js';
	import Separator from '$components/ui/separator/separator.svelte';
</script>

<div class="w-full p-8 flex-grow items-center justify-center flex">
	<Card.Root class="bg-red-200">
		<Card.Header class="text-center font-semibold">
			<h2>Error</h2>
		</Card.Header>
		<div class="mt-4 px-4">
			<Separator class="bg-black" />
		</div>
		<Card.Content class="flex flex-row">
			<div>
				<p>
					{m.error_status_code_label()}:
				</p>
				<p>
					{m.error_message_label()}:
				</p>
			</div>

			<div class="ml-4">
				<p>{page.status}</p>
				<p>{page.error?.message}</p>
			</div>
		</Card.Content>
	</Card.Root>
</div>
