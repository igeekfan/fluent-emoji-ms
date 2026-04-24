<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  EmojiPicker,
  buildEmojiImageUrl,
  filterCategories,
  getEmojiStyles,
  type EmojiItem,
  type EmojiLocale,
  useEmojiConfig
} from '@fluent-emoji-ms/vue'
import CodeBlock from './components/CodeBlock.vue'

const props = withDefaults(defineProps<{ locale?: EmojiLocale }>(), {
  locale: 'zh-CN'
})

const { config } = useEmojiConfig()
const selectedStyle = ref('modern')
const selectedCategory = ref('all')
const searchQuery = ref('')
const selectedEmoji = ref<EmojiItem | null>(null)
const locale = computed(() => props.locale)

const text = computed(() => props.locale === 'en-US'
  ? {
      styleLabel: 'Emoji Style',
      searchPlaceholder: 'Search emoji...',
      resultTitle: 'Selection Result',
      empty: 'Select an emoji to inspect the low-level picker result.',
      labels: {
        name: 'Name',
        category: 'Category',
        style: 'Style'
      },
      codeTitle: 'Low-level EmojiPicker example'
    }
  : {
      styleLabel: '表情风格',
      searchPlaceholder: '搜索表情...',
      resultTitle: '选择结果',
      empty: '选中一个表情，查看低阶组件返回的结果结构。',
      labels: {
        name: '名称',
        category: '分类',
        style: '风格'
      },
      codeTitle: '低阶 EmojiPicker 示例'
    })

const localizedStyles = computed(() => getEmojiStyles(props.locale))
const availableCategories = computed(() => filterCategories(['all'], props.locale))

const exampleCode = computed(() => `<EmojiPicker
  locale="${props.locale}"
  :base-url="${config.cdn.baseUrl}"
  :width="650"
  selectedStyle="${selectedStyle.value}"
  :categories="['all']"
  selectedCategory="${selectedCategory.value}"
  searchQuery="${searchQuery.value}"
  :columns="6"
  :auto-fill="true"
  @select="handleSelectEmoji"
/>`)
</script>

<template>
  <div class="example-layout">
    <div class="content-area">
      <section class="surface-card">
        <div class="toolbar-row">
          <div class="control-group">
            <span class="label">{{ text.styleLabel }}</span>
            <div class="style-buttons">
              <button
                v-for="style in localizedStyles"
                :key="style.value"
                type="button"
                class="pill-button"
                :class="{ active: selectedStyle === style.value }"
                @click="selectedStyle = style.value"
              >
                {{ style.name }}
              </button>
            </div>
          </div>

          <input
            v-model="searchQuery"
            type="text"
            class="search-input"
            :placeholder="text.searchPlaceholder"
          />
        </div>

        <div class="category-row">
          <button
            v-for="category in availableCategories"
            :key="category.value"
            type="button"
            class="category-button"
            :class="{ active: selectedCategory === category.value }"
            @click="selectedCategory = category.value"
          >
            <span v-if="category.icon">{{ category.icon }}</span>
            <span>{{ category.name }}</span>
          </button>
        </div>

        <div class="picker-container">
          <EmojiPicker
            :locale="locale"
            :base-url="config.cdn.baseUrl"
            :width="650"
            :selected-style="selectedStyle"
            :categories="['all']"
            :selected-category="selectedCategory"
            :search-query="searchQuery"
            :columns="6"
            :auto-fill="true"
            :render-limit="180"
            @select="selectedEmoji = $event"
          />
        </div>
      </section>

      <section class="surface-card">
        <h3>{{ text.resultTitle }}</h3>

        <div v-if="selectedEmoji" class="result-body">
          <div class="result-preview">
            <img
              :src="buildEmojiImageUrl(config.cdn.baseUrl, selectedStyle, selectedEmoji.path)"
              :alt="selectedEmoji.name"
              width="72"
              height="72"
            />
          </div>

          <div class="result-meta">
            <div><strong>{{ text.labels.name }}</strong><span>{{ selectedEmoji.name }}</span></div>
            <div><strong>{{ text.labels.category }}</strong><span>{{ selectedEmoji.category }}</span></div>
            <div><strong>{{ text.labels.style }}</strong><span>{{ selectedStyle }}</span></div>
          </div>
        </div>

        <p v-else class="empty-copy">{{ text.empty }}</p>
      </section>
    </div>

    <aside class="code-area">
      <CodeBlock :locale="locale" language="vue" :title="text.codeTitle" :code="exampleCode" floating />
    </aside>
  </div>
</template>

<style scoped>
.example-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(320px, 0.8fr);
  gap: 24px;
}

.content-area {
  display: grid;
  gap: 20px;
}

.surface-card {
  display: grid;
  gap: 16px;
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}

.surface-card h3 {
  margin: 0;
}

.toolbar-row {
  display: grid;
  gap: 16px;
}

.control-group {
  display: grid;
  gap: 10px;
}

.label,
.result-meta strong {
  color: #374151;
}

.style-buttons,
.category-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.pill-button,
.category-button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 9px 14px;
  border: 1px solid #e5e7eb;
  border-radius: 999px;
  background: #f9fafb;
  cursor: pointer;
}

.pill-button.active,
.category-button.active {
  background: #3b82f6;
  border-color: #2563eb;
  color: white;
}

.search-input {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid #d1d5db;
  border-radius: 10px;
}

.picker-container {
  padding: 14px;
  border-radius: 10px;
  background: #f8fafc;
}

.result-body {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 16px;
  align-items: center;
}

.result-preview {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 104px;
  height: 104px;
  border-radius: 18px;
  background: #f8fafc;
}

.result-meta,
.result-meta div {
  display: grid;
  gap: 6px;
}

.result-meta span,
.empty-copy {
  color: #6b7280;
}

@media (max-width: 960px) {
  .example-layout,
  .result-body {
    grid-template-columns: 1fr;
  }
}
</style>
