// 导出组件和核心功能
import FluentEmojiPicker from './components/FluentEmojiPicker.vue'
import EmojiPicker from './components/EmojiPicker.vue'
import Popover from './components/Popover.vue'

// 导出类型
import type { 
  EmojiItem, 
  EmojiItemWithStyle, 
  EmojiCategory, 
  StyleOption 
} from './types/emoji.d.ts'

// 导出数据
import { defaultCategories, filterEmojisByCategories, filterCategories } from './data/emoji-utils'
import { emojiCategories } from './data/emoji-categories'
import { emojiStyles } from './data/emoji-styles'

// 导出插件和配置
import { FluentEmojiPlugin, useEmojiConfig } from './plugin'
import { config, updateConfig } from './config'

// 导出组件
export {
  FluentEmojiPicker,
  EmojiPicker,
  Popover,
  defaultCategories,
  filterEmojisByCategories,
  filterCategories,
  emojiCategories,
  emojiStyles,
  FluentEmojiPlugin,
  useEmojiConfig,
  config,
  updateConfig
}

// 导出类型
export type {
  EmojiItem,
  EmojiItemWithStyle,
  EmojiCategory,
  StyleOption
}

// 默认导出主组件
export default FluentEmojiPicker
