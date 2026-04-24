import { getEmojiCategories, emojiCategories } from './data/emoji-categories'
import { emojiList } from './data/emoji-list'
import { defaultEmojiPreset, emojiPresets, getEmojiPresets } from './data/emoji-presets'
import { emojiStyles, getEmojiStyles, getStyleName } from './data/emoji-styles'
import { defaultEmojiLocale, getEmojiLocaleMessages } from './i18n'
import type {
  EmojiCategory,
  EmojiCollectionOptions,
  EmojiItem,
  EmojiItemWithStyle,
  EmojiLocale,
  EmojiLocaleMessages,
  EmojiPreset,
  EmojiPresetKey,
  EmojiPickerState,
  EmojiPickerStateStore,
  EmojiQueryOptions,
  EmojiQueryResult,
  StyleOption
} from './types'

export type {
  EmojiCategory,
  EmojiCollectionOptions,
  EmojiItem,
  EmojiItemWithStyle,
  EmojiLocale,
  EmojiLocaleMessages,
  EmojiPreset,
  EmojiPresetKey,
  EmojiPickerState,
  EmojiPickerStateStore,
  EmojiQueryOptions,
  EmojiQueryResult,
  StyleOption
}

export const DEFAULT_BASE_URL = 'https://cdn.jsdelivr.net/npm/fluentui-emoji@1.1.1'
export const DEFAULT_RENDER_BATCH_SIZE = 240
export const defaultCategories = ['smileys', 'animals', 'food', 'symbols']

type IndexedEmoji = EmojiItem & {
  searchText: string
}

interface EmojiIndex {
  all: IndexedEmoji[]
  byCategory: Map<string, IndexedEmoji[]>
  byName: Map<string, IndexedEmoji>
  usedCategories: Set<string>
}

const categoryLookup = new Map(emojiCategories.map((category) => [category.value, category]))

function validateEmojiCategory(category: string | undefined): string {
  if (!category) {
    return 'objects'
  }

  return categoryLookup.has(category) ? category : 'objects'
}

function normalizeCategories(categories: string[] = defaultCategories): string[] {
  if (!categories.length || categories.includes('all')) {
    return ['all']
  }

  return categories.map((category) => validateEmojiCategory(category))
}

function buildEmojiIndex(): EmojiIndex {
  const byCategory = new Map<string, IndexedEmoji[]>()
  const byName = new Map<string, IndexedEmoji>()
  const usedCategories = new Set<string>()

  const all = emojiList.map((emoji) => {
    const normalizedCategory = validateEmojiCategory(emoji.category)
    const indexedEmoji: IndexedEmoji = {
      ...emoji,
      category: normalizedCategory,
      searchText: `${emoji.name} ${normalizedCategory}`.toLowerCase()
    }

    usedCategories.add(normalizedCategory)

    const bucket = byCategory.get(normalizedCategory)
    if (bucket) {
      bucket.push(indexedEmoji)
    } else {
      byCategory.set(normalizedCategory, [indexedEmoji])
    }

    byName.set(indexedEmoji.name, indexedEmoji)

    return indexedEmoji
  })

  return {
    all,
    byCategory,
    byName,
    usedCategories
  }
}

const emojiIndex = buildEmojiIndex()

function normalizeCollectionOptions(
  optionsOrCategories: EmojiCollectionOptions | string[] = defaultCategories
): EmojiCollectionOptions {
  return Array.isArray(optionsOrCategories) ? { categories: optionsOrCategories } : optionsOrCategories
}

function resolveCollectionCategories(options: EmojiCollectionOptions): string[] {
  if (options.categories?.length) {
    return options.categories
  }

  if (options.preset || options.emojiNames?.length) {
    return ['all']
  }

  return defaultCategories
}

function uniqueItems(items: IndexedEmoji[]): IndexedEmoji[] {
  const seen = new Set<string>()

  return items.filter((item) => {
    if (seen.has(item.name)) {
      return false
    }

    seen.add(item.name)
    return true
  })
}

function resolveScopedItems(index: EmojiIndex, options: EmojiCollectionOptions): IndexedEmoji[] | null {
  const explicitNames = options.emojiNames?.filter(Boolean) ?? []
  const presetNames = options.preset ? emojiPresets[options.preset]?.emojiNames ?? [] : []
  const sourceNames = explicitNames.length ? explicitNames : presetNames

  if (!sourceNames.length) {
    return null
  }

  return uniqueItems(
    sourceNames
      .map((name) => index.byName.get(name))
      .filter((item): item is IndexedEmoji => Boolean(item))
  )
}

function filterItemsByAllowedCategories(items: IndexedEmoji[], categories: string[] = defaultCategories) {
  const normalizedCategories = normalizeCategories(categories)
  if (normalizedCategories.includes('all')) {
    return items
  }

  return items.filter((item) => normalizedCategories.includes(item.category))
}

function getUsedCategories(items: IndexedEmoji[]): Set<string> {
  return new Set(items.map((item) => item.category))
}

function getSourceItems(index: EmojiIndex, options: EmojiQueryOptions): IndexedEmoji[] {
  const { selectedCategory = 'all' } = options
  const categories = resolveCollectionCategories(options)
  const normalizedSelectedCategory = validateEmojiCategory(selectedCategory)
  const scopedItems = resolveScopedItems(index, options)

  if (scopedItems) {
    const filteredScopedItems = filterItemsByAllowedCategories(scopedItems, categories)
    if (selectedCategory && selectedCategory !== 'all') {
      return filteredScopedItems.filter((item) => item.category === normalizedSelectedCategory)
    }

    return filteredScopedItems
  }

  if (selectedCategory && selectedCategory !== 'all') {
    return index.byCategory.get(normalizedSelectedCategory) ?? []
  }

  const normalizedCategories = normalizeCategories(categories)
  if (normalizedCategories.includes('all')) {
    return index.all
  }

  return normalizedCategories.flatMap((category) => index.byCategory.get(category) ?? [])
}

export function getEmojiIndex() {
  return emojiIndex
}

export function queryEmojis(options: EmojiQueryOptions = {}): EmojiQueryResult {
  const {
    categories,
    preset,
    emojiNames,
    selectedCategory = 'all',
    search = '',
    limit
  } = options

  const searchTokens = search
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)

  const sourceItems = getSourceItems(emojiIndex, {
    categories,
    preset,
    emojiNames,
    selectedCategory
  })
  const filteredItems = searchTokens.length
    ? sourceItems.filter((item) => searchTokens.every((token) => item.searchText.includes(token)))
    : sourceItems

  const items = typeof limit === 'number' ? filteredItems.slice(0, limit) : filteredItems

  return {
    items: items.map(({ searchText, ...emoji }) => emoji),
    total: filteredItems.length,
    hasMore: typeof limit === 'number' ? filteredItems.length > items.length : false
  }
}

export function filterEmojisByCategories(categories: string[] = defaultCategories): EmojiItem[] {
  return queryEmojis(normalizeCollectionOptions(categories)).items
}

export function filterCategories(
  optionsOrCategories: EmojiCollectionOptions | string[] = defaultCategories,
  locale: EmojiLocale = defaultEmojiLocale
): EmojiCategory[] {
  const options = normalizeCollectionOptions(optionsOrCategories)
  const normalizedCategories = normalizeCategories(resolveCollectionCategories(options))
  const localizedCategories = getEmojiCategories(locale)
  const localizedCategoryLookup = new Map(localizedCategories.map((category) => [category.value, category]))
  const allCategory = localizedCategoryLookup.get('all')
  const scopedItems = resolveScopedItems(emojiIndex, options)
  const usedCategories = scopedItems
    ? getUsedCategories(filterItemsByAllowedCategories(scopedItems, resolveCollectionCategories(options)))
    : emojiIndex.usedCategories

  if (!allCategory) {
    return []
  }

  if (normalizedCategories.includes('all')) {
    return [
      allCategory,
      ...localizedCategories.filter(
        (category) => category.value !== 'all' && usedCategories.has(category.value)
      )
    ]
  }

  return [
    allCategory,
    ...localizedCategories.filter(
      (category) =>
        category.value !== 'all' &&
        normalizedCategories.includes(category.value) &&
        usedCategories.has(category.value)
    )
  ]
}

export function getEmojiMessages(locale: EmojiLocale = defaultEmojiLocale): EmojiLocaleMessages {
  return getEmojiLocaleMessages(locale)
}

export function getEmojiPreset(preset: EmojiPresetKey, locale: EmojiLocale = defaultEmojiLocale): EmojiPreset {
  return getEmojiPresets(locale)[preset]
}

export function buildEmojiImageUrl(baseUrl: string, style: string, path: string): string {
  return `${baseUrl}/icons/${style}/${path}`
}

export function createEmojiPickerState(initialState: Partial<EmojiPickerState> = {}): EmojiPickerStateStore {
  const state: EmojiPickerState = {
    isOpen: false,
    baseUrl: DEFAULT_BASE_URL,
    selectedStyle: 'modern',
    selectedEmojiCategory: 'all',
    searchQuery: '',
    selectedEmoji: null,
    renderLimit: DEFAULT_RENDER_BATCH_SIZE,
    ...initialState
  }

  const snapshot = () => ({ ...state })

  return {
    getState: snapshot,
    setOpen(value) {
      state.isOpen = value
      return snapshot()
    },
    setBaseUrl(value) {
      state.baseUrl = value
      return snapshot()
    },
    setStyle(value) {
      state.selectedStyle = value
      return snapshot()
    },
    setCategory(value) {
      state.selectedEmojiCategory = value
      state.renderLimit = DEFAULT_RENDER_BATCH_SIZE
      return snapshot()
    },
    setSearchQuery(value) {
      state.searchQuery = value
      state.renderLimit = DEFAULT_RENDER_BATCH_SIZE
      return snapshot()
    },
    selectEmoji(emoji) {
      state.selectedEmoji = emoji
      return snapshot()
    },
    resetRenderLimit(nextLimit = DEFAULT_RENDER_BATCH_SIZE) {
      state.renderLimit = nextLimit
      return snapshot()
    },
    loadMore(step = DEFAULT_RENDER_BATCH_SIZE) {
      state.renderLimit += step
      return snapshot()
    },
    clearSelection() {
      state.selectedEmoji = null
      return snapshot()
    }
  }
}

export {
  defaultEmojiLocale,
  defaultEmojiPreset,
  emojiCategories,
  emojiList,
  emojiPresets,
  emojiStyles,
  getEmojiCategories,
  getEmojiPresets,
  getEmojiStyles,
  getStyleName
}
export const commonEmojis = emojiList
export const categories = emojiCategories