import { describe, expect, it } from 'vitest'
import {
  DEFAULT_RENDER_BATCH_SIZE,
  createEmojiPickerState,
  filterCategories,
  getEmojiMessages,
  getEmojiPreset,
  getStyleName,
  queryEmojis
} from './index'

describe('queryEmojis', () => {
  it('limits category results and reports when more items remain', () => {
    const result = queryEmojis({
      categories: ['activities'],
      selectedCategory: 'activities',
      limit: 5
    })

    expect(result.items).toHaveLength(5)
    expect(result.total).toBeGreaterThan(5)
    expect(result.hasMore).toBe(true)
    expect(result.items.every((item) => item.category === 'activities')).toBe(true)
  })

  it('matches multi-token searches against the indexed search text', () => {
    const result = queryEmojis({
      categories: ['all'],
      search: 'alarm clock'
    })

    expect(result.items.some((item) => item.name === 'Alarm Clock')).toBe(true)
  })

  it('supports curated presets instead of exposing the full emoji list', () => {
    const result = queryEmojis({
      preset: 'workflow'
    })

    expect(result.items.map((item) => item.name)).toEqual(getEmojiPreset('workflow').emojiNames)
    expect(result.hasMore).toBe(false)
  })

  it('supports explicit emoji name collections with category filtering', () => {
    const result = queryEmojis({
      emojiNames: ['Check Mark Button', 'Memo', 'Light Bulb'],
      categories: ['objects']
    })

    expect(result.items.map((item) => item.name)).toEqual(['Check Mark Button', 'Light Bulb'])
  })
})

describe('filterCategories', () => {
  it('keeps all plus only the requested used categories', () => {
    const categories = filterCategories(['symbols'])

    expect(categories.map((item) => item.value)).toEqual(['all', 'symbols'])
  })

  it('returns all first when all categories are requested', () => {
    const categories = filterCategories(['all'])

    expect(categories[0]?.value).toBe('all')
    expect(categories.length).toBeGreaterThan(5)
  })

  it('limits category options to the categories used by a preset', () => {
    const categories = filterCategories({ preset: 'workflow', categories: ['all'] })

    expect(categories.map((item) => item.value)).toEqual([
      'all',
      'smileys',
      'gestures',
      'transportation',
      'activities',
      'objects',
      'symbols'
    ])
  })

  it('localizes category labels when a locale is provided', () => {
    const categories = filterCategories({ preset: 'workflow', categories: ['all'] }, 'en-US')

    expect(categories[0]?.name).toBe('All')
    expect(categories.some((item) => item.name === 'Objects')).toBe(true)
  })
})

describe('i18n helpers', () => {
  it('returns localized preset labels, style names, and ui copy', () => {
    expect(getEmojiPreset('reactions', 'en-US').label).toBe('Chat Reactions')
    expect(getStyleName('high-contrast', 'en-US')).toBe('High Contrast')
    expect(getEmojiMessages('en-US').ui.searchPlaceholder).toBe('Search emoji')
  })
})

describe('createEmojiPickerState', () => {
  it('tracks loadMore and resets renderLimit on category and search changes', () => {
    const store = createEmojiPickerState()

    expect(store.getState().renderLimit).toBe(DEFAULT_RENDER_BATCH_SIZE)

    store.loadMore(60)
    expect(store.getState().renderLimit).toBe(DEFAULT_RENDER_BATCH_SIZE + 60)

    store.setCategory('symbols')
    expect(store.getState().selectedEmojiCategory).toBe('symbols')
    expect(store.getState().renderLimit).toBe(DEFAULT_RENDER_BATCH_SIZE)

    store.loadMore(90)
    store.setSearchQuery('alarm')
    expect(store.getState().searchQuery).toBe('alarm')
    expect(store.getState().renderLimit).toBe(DEFAULT_RENDER_BATCH_SIZE)
  })

  it('stores and clears selected emojis without mutating previous snapshots', () => {
    const store = createEmojiPickerState()
    const before = store.getState()

    store.selectEmoji({
      name: 'Alarm Clock',
      path: 'alarm-clock.svg',
      category: 'gestures',
      style: 'flat'
    })

    const selected = store.getState()
    expect(before.selectedEmoji).toBeNull()
    expect(selected.selectedEmoji?.name).toBe('Alarm Clock')

    store.clearSelection()
    expect(store.getState().selectedEmoji).toBeNull()
  })
})