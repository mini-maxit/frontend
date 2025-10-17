<script lang="ts">
  import { Label } from '$lib/components/ui/label';
  import * as m from '$lib/paraglide/messages';

  interface Language {
    id: number;
    language: string;
    version: string;
    fileExtension: string;
  }

  interface Props {
    languages: Language[];
    selectedLanguageId: number | null;
  }

  let { languages, selectedLanguageId = $bindable() }: Props = $props();

  let selectedLanguage = $derived(
    selectedLanguageId ? languages.find((l) => l.id === selectedLanguageId) : null
  );
</script>

<div class="space-y-2">
  <Label for="language">{m.task_language_label()}</Label>
  <select
    id="language"
    value={selectedLanguageId ?? 'null'}
    onchange={(e) =>
      e.target instanceof HTMLSelectElement
        ? (selectedLanguageId = parseInt(e.target.value))
        : null}
    class="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
  >
    <option value="null">{m.task_language_placeholder()}</option>
    {#each languages as language}
      <option value={language.id}>
        {language.language} ({language.version}) - .{language.fileExtension}
      </option>
    {/each}
  </select>
  {#if selectedLanguage}
    <p class="text-xs text-muted-foreground">
      {m.task_file_extension_required({ extension: selectedLanguage.fileExtension })}
    </p>
  {/if}
</div>
