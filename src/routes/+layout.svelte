<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<main class="min-h-screen w-full">
	{@render children()}
</main>
