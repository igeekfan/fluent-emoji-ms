<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  FluentEmojiPicker,
  buildEmojiImageUrl,
  type EmojiItemWithStyle,
  type EmojiLocale,
  useEmojiConfig
} from '@igeekfan/fluent-emoji-ms-vue'
import CodeBlock from './components/CodeBlock.vue'

const props = withDefaults(defineProps<{ locale?: EmojiLocale }>(), {
  locale: 'zh-CN'
})

const { config } = useEmojiConfig()
const selectedEmoji = ref<EmojiItemWithStyle | null>(null)
const locale = computed(() => props.locale)

const text = computed(() => props.locale === 'en-US'
  ? {
      previewTitle: 'Default Picker Usage',
      previewCopy: 'This example shows the high-level picker with its default search, categories, and selection flow.',
      resultTitle: 'Selection Result',
      empty: 'Pick an emoji from the picker to inspect the returned data structure.',
      labels: {
        name: 'Name',
        category: 'Category',
        style: 'Style',
        path: 'Path'
      },
      codeTitle: 'Basic usage example'
    }
  : {
      previewTitle: '默认选择器用法',
      previewCopy: '这里展示高阶组件的默认体验，包括搜索、分类切换和选中反馈。',
      resultTitle: '选择结果',
      empty: '从选择器里点一个表情，查看返回的数据结构和资源路径。',
      labels: {
        name: '名称',
        category: '分类',
        style: '风格',
        path: '路径'
      },
      codeTitle: '基础使用示例'
    })

const exampleCode = computed(() => `<FluentEmojiPicker
  locale="${props.locale}"
  :base-url="${config.cdn.baseUrl}"
  :width="320"
  @select="handleEmojiSelect"
/>`)
</script>

<template>
  <div class="simple-example">
    <section class="example-card">
      <div class="section-head">
        <h3>{{ text.previewTitle }}</h3>
        <p class="section-copy">{{ text.previewCopy }}</p>
      </div>

      <div class="picker-container">
        <FluentEmojiPicker
          :locale="locale"
          :base-url="config.cdn.baseUrl"
          :width="320"
          @select="selectedEmoji = $event"
          @clear="selectedEmoji = null"
        />
      </div>
    </section>

    <section class="example-card">
      <h3>{{ text.resultTitle }}</h3>

      <div v-if="selectedEmoji" class="result-container">
        <div class="result-emoji">
          <img
            :src="buildEmojiImageUrl(config.cdn.baseUrl, selectedEmoji.style, selectedEmoji.path)"
            :alt="selectedEmoji.name"
            width="72"
            height="72"
          />
        </div>

        <div class="result-details">
          <div class="result-item"><span class="label">{{ text.labels.name }}:</span><span class="value">{{ selectedEmoji.name }}</span></div>
          <div class="result-item"><span class="label">{{ text.labels.category }}:</span><span class="value">{{ selectedEmoji.category }}</span></div>
          <div class="result-item"><span class="label">{{ text.labels.style }}:</span><span class="value">{{ selectedEmoji.style }}</span></div>
          <div class="result-item"><span class="label">{{ text.labels.path }}:</span><span class="value path">{{ selectedEmoji.path }}</span></div>
        </div>
      </div>

      <p v-else class="empty-copy">{{ text.empty }}</p>
    </section>

    <section class="example-card">
      <CodeBlock :locale="locale" language="vue" :title="text.codeTitle" :code="exampleCode" />
    </section>
  </div>
</template>

<style scoped>
.simple-example {
  max-width: 900px;
  margin: 0 auto;
  display: grid;
  gap: 24px;
}

.example-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  display: grid;
  gap: 16px;
}

.section-head {
  display: grid;
  gap: 8px;
}

.section-head h3,
.example-card h3 {
  margin: 0;
}

.section-copy,
.empty-copy {
  margin: 0;
  color: #64748b;
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
  min-width: 64px;
  font-weight: 600;
  color: #374151;
}

.value {
  color: #6b7280;
}

.value.path {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 14px;
  word-break: break-all;
}

@media (max-width: 720px) {
  .result-container {
    flex-direction: column;
  }
}
</style>
