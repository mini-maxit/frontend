<script lang="ts">
  import { createQuery } from '$lib/utils/query.svelte';
  import { showApiError } from '$lib/errors/backend-error';
  import { getLanguagesManagementInstance } from '$lib/services';
  import { LoadingSpinner, ErrorCard, EmptyState } from '$lib/components/common';
  import * as Card from '$lib/components/ui/card';
  import { Button } from '$lib/components/ui/button';
  import { toast } from 'svelte-sonner';
  import CheckCircle from '@lucide/svelte/icons/check-circle';
  import XCircle from '@lucide/svelte/icons/x-circle';
  import Code from '@lucide/svelte/icons/code';
  import * as m from '$lib/paraglide/messages';

  const languagesManagementService = getLanguagesManagementInstance();

  const languagesQuery = createQuery(async () => {
    if (!languagesManagementService) throw new Error('Service unavailable');
    const result = await languagesManagementService.getAllLanguages();
    if (!result.success) throw new Error(result.error || 'Failed to fetch languages');
    return result.data!;
  });

  let togglingId = $state<number | null>(null);

  async function toggleLanguage(id: number) {
    if (!languagesManagementService || togglingId !== null) return;

    togglingId = id;
    try {
      const result = await languagesManagementService.toggleLanguageVisibility(id);
      if (result.success) {
        toast.success(m.admin_languages_toggle_success());
        await languagesQuery.refresh();
      } else {
        toast.error(result.error || m.admin_languages_toggle_error());
      }
    } catch (error){
      console.error('Toggle language error:', error);
      showApiError(error, m.admin_languages_toggle_error());
    } finally {
      togglingId = null;
    }
  }
</script>

<div class="space-y-6">
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-3xl font-bold text-foreground">{m.admin_languages_title()}</h1>
      <p class="mt-1 text-sm text-muted-foreground">{m.admin_languages_description()}</p>
    </div>
  </div>

  {#if languagesQuery.error}
    <ErrorCard
      title={m.admin_languages_load_error()}
      error={languagesQuery.error}
      onRetry={() => languagesQuery.refresh()}
    />
  {:else if languagesQuery.loading}
    <LoadingSpinner />
  {:else if !languagesQuery.current || languagesQuery.current.length === 0}
    <EmptyState
      title={m.admin_languages_no_languages_title()}
      description={m.admin_languages_no_languages_description()}
      icon={Code}
    />
  {:else}
    <Card.Root>
      <Card.Content class="p-0">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th class="px-4 py-3">{m.admin_languages_column_language()}</th>
                <th class="px-4 py-3">{m.admin_languages_column_version()}</th>
                <th class="px-4 py-3">{m.admin_languages_column_extension()}</th>
                <th class="px-4 py-3">{m.admin_languages_column_status()}</th>
                <th class="px-4 py-3 text-right">{m.admin_languages_action_toggle()}</th>
              </tr>
            </thead>
            <tbody>
              {#each languagesQuery.current as lang (lang.id)}
                <tr class="border-b border-border last:border-0">
                  <td class="px-4 py-3 font-semibold text-foreground">{lang.language}</td>
                  <td class="px-4 py-3 text-muted-foreground">{lang.version}</td>
                  <td class="px-4 py-3 font-mono text-muted-foreground">{lang.fileExtension}</td>
                  <td class="px-4 py-3">
                    {#if lang.isDisabled}
                      <span
                        class="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2.5 py-0.5 text-xs font-medium text-destructive"
                      >
                        <XCircle class="h-3.5 w-3.5" />
                        {m.admin_languages_status_disabled()}
                      </span>
                    {:else}
                      <span
                        class="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
                      >
                        <CheckCircle class="h-3.5 w-3.5" />
                        {m.admin_languages_status_enabled()}
                      </span>
                    {/if}
                  </td>
                  <td class="px-4 py-3 text-right">
                    <Button
                      variant={lang.isDisabled ? 'default' : 'outline'}
                      size="sm"
                      onclick={() => toggleLanguage(lang.id)}
                      disabled={togglingId !== null}
                    >
                      {togglingId === lang.id ? '...' : lang.isDisabled
                        ? m.admin_languages_status_enabled()
                        : m.admin_languages_status_disabled()}
                    </Button>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </Card.Content>
    </Card.Root>
  {/if}
</div>
