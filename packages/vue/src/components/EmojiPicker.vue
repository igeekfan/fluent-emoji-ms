<script setup lang="ts">
import {
  DEFAULT_BASE_URL,
  DEFAULT_RENDER_BATCH_SIZE,
  defaultEmojiLocale,
  getEmojiMessages,
  queryEmojis,
  type EmojiLocale,
  type EmojiPresetKey,
  type EmojiItem
} from '@fluent-emoji-ms/core'
import { computed } from 'vue'
import EmojiGrid from './EmojiGrid.vue'

const props = withDefaults(defineProps<{
  baseUrl?: string
  width?: number | string
  selectedStyle?: string
  locale?: EmojiLocale
  categories?: string[]
  preset?: EmojiPresetKey
  emojiNames?: string[]
  selectedCategory?: string
  searchQuery?: string
  emojiSize?: number
  columns?: number
  autoFill?: boolean
  renderLimit?: number
  renderBatchSize?: number
}>(), {
  baseUrl: DEFAULT_BASE_URL,
  width: undefined,
  selectedStyle: 'modern',
  locale: defaultEmojiLocale,
  categories: () => ['all'],
  preset: undefined,
  emojiNames: undefined,
  selectedCategory: 'all',
  searchQuery: '',
  emojiSize: 28,
  columns: 6,
  autoFill: true,
  renderLimit: DEFAULT_RENDER_BATCH_SIZE,
  renderBatchSize: DEFAULT_RENDER_BATCH_SIZE
})

const emit = defineEmits<{
  select: [emoji: EmojiItem]
  loadMore: []
}>()

const messages = computed(() => getEmojiMessages(props.locale))
const panelStyle = computed(() => {
  if (props.width == null || props.width === '') {
    return undefined
  }

  return {
    width: '100%',
    maxWidth: typeof props.width === 'number' ? `${props.width}px` : props.width,
    margin: '0 auto'
  }
})

const emojiResult = computed(() => queryEmojis({
  categories: props.categories,
  preset: props.preset,
  emojiNames: props.emojiNames,
  selectedCategory: props.selectedCategory,
  search: props.searchQuery,
  limit: props.renderLimit
}))
</script>

<template>
  <div class="emoji-picker-panel" :style="panelStyle">
    <div class="grid-container">
      <EmojiGrid
        :items="emojiResult.items"
        :width="width"
        :base-url="baseUrl"
        :style-value="selectedStyle"
        :emoji-size="emojiSize"
        :columns="columns"
        :auto-fill="autoFill"
        @select="emit('select', $event)"
      />

      <div v-if="emojiResult.items.length === 0" class="empty-state">
        {{ messages.ui.noResults }}
      </div>
    </div>

    <button
      v-if="emojiResult.hasMore"
      type="button"
      class="load-more"
      @click="emit('loadMore')"
    >
      {{ messages.ui.loadMore }}
    </button>
  </div>
</template>

<style scoped>
.emoji-picker-panel {
  display: grid;
  gap: 8px;
}

.grid-container {
  max-height: 252px;
  overflow: auto;
}

.empty-state {
  padding: 20px 0;
  color: #64748b;
  text-align: center;
}

.load-more {
  width: 100%;
  margin-top: 2px;
  padding: 8px 10px;
  border: 1px solid #d0d7de;
  border-radius: 8px;
  background: #fff;
  cursor: pointer;
  font-size: 13px;
}
</style>