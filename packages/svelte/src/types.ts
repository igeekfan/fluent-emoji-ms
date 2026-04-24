import type { EmojiItemWithStyle, EmojiLocale, EmojiPresetKey } from '@igeekfan/fluent-emoji-ms-core'

export interface FluentEmojiPickerProps {
  disabled?: boolean
  initialStyle?: string
  defaultCategory?: string
  buttonText?: string
  baseUrl?: string
  locale?: EmojiLocale
  width?: number | string
  categories?: string[]
  preset?: EmojiPresetKey
  emojiNames?: string[]
  showSearch?: boolean
  closeOnSelect?: boolean
  showSelectedEmoji?: boolean
  emojiSize?: number
  columns?: number
  autoFill?: boolean
  renderBatchSize?: number
}

export interface EmojiPickerProps {
  baseUrl?: string
  width?: number | string
  selectedStyle?: string
  locale?: EmojiLocale
  categories?: string[]
  preset?: EmojiPresetKey
  emojiNames?: string[]
  selectedCategory?: string
  searchQuery?: string
  emojiSize?: number
  columns?: number
  autoFill?: boolean
  renderLimit?: number
  renderBatchSize?: number
}

export interface SelectEventDetail {
  emoji: EmojiItemWithStyle
}
