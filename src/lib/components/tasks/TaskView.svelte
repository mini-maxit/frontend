<script lang="ts">
	import { onMount } from 'svelte';
	import { type Task } from '.';
	import { Input } from '$lib/components/ui/input';
	import * as Accordion from '$lib/components/ui/accordion';
	import * as Tabs from '$lib/components/ui/tabs';
	import { slide } from 'svelte/transition';
	import * as m from '$lib/paraglide/messages.js';

	let { task }: { task: Task } = $props();

	let pdfUrl: string | null = $state(null);

	onMount(() => {
		pdfUrl = URL.createObjectURL(task.doc.content);
	});
</script>

<div class="container mb-12 flex flex-col flex-1">
	<h1 class="text-2xl font-bold my-4">{task.name}</h1>

	<div class="flex-1 flex overflow-hidden">
		<div class="w-1/2 p-4 border rounded-sm border-gray-800 overflow-hidden">
			{#if pdfUrl}
				<iframe src={pdfUrl} title="PDF Viewer" class="w-full h-full"></iframe>
			{:else}
				<p class="p-4">{m.loading()}</p>
			{/if}
		</div>

		<div class="w-1/2 p-4 overflow-hidden">
			<Tabs.Root value="files" class="w-full flex flex-col h-full">
				<Tabs.List class="w-fit">
					<Tabs.Trigger value="files">{m.files()}</Tabs.Trigger>
					<Tabs.Trigger value="summary">{m.summary()}</Tabs.Trigger>
				</Tabs.List>
				<Tabs.Content value="files" class="items-center flex-1">
					<Accordion.Root type="multiple" class="w-full h-full">
						{#each task.inOut.tasks as [input, output], index}
							<Accordion.Item value={`item-${index}`}>
								<Accordion.Trigger>
									{m.file_pair()}
									{index + 1}
								</Accordion.Trigger>
								<Accordion.Content>
									{#snippet child({ props, open })}
										{#if open}
											<div class="space-y-4" transition:slide={{ duration: 500 }}>
												<div>
													<h3 class="font-medium text-lg">Input: {input.filepath}</h3>
													<Input value={input.content} readonly />
												</div>
												<div>
													<h3 class="font-medium text-lg">Output: {output.filepath}</h3>
													<Input value={output.content} readonly />
												</div>
											</div>
										{/if}
									{/snippet}
								</Accordion.Content>
							</Accordion.Item>
						{/each}
					</Accordion.Root>
				</Tabs.Content>
				<Tabs.Content value="summary">
					<div class="space-y-4">
						<h2 class="text-xl font-semibold">{m.summary()}</h2>
						<p>{m.total_file_pairs()}: {task.inOut.tasks.length}</p>
					</div>
				</Tabs.Content>
			</Tabs.Root>
		</div>
	</div>
</div>
