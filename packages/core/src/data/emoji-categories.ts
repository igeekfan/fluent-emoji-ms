import { defaultEmojiLocale, getEmojiLocaleMessages } from '../i18n'
import type { EmojiCategory, EmojiLocale } from '../types'

export const emojiCategories: EmojiCategory[] = [
  { value: 'all', name: '全部', icon: '🌟' },
  { value: 'smileys', name: '表情', icon: '😊' },
  { value: 'people', name: '人物', icon: '👨‍👩‍👧' },
  { value: 'gestures', name: '手势', icon: '👋' },
  { value: 'animals', name: '动物', icon: '🐱' },
  { value: 'food', name: '食物', icon: '🍔' },
  { value: 'drinks', name: '饮品', icon: '🍹' },
  { value: 'travel', name: '旅行', icon: '🏖️' },
  { value: 'places', name: '地点', icon: '🏢' },
  { value: 'transportation', name: '交通', icon: '🚗' },
  { value: 'activities', name: '活动', icon: '⚽' },
  { value: 'objects', name: '物品', icon: '💡' },
  { value: 'nature', name: '自然', icon: '🌿' },
  { value: 'symbols', name: '符号', icon: '♥️' },
  { value: 'flags', name: '旗帜', icon: '🏁' }
]

export const detailedEmojiCategories: EmojiCategory[] = []

export function getEmojiCategories(locale: EmojiLocale = defaultEmojiLocale): EmojiCategory[] {
  const messages = getEmojiLocaleMessages(locale)

  return emojiCategories.map((category) => ({
    ...category,
    name: messages.categories[category.value] ?? category.name
  }))
}

export function getSubcategories() {
  return []
}

export function getMainCategory(category: string) {
  return category
}
