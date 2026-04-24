<script lang="ts">
  import {
    DEFAULT_BASE_URL,
    DEFAULT_RENDER_BATCH_SIZE,
    buildEmojiImageUrl,
    defaultCategories,
    defaultEmojiLocale,
    filterCategories,
    getEmojiMessages,
    getEmojiStyles,
    getStyleName,
    type EmojiLocale,
    type EmojiPresetKey,
    type EmojiItem,
    type EmojiItemWithStyle
  } from '@igeekfan/fluent-emoji-ms-core'
  import { createEventDispatcher } from 'svelte'
  import EmojiPicker from './EmojiPicker.svelte'
  import type { FluentEmojiPickerProps, SelectEventDetail } from './types'

  export let disabled: FluentEmojiPickerProps['disabled'] = false
  export let initialStyle: FluentEmojiPickerProps['initialStyle'] = 'modern'
  export let defaultCategory: FluentEmojiPickerProps['defaultCategory'] = 'all'
  export let buttonText: FluentEmojiPickerProps['buttonText'] = undefined
  export let baseUrl: FluentEmojiPickerProps['baseUrl'] = DEFAULT_BASE_URL
  export let locale: EmojiLocale = defaultEmojiLocale
  export let width: FluentEmojiPickerProps['width'] = 320
  export let categories: FluentEmojiPickerProps['categories'] = undefined
  export let preset: EmojiPresetKey | undefined = undefined
  export let emojiNames: string[] | undefined = undefined
  export let showSearch: FluentEmojiPickerProps['showSearch'] = true
  export let closeOnSelect: FluentEmojiPickerProps['closeOnSelect'] = true
  export let showSelectedEmoji: FluentEmojiPickerProps['showSelectedEmoji'] = false
  export let emojiSize: FluentEmojiPickerProps['emojiSize'] = 28
  export let columns: FluentEmojiPickerProps['columns'] = 6
  export let autoFill: FluentEmojiPickerProps['autoFill'] = true
  export let renderBatchSize: FluentEmojiPickerProps['renderBatchSize'] = DEFAULT_RENDER_BATCH_SIZE

  const dispatch = createEventDispatcher<{
    select: SelectEventDetail
    clear: undefined
  }>()

  let hostElement: HTMLDivElement | null = null
  let isOpen = false
  let searchQuery = ''
  let selectedStyle = initialStyle
  let selectedEmojiCategory = defaultCategory
  let selectedEmoji: EmojiItem | null = null
  let renderLimit = renderBatchSize
  let previousCollectionKey = ''

  $: messages = getEmojiMessages(locale)
  $: localizedStyles = getEmojiStyles(locale)
  $: effectiveCategories = categories?.length
    ? categories
    : preset || emojiNames?.length
      ? ['all']
      : defaultCategories
  $: availableCategories = filterCategories({ categories: effectiveCategories, preset, emojiNames }, locale)
  $: showCategoryRow = availableCategories.length > 2
  $: if (selectedEmojiCategory || searchQuery) {
    renderLimit = renderBatchSize
  }
  $: if (!showSearch && searchQuery) {
    searchQuery = ''
  }
  $: {
    const nextCollectionKey = `${defaultCategory}|${preset ?? ''}|${(emojiNames ?? []).join('|')}|${effectiveCategories.join('|')}`
    if (nextCollectionKey !== previousCollectionKey) {
      previousCollectionKey = nextCollectionKey
      selectedEmojiCategory = defaultCategory
      renderLimit = renderBatchSize
    }
  }

  function togglePanel() {
    if (disabled) {
      return
    }

    isOpen = !isOpen
  }

  function handleEmojiSelect(emoji: EmojiItem) {
    selectedEmoji = emoji

    const emojiWithStyle: EmojiItemWithStyle = {
      ...emoji,
      style: selectedStyle
    }

    dispatch('select', { emoji: emojiWithStyle })

    if (closeOnSelect) {
      isOpen = false
    }
  }

  function handleClear() {
    selectedEmoji = null
    dispatch('clear')
  }

  function handleClickOutside(event: MouseEvent) {
    if (hostElement && !hostElement.contains(event.target as Node)) {
      isOpen = false
    }
  }

  if (typeof document !== 'undefined') {
    document.addEventListener('mousedown', handleClickOutside)
  }
</script>

<svelte:window on:mousedown={handleClickOutside} />

<div bind:this={hostElement} class="picker-host">
  <button type="button" class="trigger-button" disabled={disabled} on:click={togglePanel}>
    <span>{buttonText ?? messages.ui.pickerButton}</span>
    {#if selectedEmoji}
      <img src={buildEmojiImageUrl(baseUrl, selectedStyle, selectedEmoji.path)} alt={selectedEmoji.name} width="20" height="20" />
    {/if}
  </button>

  {#if isOpen}
    <div class="panel" style={`width: ${typeof width === 'number' ? `${width}px` : width};`}>
      <div class="toolbar">
        {#if showSearch}
          <input bind:value={searchQuery} type="search" class="search-input" placeholder={messages.ui.searchPlaceholder} />
        {/if}
        <select bind:value={selectedStyle} class="style-select">
          {#each localizedStyles as style}
            <option value={style.value}>{style.name}</option>
          {/each}
        </select>
      </div>

      {#if showCategoryRow}
        <div class="category-row">
          {#each availableCategories as category}
            <button type="button" class:active={selectedEmojiCategory === category.value} class="category-chip" on:click={() => (selectedEmojiCategory = category.value)}>
              {category.icon} {category.name}
            </button>
          {/each}
        </div>
      {/if}

      <EmojiPicker
        {baseUrl}
        selectedStyle={selectedStyle}
        {locale}
        categories={effectiveCategories}
        {preset}
        {emojiNames}
        selectedCategory={selectedEmojiCategory}
        searchQuery={searchQuery}
        {emojiSize}
        {columns}
        {autoFill}
        {renderLimit}
        on:select={(event) => handleEmojiSelect(event.detail.emoji)}
        on:loadMore={() => (renderLimit += renderBatchSize)}
      />
    </div>
  {/if}

  {#if showSelectedEmoji && selectedEmoji}
    <div class="selected-summary">
      <img src={buildEmojiImageUrl(baseUrl, selectedStyle, selectedEmoji.path)} alt={selectedEmoji.name} width="32" height="32" />
      <div class="summary-text">
        <div>{selectedEmoji.name}</div>
        <div class="summary-style">{messages.ui.style}: {getStyleName(selectedStyle, locale)}</div>
      </div>
      <button type="button" class="clear-button" on:click={handleClear}>{messages.ui.clear}</button>
    </div>
  {/if}
</div>

<style>
  .picker-host {
    position: relative;
    display: inline-grid;
    max-width: 100%;
    justify-items: start;
  }

  .trigger-button,
  .category-chip,
  .clear-button {
    border: 1px solid #d0d7de;
    background: #fff;
    cursor: pointer;
  }

  .trigger-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: auto;
    max-width: 100%;
    padding: 10px 14px;
    border-radius: 10px;
  }

  .panel {
    position: absolute;
    top: calc(100% + 8px);
    left: 0;
    z-index: 20;
    padding: 12px;
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 14px;
    box-shadow: 0 18px 40px rgba(15, 23, 42, 0.14);
  }

  .toolbar {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 8px;
  }

  .search-input,
  .style-select {
    min-width: 0;
    padding: 10px 12px;
    border: 1px solid #d0d7de;
    border-radius: 10px;
  }

  .category-row {
    display: flex;
    gap: 8px;
    overflow-x: auto;
    padding: 10px 0;
  }

  .category-chip {
    white-space: nowrap;
    padding: 6px 10px;
    border-radius: 999px;
  }

  .category-chip.active {
    background: #0f172a;
    color: #fff;
    border-color: #0f172a;
  }

  .selected-summary {
    display: grid;
    grid-template-columns: auto 1fr auto;
    gap: 12px;
    align-items: center;
    margin-top: 12px;
    padding: 12px;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
  }

  .summary-style {
    color: #64748b;
    font-size: 12px;
  }

  .clear-button {
    padding: 8px 10px;
    border-radius: 10px;
  }
</style>
