import type { App, InjectionKey } from 'vue'
import { inject } from 'vue'
import FluentEmojiPicker from '../components/FluentEmojiPicker.vue'
import { config, updateConfig } from '../config'

export interface FluentEmojiPluginOptions {
  baseUrl?: string
}

const configKey: InjectionKey<typeof config> = Symbol('fluent-emoji-config')
const updateConfigKey: InjectionKey<typeof updateConfig> = Symbol('fluent-emoji-update-config')

export const FluentEmojiPlugin = {
  install(app: App, options: FluentEmojiPluginOptions = {}) {
    if (options.baseUrl) {
      updateConfig('cdn', { baseUrl: options.baseUrl })
    }

    app.provide(configKey, config)
    app.provide(updateConfigKey, updateConfig)
    app.component('FluentEmojiPicker', FluentEmojiPicker)
  }
}

export function useEmojiConfig() {
  return {
    config: inject(configKey, config),
    updateConfig: inject(updateConfigKey, updateConfig)
  }
}
