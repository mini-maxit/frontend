<script lang="ts">
    import Tasks from '$lib/components/tasks/Tasks.svelte';
	import type { PageServerData } from './$types';
    import { clientSideBase64ToBlob } from '$lib/utils';
  
    // Gets the tasks from the load function's returned data
    let { data }: { data: PageServerData } = $props();

    const tasks = data.tasks.map(task => {
        return {
            ...task,
            doc: {
                ...task.doc,
                content: clientSideBase64ToBlob(task.doc.contentBase64, "application/pdf")
            }
        };
    });
  </script>
  
  <Tasks {tasks} />
  