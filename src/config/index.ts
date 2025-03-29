import { reactive, readonly } from 'vue'

// 全局配置状态
const configState = reactive({
  // CDN 配置
  cdn: {
    baseUrl: 'https://cdn.jsdelivr.net/npm/fluentui-emoji@1.1.1'
  },
  // 组件默认配置
  defaults: {
    initialStyle: 'modern',
    columns: 6,
    width: 320,
    emojiSize: 28
  },
  // 添加EmojiPickerExample组件所需的配置
  displayCategories: ['smileys', 'people', 'animals', 'food', 'activities', 'travel', 'places', 'objects', 'symbols', 'flags'],
  maxPerCategory: 100
})

// 更新配置的方法
export function updateConfig(key: keyof typeof configState, value: any) {
  if (key in configState) {
    Object.assign(configState[key], value)
  }
}

// 导出只读配置，防止意外修改
export const config = readonly(configState)
