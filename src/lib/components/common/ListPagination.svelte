<script lang="ts">
  import * as Pagination from '#lib/components/ui/pagination/index.js';
  import * as m from '#lib/paraglide/messages.js';
  import { getPaginationPages, getCurrentPage, getTotalPages, getOffset } from '#lib/utils.js';

  interface Props {
    total: number;
    limit: number;
    offset: number;
    /** e.g. "19 total contests" */
    totalLabel: string;
    onOffsetChange: (offset: number) => void;
  }

  let { total, limit, offset, totalLabel, onOffsetChange }: Props = $props();

  const currentPage = $derived(getCurrentPage(offset, limit));
  const totalPages = $derived(getTotalPages(total, limit));
  const paginationPages = $derived(getPaginationPages(currentPage, totalPages));
</script>

<div class="flex flex-col items-center gap-2 pt-2">
  {#if totalPages > 1}
    <Pagination.Root
      count={total}
      perPage={limit}
      page={currentPage}
      siblingCount={1}
      onPageChange={(p) => {
        if (p && p !== currentPage) onOffsetChange(getOffset(p, limit));
      }}
    >
      <Pagination.Content>
        <Pagination.PrevButton disabled={currentPage === 1}>
          {m.common_pagination_prev()}
        </Pagination.PrevButton>

        {#each paginationPages as p, i (`${p}-${i}`)}
          <Pagination.Item>
            {#if p === 'ellipsis'}
              <Pagination.Ellipsis />
            {:else}
              <Pagination.Link page={{ type: 'page', value: p }} isActive={p === currentPage} />
            {/if}
          </Pagination.Item>
        {/each}

        <Pagination.NextButton disabled={currentPage === totalPages}>
          {m.common_pagination_next()}
        </Pagination.NextButton>
      </Pagination.Content>
    </Pagination.Root>
  {/if}

  <div class="text-xs text-muted-foreground">{totalLabel}</div>
</div>
