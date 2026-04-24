<script lang="ts">
  import {
    DEFAULT_BASE_URL,
    DEFAULT_RENDER_BATCH_SIZE,
    buildEmojiImageUrl,
    defaultEmojiLocale,
    getEmojiMessages,
    queryEmojis,
    type EmojiLocale,
    type EmojiPresetKey,
    type EmojiItem
  } from '@fluent-emoji-ms/core'

  export let baseUrl = DEFAULT_BASE_URL
  export let width: number | string | undefined = undefined
  export let selectedStyle = 'modern'
  export let locale: EmojiLocale = defaultEmojiLocale
  export let categories: string[] = ['all']
  export let preset: EmojiPresetKey | undefined = undefined
  export let emojiNames: string[] | undefined = undefined
  export let selectedCategory = 'all'
  export let searchQuery = ''
  export let emojiSize = 28
  export let columns = 6
  export let autoFill = true
  export let renderLimit = DEFAULT_RENDER_BATCH_SIZE

  import { createEventDispatcher } from 'svelte'

  const dispatch = createEventDispatcher<{
    select: { emoji: EmojiItem }
    loadMore: undefined
  }>()

  $: messages = getEmojiMessages(locale)

  $: emojiResult = queryEmojis({
    categories,
    preset,
    emojiNames,
    selectedCategory,
    search: searchQuery,
    limit: renderLimit
  })
  $: cellSize = Math.max(emojiSize + 4, 32)
  $: panelStyle = width == null || width === ''
    ? undefined
    : `width: 100%; max-width: ${typeof width === 'number' ? `${width}px` : width}; margin: 0 auto;`
  $: gridStyle = autoFill
    ? `grid-template-columns: repeat(auto-fill, minmax(${cellSize}px, 1fr));`
    : `grid-template-columns: repeat(${columns}, ${cellSize}px); justify-content: center;`
  $: cellStyle = `min-height: ${cellSize}px;`
</script>

<div class="emoji-picker-panel" style={panelStyle}>
  <div class="grid-container">
    {#if emojiResult.items.length}
      <div class="emoji-grid" style={gridStyle}>
        {#each emojiResult.items as emoji}
          <button type="button" class="emoji-cell" title={emoji.name} style={cellStyle} on:click={() => dispatch('select', { emoji })}>
            <img src={buildEmojiImageUrl(baseUrl, selectedStyle, emoji.path)} alt={emoji.name} width={emojiSize} height={emojiSize} loading="lazy" />
          </button>
        {/each}
      </div>
    {:else}
      <div class="empty-state">{messages.ui.noResults}</div>
    {/if}
  </div>

  {#if emojiResult.hasMore}
    <button type="button" class="load-more" on:click={() => dispatch('loadMore')}>{messages.ui.loadMore}</button>
  {/if}
</div>

<style>
  .emoji-picker-panel {
    display: grid;
    gap: 10px;
  }

  .grid-container {
    max-height: 320px;
    overflow: auto;
  }

  .emoji-grid {
    display: grid;
    gap: 2px;
  }

  .emoji-cell {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 32px;
    min-width: 0;
    aspect-ratio: 1;
    border: 0;
    border-radius: 8px;
    background: transparent;
    cursor: pointer;
  }

  .emoji-cell:hover {
    background: rgba(15, 23, 42, 0.06);
  }

  .empty-state {
    padding: 20px 0;
    color: #64748b;
    text-align: center;
  }

  .load-more {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid #d0d7de;
    border-radius: 10px;
    background: #fff;
    cursor: pointer;
  }
</style>
