import { DEFAULT_BASE_URL, DEFAULT_RENDER_BATCH_SIZE } from '@fluent-emoji-ms/core'
import { reactive, readonly } from 'vue'

const configState = reactive({
  cdn: {
    baseUrl: DEFAULT_BASE_URL
  },
  defaults: {
    initialStyle: 'modern',
    width: 320,
    emojiSize: 28,
    renderBatchSize: DEFAULT_RENDER_BATCH_SIZE
  }
})

export function updateConfig(key: keyof typeof configState, value: Record<string, unknown>) {
  if (key in configState) {
    Object.assign(configState[key], value)
  }
}

export const config = readonly(configState)
