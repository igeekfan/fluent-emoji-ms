import { ref } from 'vue'
import { useEmojiConfig } from '../plugin'
import type { EmojiItemWithStyle } from '../types/emoji'

export function useEmojiSelector() {
  // 获取全局配置
  const { config, updateConfig } = useEmojiConfig()
  // 选中的表情
  const selectedEmoji = ref<EmojiItemWithStyle | null>(null)
  
  // 处理表情选择
  const handleSelectEmoji = (emoji: EmojiItemWithStyle) => {
    selectedEmoji.value = emoji
    return emoji
  }
  
  // 清除选择
  const clearSelectedEmoji = () => {
    selectedEmoji.value = null
  }
  
  // 更新CDN配置
  const updateCdnUrl = (newUrl: string) => {
    updateConfig('cdn', { baseUrl: newUrl })
  }
  
  // 获取表情图片URL
  const getEmojiImageUrl = (emoji: EmojiItemWithStyle | null) => {
    if (!emoji) return ''
    return `${config.cdn.baseUrl}/icons/${emoji.style}/${emoji.path}`
  }
  
  return {
    config,
    selectedEmoji,
    handleSelectEmoji,
    clearSelectedEmoji,
    updateCdnUrl,
    getEmojiImageUrl
  }
}
