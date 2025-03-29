import { App, inject } from 'vue'
import FluentEmojiPicker from '../components/FluentEmojiPicker.vue'
import EmojiPicker from '../components/EmojiPicker.vue'
import Popover from '../components/Popover.vue'
import CdnSelector from '../examples/components/CdnSelector.vue'
import { config, updateConfig } from '../config'

// 定义注入键
const CONFIG_INJECTION_KEY = Symbol('emoji-config')
const UPDATE_CONFIG_INJECTION_KEY = Symbol('update-emoji-config')

// 插件选项
export interface FluentEmojiPluginOptions {
  // 默认CDN地址
  baseUrl?: string
  // 注册全局组件
  globalComponents?: boolean
  // 其他配置项...
}

// Vue 插件
export const FluentEmojiPlugin = {
  install(app: App, options: FluentEmojiPluginOptions = {}) {
    // 注册全局配置
    app.config.globalProperties.$emojiConfig = config
    app.config.globalProperties.$updateEmojiConfig = updateConfig
    
    // 基于选项更新默认配置
    if (options.baseUrl) {
      updateConfig('cdn', { baseUrl: options.baseUrl })
    }
    
    // 提供全局注入
    app.provide(CONFIG_INJECTION_KEY, config)
    app.provide(UPDATE_CONFIG_INJECTION_KEY, updateConfig)
    
    // 注册全局组件
    if (options.globalComponents !== false) {
      app.component('FluentEmojiPicker', FluentEmojiPicker)
      app.component('EmojiPicker', EmojiPicker)
      app.component('Popover', Popover)
      app.component('CdnSelector', CdnSelector)
    }
  }
}

// 组合式API辅助函数 - 增强错误处理
export function useEmojiConfig() {
  const injectedConfig = inject(CONFIG_INJECTION_KEY, config)
  const injectedUpdateConfig = inject(UPDATE_CONFIG_INJECTION_KEY, updateConfig)
  
  return {
    config: injectedConfig,
    updateConfig: injectedUpdateConfig
  }
}
