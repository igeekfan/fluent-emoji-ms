import { defaultEmojiLocale, getEmojiLocaleMessages } from '../i18n'
import type { EmojiLocale, EmojiPreset, EmojiPresetKey } from '../types'

export const defaultEmojiPreset: EmojiPresetKey = 'basic'

export const emojiPresets: Record<EmojiPresetKey, EmojiPreset> = {
  basic: {
    key: 'basic',
    label: '常用反馈',
    description: '覆盖点赞、感谢、庆祝、常见心情和聊天高频反馈，适合作为默认入口。',
    emojiNames: [
      'Grinning Face',
      'Slightly Smiling Face',
      'Beaming Face With Smiling Eyes',
      'Smiling Face With Smiling Eyes',
      'Winking Face',
      'Rolling On The Floor Laughing',
      'Smiling Face With Heart Eyes',
      'Smiling Face With Hearts',
      'Smiling Face With Halo',
      'Face With Tears Of Joy',
      'Thinking Face',
      'Face With Open Mouth',
      'Face Holding Back Tears',
      'Crying Face',
      'Loudly Crying Face',
      'Pleading Face',
      'Angry Face',
      'Partying Face',
      'Face Blowing A Kiss',
      'Smiling Face With Sunglasses',
      'Star Struck',
      'Exploding Head',
      'Red Heart',
      'Orange Heart',
      'Blue Heart',
      'Broken Heart',
      'Sparkles',
      'Party Popper',
      'Wrapped Gift',
      'Balloon',
      'Fire',
      'Hundred Points',
      'Thumbs Up Default',
      'Thumbs Down Default',
      'Clapping Hands Default',
      'Folded Hands Default',
      'Waving Hand Default',
      'Ok Hand Default',
      'Victory Hand Default',
      'Heart Hands Default',
      'Check Mark Button',
      'Raising Hands Default'
    ]
  },
  reactions: {
    key: 'reactions',
    label: '评论互动',
    description: '适合评论区、聊天气泡和轻互动反馈，强调快速点击而不是全量搜索。',
    emojiNames: [
      'Eyes',
      'Thumbs Up Default',
      'Thumbs Down Default',
      'Clapping Hands Default',
      'Folded Hands Default',
      'Waving Hand Default',
      'Face With Rolling Eyes',
      'Pleading Face',
      'Loudly Crying Face',
      'Face With Tears Of Joy',
      'Smiling Face With Sunglasses',
      'Star Struck',
      'Thinking Face',
      'Red Heart',
      'Fire',
      'Sparkles',
      'Hundred Points',
      'Ok Hand Default',
      'Victory Hand Default'
    ]
  },
  workflow: {
    key: 'workflow',
    label: '工作流状态',
    description: '适合审批、任务流转和发布反馈，只保留能表达状态的基础表情。',
    emojiNames: [
      'Check Mark Button',
      'Cross Mark',
      'Memo',
      'Light Bulb',
      'Rocket',
      'Eyes',
      'Laptop',
      'Calendar',
      'Bell',
      'Pushpin',
      'File Folder',
      'Bookmark Tabs',
      'Link',
      'Package',
      'Hourglass Done',
      'Warning',
      'Fire',
      'Sparkles',
      'Party Popper',
      'Thinking Face'
    ]
  }
}

export function getEmojiPresets(locale: EmojiLocale = defaultEmojiLocale): Record<EmojiPresetKey, EmojiPreset> {
  const messages = getEmojiLocaleMessages(locale)

  return Object.fromEntries(
    Object.entries(emojiPresets).map(([key, preset]) => [
      key,
      {
        ...preset,
        label: messages.presets[preset.key]?.label ?? preset.label,
        description: messages.presets[preset.key]?.description ?? preset.description
      }
    ])
  ) as Record<EmojiPresetKey, EmojiPreset>
}