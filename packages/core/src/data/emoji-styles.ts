import { defaultEmojiLocale, getEmojiLocaleMessages } from '../i18n'
import type { EmojiLocale, StyleOption } from '../types'

export const emojiStyles: StyleOption[] = [
  { name: '现代', value: 'modern' },
  { name: '扁平', value: 'flat' },
  { name: '高对比', value: 'high-contrast' }
]

export function getEmojiStyles(locale: EmojiLocale = defaultEmojiLocale): StyleOption[] {
  const messages = getEmojiLocaleMessages(locale)

  return emojiStyles.map((style) => ({
    ...style,
    name: messages.styles[style.value] ?? style.name
  }))
}

export function getStyleName(styleValue: string, locale: EmojiLocale = defaultEmojiLocale): string {
  const style = getEmojiStyles(locale).find((item) => item.value === styleValue)
  return style ? style.name : styleValue
}
