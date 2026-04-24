import EmojiPicker from './components/EmojiPicker.vue'
import FluentEmojiPicker from './components/FluentEmojiPicker.vue'
import { config, updateConfig } from './config'
import { FluentEmojiPlugin, useEmojiConfig } from './plugin'

export * from '@fluent-emoji-ms/core'
export { EmojiPicker, FluentEmojiPicker, FluentEmojiPlugin, useEmojiConfig, config, updateConfig }

export default FluentEmojiPicker