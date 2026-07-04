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
  } from '@igeekfan/fluent-emoji-ms-core'

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

  let loadedImageKeys = new Set<string>()

  function getImageKey(emoji: EmojiItem) {
    return `${baseUrl}:${selectedStyle}:${emoji.path}`
  }

  function markImageLoaded(emoji: EmojiItem) {
    loadedImageKeys = new Set(loadedImageKeys).add(getImageKey(emoji))
  }
</script>

<div class="emoji-picker-panel" style={panelStyle}>
  <div class="grid-container">
    {#if emojiResult.items.length}
      <div class="emoji-grid" style={gridStyle}>
        {#each emojiResult.items as emoji}
          <button type="button" class="emoji-cell" title={emoji.name} style={cellStyle} on:click={() => dispatch('select', { emoji })}>
            {#if !loadedImageKeys.has(getImageKey(emoji))}
              <span class="emoji-placeholder" aria-hidden="true"></span>
            {/if}
            <img
              src={buildEmojiImageUrl(baseUrl, selectedStyle, emoji.path)}
              alt={emoji.name}
              width={emojiSize}
              height={emojiSize}
              loading="lazy"
              decoding="async"
              class:loaded={loadedImageKeys.has(getImageKey(emoji))}
              on:load={() => markImageLoaded(emoji)}
              on:error={() => markImageLoaded(emoji)}
            />
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
    position: relative;
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

  .emoji-cell img {
    position: relative;
    display: block;
    opacity: 0;
    transform: scale(0.92);
    transition: opacity 120ms ease, transform 120ms ease;
  }

  .emoji-cell img.loaded {
    opacity: 1;
    transform: scale(1);
  }

  .emoji-placeholder {
    position: absolute;
    width: 68%;
    height: 68%;
    border-radius: 9px;
    background:
      linear-gradient(110deg, rgba(226, 232, 240, 0.7) 8%, rgba(248, 250, 252, 0.95) 18%, rgba(226, 232, 240, 0.7) 33%);
    background-size: 200% 100%;
    animation: emoji-placeholder-shimmer 1.1s linear infinite;
  }

  @keyframes emoji-placeholder-shimmer {
    to {
      background-position-x: -200%;
    }
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

  @media (prefers-reduced-motion: reduce) {
    .emoji-cell img,
    .emoji-placeholder {
      transition: none;
      animation: none;
    }
  }
</style>
