<script lang="ts">
  import {
    DEFAULT_BASE_URL,
    DEFAULT_RENDER_BATCH_SIZE,
    buildEmojiImageUrl,
    defaultCategories,
    defaultEmojiLocale,
    filterCategories,
    getEmojiMessages,
    getEmojiPreset,
    getEmojiStyles,
    getStyleName,
    type EmojiLocale,
    type EmojiPresetKey,
    type EmojiItem,
    type EmojiItemWithStyle
  } from '@igeekfan/fluent-emoji-ms-core'
  import { createEventDispatcher, onMount } from 'svelte'
  import EmojiPicker from './EmojiPicker.svelte'
  import type { FluentEmojiPickerProps, SelectEventDetail } from './types'

  type CategoryTabKind = 'recent' | 'common' | 'category'

  interface CategoryTab {
    value: string
    name: string
    icon?: string
    kind: CategoryTabKind
  }

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
  export let searchMode: FluentEmojiPickerProps['searchMode'] = 'toggle'
  export let showStyleSelect: FluentEmojiPickerProps['showStyleSelect'] = true
  export let showCategoryTabs: FluentEmojiPickerProps['showCategoryTabs'] = true
  export let showCommonCategory: FluentEmojiPickerProps['showCommonCategory'] = true
  export let commonEmojiNames: FluentEmojiPickerProps['commonEmojiNames'] = undefined
  export let recentEmojiNames: FluentEmojiPickerProps['recentEmojiNames'] = undefined
  export let recentLimit: FluentEmojiPickerProps['recentLimit'] = 12
  export let persistRecent: FluentEmojiPickerProps['persistRecent'] = true
  export let storageKey: FluentEmojiPickerProps['storageKey'] = 'fluent-emoji-ms:recent'
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
  let isSearchOpen = false
  let isOptionsOpen = false
  let searchQuery = ''
  let selectedStyle = initialStyle
  let selectedEmojiCategory = defaultCategory
  let selectedEmoji: EmojiItem | null = null
  let renderLimit = renderBatchSize
  let previousCollectionKey = ''
  let previousRenderResetKey = ''
  let storedRecentEmojiNames: string[] = []
  let activeTab = 'common'

  $: messages = getEmojiMessages(locale)
  $: localizedStyles = getEmojiStyles(locale)
  $: commonPreset = getEmojiPreset('common', locale)
  $: resolvedCommonEmojiNames = commonEmojiNames?.length ? commonEmojiNames : commonPreset.emojiNames
  $: resolvedRecentEmojiNames = (recentEmojiNames?.length ? recentEmojiNames : storedRecentEmojiNames)
    .filter(Boolean)
    .slice(0, recentLimit)
  $: recentTabName = locale === 'en-US' ? 'Recent' : '最近'
  $: searchButtonLabel = locale === 'en-US' ? 'Search' : '搜索'
  $: optionsButtonLabel = locale === 'en-US' ? 'Options' : '更多'
  $: effectiveCategories = categories?.length
    ? categories
    : preset || emojiNames?.length
      ? ['all']
      : defaultCategories
  $: availableCategories = filterCategories({ categories: effectiveCategories, preset, emojiNames }, locale)
  $: categoryTabs = [
    ...(resolvedRecentEmojiNames.length
      ? [{ value: 'recent', name: recentTabName, icon: '🕘', kind: 'recent' as const }]
      : []),
    ...(showCommonCategory && resolvedCommonEmojiNames.length
      ? [{ value: 'common', name: commonPreset.label, icon: '⭐', kind: 'common' as const }]
      : []),
    ...(showCategoryTabs
      ? availableCategories
          .filter((category) => category.value !== 'all')
          .map((category) => ({ value: category.value, name: category.name, icon: category.icon, kind: 'category' as const }))
      : [])
  ] satisfies CategoryTab[]
  $: activeCategoryTab = categoryTabs.find((tab) => tab.value === activeTab)
  $: shouldShowInlineSearch = showSearch && (searchMode === 'inline' || (searchMode === 'toggle' && isSearchOpen))
  $: shouldShowSearchToggle = showSearch && searchMode === 'toggle'
  $: pickerEmojiNames = activeCategoryTab?.kind === 'recent'
    ? resolvedRecentEmojiNames
    : activeCategoryTab?.kind === 'common'
      ? resolvedCommonEmojiNames
      : emojiNames
  $: pickerPreset = activeCategoryTab?.kind === 'category' || !activeCategoryTab ? preset : undefined
  $: pickerCategories = activeCategoryTab?.kind === 'category' || !activeCategoryTab ? effectiveCategories : ['all']
  $: pickerSelectedCategory = activeCategoryTab?.kind === 'category'
    ? activeTab
    : !activeCategoryTab
      ? selectedEmojiCategory
      : 'all'
  $: if (categoryTabs.length && !categoryTabs.some((tab) => tab.value === activeTab)) {
    activeTab = categoryTabs[0].value
  }
  $: {
    const nextRenderResetKey = `${pickerSelectedCategory}|${searchQuery}|${preset ?? ''}|${(pickerEmojiNames ?? []).join('|')}|${pickerCategories.join('|')}|${renderBatchSize}`
    if (nextRenderResetKey !== previousRenderResetKey) {
      previousRenderResetKey = nextRenderResetKey
      renderLimit = renderBatchSize
    }
  }
  $: if (!showSearch && searchQuery) {
    searchQuery = ''
    isSearchOpen = false
  }
  $: if (searchMode === 'hidden' && searchQuery) {
    searchQuery = ''
  }
  $: if (searchMode !== 'toggle') {
    isSearchOpen = false
  }
  $: {
    const nextCollectionKey = `${defaultCategory}|${preset ?? ''}|${(emojiNames ?? []).join('|')}|${effectiveCategories.join('|')}`
    if (nextCollectionKey !== previousCollectionKey) {
      previousCollectionKey = nextCollectionKey
      selectedEmojiCategory = defaultCategory
      activeTab = defaultCategory
      renderLimit = renderBatchSize
    }
  }

  onMount(() => {
    if (!persistRecent || recentEmojiNames?.length) {
      return
    }

    try {
      const storedValue = window.localStorage.getItem(storageKey)
      const parsedValue = storedValue ? JSON.parse(storedValue) : []
      if (Array.isArray(parsedValue)) {
        storedRecentEmojiNames = parsedValue.filter((item): item is string => typeof item === 'string')
        if (storedRecentEmojiNames.length) {
          activeTab = 'recent'
        }
      }
    } catch {
      storedRecentEmojiNames = []
    }
  })

  function togglePanel() {
    if (disabled) {
      return
    }

    isOpen = !isOpen
  }

  function handleEmojiSelect(emoji: EmojiItem) {
    selectedEmoji = emoji
    rememberRecentEmoji(emoji.name)

    const emojiWithStyle: EmojiItemWithStyle = {
      ...emoji,
      style: selectedStyle
    }

    dispatch('select', { emoji: emojiWithStyle })

    if (closeOnSelect) {
      isOpen = false
      isOptionsOpen = false
    }
  }

  function handleClear() {
    selectedEmoji = null
    dispatch('clear')
  }

  function handleClickOutside(event: MouseEvent) {
    if (hostElement && !hostElement.contains(event.target as Node)) {
      isOpen = false
      isOptionsOpen = false
    }
  }

  function rememberRecentEmoji(name: string) {
    if (!persistRecent || recentEmojiNames?.length) {
      return
    }

    storedRecentEmojiNames = [
      name,
      ...storedRecentEmojiNames.filter((item) => item !== name)
    ].slice(0, recentLimit)
    activeTab = 'recent'

    try {
      window.localStorage.setItem(storageKey, JSON.stringify(storedRecentEmojiNames))
    } catch {
      // Storage is best-effort and should never block selection.
    }
  }

  function toggleSearch() {
    isSearchOpen = !isSearchOpen
    if (!isSearchOpen && searchQuery) {
      searchQuery = ''
    }
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
      <div class="quick-toolbar">
        {#if categoryTabs.length}
          <div class="category-tabs" role="tablist">
            {#each categoryTabs as tab}
              <button
                type="button"
                class:active={activeTab === tab.value}
                class="category-tab"
                title={tab.name}
                role="tab"
                aria-selected={activeTab === tab.value}
                on:click={() => {
                  activeTab = tab.value
                  selectedEmojiCategory = tab.value
                }}
              >
                <span class="category-tab-icon">{tab.icon}</span>
                {#if activeTab === tab.value}
                  <span class="category-tab-label">{tab.name}</span>
                {/if}
              </button>
            {/each}
          </div>
        {/if}

        <div class="toolbar-actions">
          {#if shouldShowSearchToggle}
            <button type="button" class:active={isSearchOpen} class="icon-button" title={searchButtonLabel} aria-label={searchButtonLabel} on:click={toggleSearch}>⌕</button>
          {/if}
          {#if showStyleSelect}
            <button type="button" class:active={isOptionsOpen} class="icon-button" title={optionsButtonLabel} aria-label={optionsButtonLabel} on:click={() => (isOptionsOpen = !isOptionsOpen)}>⋯</button>
          {/if}
        </div>
      </div>

      {#if shouldShowInlineSearch}
        <input bind:value={searchQuery} type="search" class="search-input" placeholder={messages.ui.searchPlaceholder} />
      {/if}

      {#if showStyleSelect && isOptionsOpen}
        <div class="options-panel">
          <span class="options-label">{messages.ui.style}</span>
          <select bind:value={selectedStyle} class="style-select">
            {#each localizedStyles as style}
              <option value={style.value}>{style.name}</option>
            {/each}
          </select>
        </div>
      {/if}

      <EmojiPicker
        {baseUrl}
        selectedStyle={selectedStyle}
        {locale}
        categories={pickerCategories}
        preset={pickerPreset}
        emojiNames={pickerEmojiNames}
        selectedCategory={pickerSelectedCategory}
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
    display: grid;
    gap: 10px;
    padding: 12px;
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 14px;
    box-shadow: 0 18px 40px rgba(15, 23, 42, 0.14);
  }

  .quick-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 6px;
    min-width: 0;
  }

  .category-tabs {
    display: flex;
    flex: 1;
    align-items: center;
    gap: 2px;
    min-width: 0;
    padding: 3px;
    overflow-x: auto;
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    background: #f5f6f8;
    scrollbar-width: none;
  }

  .category-tabs::-webkit-scrollbar {
    display: none;
  }

  .category-tab,
  .icon-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 30px;
    flex: 0 0 auto;
    border: 0;
    border-radius: 7px;
    background: transparent;
    color: #475569;
    cursor: pointer;
    transition: background-color 140ms ease, color 140ms ease, box-shadow 140ms ease;
  }

  .category-tab {
    width: 30px;
    gap: 5px;
    padding: 0;
  }

  .category-tab:hover,
  .icon-button:hover {
    background: rgba(15, 23, 42, 0.06);
    color: #0f172a;
  }

  .category-tab.active,
  .icon-button.active {
    background: #fff;
    color: #111827;
    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.12);
  }

  .category-tab.active {
    width: auto;
    max-width: 92px;
    padding: 0 9px 0 7px;
  }

  .category-tab-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    flex: 0 0 auto;
    opacity: 0.68;
    filter: grayscale(0.35);
    line-height: 1;
    font-size: 15px;
  }

  .category-tab.active .category-tab-icon,
  .category-tab:hover .category-tab-icon {
    opacity: 1;
    filter: none;
  }

  .category-tab-label {
    overflow: hidden;
    color: #1f2937;
    font-size: 12px;
    font-weight: 500;
    line-height: 1;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .toolbar-actions {
    display: inline-flex;
    gap: 3px;
    flex: 0 0 auto;
    padding: 3px;
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    background: #fff;
  }

  .icon-button {
    width: 30px;
    font-size: 17px;
  }

  .search-input,
  .style-select {
    min-width: 0;
    padding: 10px 12px;
    border: 1px solid #d0d7de;
    border-radius: 10px;
  }

  .options-panel {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    align-items: center;
    gap: 8px;
    padding: 8px;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    background: #f8fafc;
  }

  .options-label {
    color: #64748b;
    font-size: 12px;
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

  @media (prefers-reduced-motion: reduce) {
    .category-tab,
    .icon-button {
      transition: none;
    }
  }
</style>
