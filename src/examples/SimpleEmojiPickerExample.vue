<script setup lang="ts">
import { ref } from 'vue'
import FluentEmojiPicker from '../components/FluentEmojiPicker.vue'
import { useEmojiConfig } from '../plugin'
import type { EmojiItemWithStyle } from '../types/emoji'

// 获取全局配置
const { config } = useEmojiConfig()

// 选中的表情
const selectedEmoji = ref<EmojiItemWithStyle | null>(null)

// 处理表情选择
const handleEmojiSelect = (emoji: EmojiItemWithStyle) => {
  selectedEmoji.value = emoji
  console.log('选中表情:', emoji)
}

// 示例代码 - 使用转义字符来避免与Vue模板语法冲突
const basicUsageCode = `<template>
  <FluentEmojiPicker 
    @select="handleEmojiSelect"
    :baseUrl="cdnBaseUrl"
    :width="320"
  />
  <div class="result-emoji">
    <img
      :src="\`\${cdnBaseUrl}/icons/\${selectedEmoji.style}/\${selectedEmoji.path}\`"
      :alt="selectedEmoji.name"
      width="64"
      height="64" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { FluentEmojiPicker } from 'fluent-emoji-ms'
import 'fluent-emoji-ms/style.css'
import type { EmojiItemWithStyle } from 'fluent-emoji-ms'

// 设置CDN基础URL
const cdnBaseUrl = 'https://cdn.jsdelivr.net/npm/fluentui-emoji@1.1.1'

// 选中的表情
const selectedEmoji = ref<EmojiItemWithStyle | null>(null)

// 处理表情选择
const handleEmojiSelect = (emoji: EmojiItemWithStyle) => {
  selectedEmoji.value = emoji
  console.log('选中表情:', emoji)
}
<\/script>`;

// 当前显示的代码示例
const currentTab = ref('basic')
</script>

<template>
  <div class="simple-example">
    <div class="example-card">
      <div class="picker-container">
        <FluentEmojiPicker @select="handleEmojiSelect"
          :baseUrl="config.cdn.baseUrl"
          :width="320" />
      </div>
    </div>

    <div class="example-card"
      v-if="selectedEmoji">
      <h3>选择结果</h3>
      <div class="result-container">
        <div class="result-emoji">
          <img
            :src="`${config.cdn.baseUrl}/icons/${selectedEmoji.style}/${selectedEmoji.path}`"
            :alt="selectedEmoji.name"
            width="64"
            height="64" />
        </div>
        <div class="result-details">
          <div class="result-item">
            <span class="label">名称:</span>
            <span class="value">{{ selectedEmoji.name }}</span>
          </div>
          <div class="result-item">
            <span class="label">分类:</span>
            <span class="value">{{ selectedEmoji.category }}</span>
          </div>
          <div class="result-item">
            <span class="label">风格:</span>
            <span class="value">{{ selectedEmoji.style }}</span>
          </div>
          <div class="result-item">
            <span class="label">路径:</span>
            <span class="value path">{{ selectedEmoji.path }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 添加代码示例部分 -->
    <div class="example-card">
      <h3>使用示例</h3>
      <div class="code-block">
        <pre><code>{{ currentTab === 'basic' ? basicUsageCode : configurationCode }}</code></pre>
        <button class="copy-code-btn"
          @click="navigator.clipboard.writeText(currentTab === 'basic' ? basicUsageCode : configurationCode)">
          复制代码
        </button>
      </div>
    </div>

  </div>
</template>

<style scoped>
.simple-example {
  max-width: 800px;
  margin: 0 auto;
  display: grid;
  gap: 24px;
}

.example-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
}

.example-card h3 {
  margin-top: 0;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #eee;
  font-size: 18px;
  color: #333;
}

.picker-container {
  padding: 16px;
  background-color: #f9fafb;
  border-radius: 8px;
}

.result-container {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.result-emoji {
  background-color: #f9fafb;
  padding: 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.result-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.result-item {
  display: flex;
  gap: 10px;
}

.label {
  font-weight: 600;
  color: #374151;
  min-width: 60px;
}

.value {
  color: #6b7280;
}

.value.path {
  font-family: monospace;
  font-size: 14px;
  word-break: break-all;
}

.code-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.tab-btn {
  padding: 6px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  background-color: #f9fafb;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.tab-btn:hover {
  background-color: #e5e7eb;
}

.tab-btn.active {
  background-color: #3b82f6;
  color: white;
  border-color: #2563eb;
}

.code-block {
  position: relative;
  background-color: #1e293b;
  border-radius: 8px;
  padding: 16px;
  overflow-x: auto;
}

.code-block pre {
  margin: 0;
  padding: 0;
  font-family: Consolas, Monaco, 'Andale Mono', monospace;
  font-size: 14px;
  line-height: 1.5;
  color: #e2e8f0;
}

.copy-code-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 4px 8px;
  font-size: 12px;
  background-color: rgba(255, 255, 255, 0.1);
  color: #e2e8f0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.copy-code-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
}
</style>
