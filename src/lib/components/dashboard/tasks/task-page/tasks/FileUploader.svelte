<script lang="ts">
  import { Label } from '$lib/components/ui/label';
  import * as m from '$lib/paraglide/messages';

  interface Props {
    selectedFiles: FileList | null;
    disabled?: boolean;
  }

  let { selectedFiles = $bindable(), disabled = false }: Props = $props();

  let fileInput = $state<HTMLInputElement | null>(null);

  export function clear() {
    selectedFiles = null;
    if (fileInput) {
      fileInput.value = '';
    }
  }
</script>

<div class="space-y-2">
  <Label for="solution">{m.task_file_label()}</Label>
  <input
    bind:this={fileInput}
    onchange={(e) => {
      const target = e.target as HTMLInputElement;
      selectedFiles = target.files;
    }}
    id="solution"
    name="solution"
    type="file"
    {disabled}
    class="flex h-9 w-full min-w-0 cursor-pointer rounded-md border border-input bg-transparent px-3 pt-1.5 text-sm font-medium shadow-xs ring-offset-background transition-[color,box-shadow] outline-none file:cursor-pointer file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
  />
  {#if selectedFiles && selectedFiles.length > 0}
    <p class="text-sm text-muted-foreground">
      {m.task_file_selected({
        filename: selectedFiles[0].name,
        size: (selectedFiles[0].size / 1024).toFixed(2)
      })}
    </p>
  {/if}
</div>
