import type { EmojiLocale, EmojiLocaleMessages } from './types'

export const defaultEmojiLocale: EmojiLocale = 'zh-CN'

const localeMessages: Record<EmojiLocale, EmojiLocaleMessages> = {
  'zh-CN': {
    locale: 'zh-CN',
    ui: {
      pickerButton: '选择表情',
      searchPlaceholder: '搜索表情',
      noResults: '没有找到匹配的表情',
      loadMore: '加载更多',
      clear: '清除',
      style: '风格'
    },
    categories: {
      all: '全部',
      smileys: '表情',
      people: '人物',
      gestures: '手势',
      animals: '动物',
      food: '食物',
      drinks: '饮品',
      travel: '旅行',
      places: '地点',
      transportation: '交通',
      activities: '活动',
      objects: '物品',
      nature: '自然',
      symbols: '符号',
      flags: '旗帜'
    },
    styles: {
      modern: '现代',
      flat: '扁平',
      'high-contrast': '高对比'
    },
    presets: {
      basic: {
        label: '常用反馈',
        description: '覆盖点赞、感谢、庆祝、常见心情和聊天高频反馈，适合作为默认入口。'
      },
      reactions: {
        label: '聊天互动',
        description: '适合飞书、掘金评论、IM 聊天和轻互动反馈，强调即点即发。'
      },
      workflow: {
        label: '工作反馈',
        description: '适合审批、任务流转、发布状态和团队协作反馈。'
      }
    }
  },
  'en-US': {
    locale: 'en-US',
    ui: {
      pickerButton: 'Pick Emoji',
      searchPlaceholder: 'Search emoji',
      noResults: 'No matching emoji found',
      loadMore: 'Load more',
      clear: 'Clear',
      style: 'Style'
    },
    categories: {
      all: 'All',
      smileys: 'Smileys',
      people: 'People',
      gestures: 'Gestures',
      animals: 'Animals',
      food: 'Food',
      drinks: 'Drinks',
      travel: 'Travel',
      places: 'Places',
      transportation: 'Transport',
      activities: 'Activities',
      objects: 'Objects',
      nature: 'Nature',
      symbols: 'Symbols',
      flags: 'Flags'
    },
    styles: {
      modern: 'Modern',
      flat: 'Flat',
      'high-contrast': 'High Contrast'
    },
    presets: {
      basic: {
        label: 'Everyday Feedback',
        description: 'A broader starter pack for likes, thanks, celebration, common moods, and frequent chat reactions.'
      },
      reactions: {
        label: 'Chat Reactions',
        description: 'Fits IM threads, comment bars, and quick feedback patterns in product communities.'
      },
      workflow: {
        label: 'Workflow Signals',
        description: 'Covers approvals, task flow, release updates, and team status signals.'
      }
    }
  }
}

export function getEmojiLocaleMessages(locale: EmojiLocale = defaultEmojiLocale): EmojiLocaleMessages {
  return localeMessages[locale] ?? localeMessages[defaultEmojiLocale]
}