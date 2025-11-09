<script lang="ts">
  import { Label } from '$lib/components/ui/label';
  import * as Select from '$lib/components/ui/select';
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

  const selectedLanguage: Language | null = $derived.by(() => {
    if (!selectedLanguageId) {
      return null;
    }
    return languages.find((l) => l.id === selectedLanguageId)!;
  });

  const selectedLanguageTriggerString: string = $derived.by(() => {
    if (!selectedLanguage) {
      return m.task_language_placeholder();
    }
    return `${selectedLanguage.language} (${selectedLanguage.version}) - .${selectedLanguage.fileExtension}`;
  });
</script>

<div class="space-y-2">
  <Label for="language">{m.task_language_label()}</Label>
  <Select.Root
    type="single"
    name="language"
    onValueChange={(value) => (selectedLanguageId = Number(value))}
  >
    <Select.Trigger class="w-full">
      {selectedLanguageTriggerString}
    </Select.Trigger>
    <Select.Content>
      {#each languages as language}
        <Select.Item value={String(language.id)}>
          {language.language} ({language.version}) - .{language.fileExtension}
        </Select.Item>
      {/each}
    </Select.Content>
  </Select.Root>
  {#if selectedLanguage}
    <p class="text-xs text-muted-foreground">
      {m.task_file_extension_required({ extension: selectedLanguage.fileExtension })}
    </p>
  {/if}
</div>
