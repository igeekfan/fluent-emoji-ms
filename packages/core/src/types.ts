export interface EmojiItem {
  name: string
  path: string
  category: string
}

export interface EmojiItemWithStyle extends EmojiItem {
  style: string
}

export interface EmojiCategory {
  name: string
  value: string
  icon?: string
}

export type EmojiPresetKey = 'basic' | 'reactions' | 'workflow'

export interface EmojiPreset {
  key: EmojiPresetKey
  label: string
  description: string
  emojiNames: string[]
}

export type EmojiLocale = 'zh-CN' | 'en-US'

export interface EmojiLocaleMessages {
  locale: EmojiLocale
  ui: {
    pickerButton: string
    searchPlaceholder: string
    noResults: string
    loadMore: string
    clear: string
    style: string
  }
  categories: Record<string, string>
  styles: Record<string, string>
  presets: Record<EmojiPresetKey, Pick<EmojiPreset, 'label' | 'description'>>
}

export interface StyleOption {
  name: string
  value: string
}

export interface EmojiCollectionOptions {
  categories?: string[]
  preset?: EmojiPresetKey
  emojiNames?: string[]
}

export interface EmojiQueryOptions extends EmojiCollectionOptions {
  selectedCategory?: string
  search?: string
  limit?: number
}

export interface EmojiQueryResult {
  items: EmojiItem[]
  total: number
  hasMore: boolean
}

export interface EmojiPickerState {
  isOpen: boolean
  baseUrl: string
  selectedStyle: string
  selectedEmojiCategory: string
  searchQuery: string
  selectedEmoji: EmojiItemWithStyle | null
  renderLimit: number
}

export interface EmojiPickerStateStore {
  getState: () => EmojiPickerState
  setOpen: (value: boolean) => EmojiPickerState
  setBaseUrl: (value: string) => EmojiPickerState
  setStyle: (value: string) => EmojiPickerState
  setCategory: (value: string) => EmojiPickerState
  setSearchQuery: (value: string) => EmojiPickerState
  selectEmoji: (emoji: EmojiItemWithStyle | null) => EmojiPickerState
  resetRenderLimit: (nextLimit?: number) => EmojiPickerState
  loadMore: (step?: number) => EmojiPickerState
  clearSelection: () => EmojiPickerState
}
