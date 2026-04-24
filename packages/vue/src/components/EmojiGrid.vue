<script setup lang="ts">
import { buildEmojiImageUrl, type EmojiItem } from '@igeekfan/fluent-emoji-ms-core'
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  items: EmojiItem[]
  width?: number | string
  baseUrl: string
  styleValue: string
  emojiSize: number
  columns?: number
  autoFill?: boolean
}>(), {
  columns: 6,
  autoFill: true
})

const emit = defineEmits<{
  select: [emoji: EmojiItem]
}>()

const cellSize = computed(() => Math.max(props.emojiSize + 4, 32))
const gridStyle = computed(() => {
  if (props.autoFill) {
    return {
      gridTemplateColumns: `repeat(auto-fill, minmax(${cellSize.value}px, 1fr))`
    }
  }

  return {
    gridTemplateColumns: `repeat(${props.columns}, ${cellSize.value}px)`,
    justifyContent: 'center'
  }
})

const cellStyle = computed(() => ({
  minHeight: `${cellSize.value}px`
}))
</script>

<template>
  <div class="emoji-grid" :style="gridStyle">
    <button
      v-for="item in items"
      :key="item.name"
      type="button"
      class="emoji-cell"
      :title="item.name"
      :style="cellStyle"
      @click="emit('select', item)"
    >
      <img
        :src="buildEmojiImageUrl(baseUrl, styleValue, item.path)"
        :alt="item.name"
        class="emoji-image"
        :style="{ width: `${emojiSize}px`, height: `${emojiSize}px` }"
        loading="lazy"
      />
    </button>
  </div>
</template>

<style scoped>
.emoji-grid {
  display: grid;
  gap: 2px;
}

.emoji-cell {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 32px;
  min-width: 0;
  aspect-ratio: 1;
  border: 0;
  border-radius: 8px;
  background: transparent;
  cursor: pointer;
}

.emoji-cell:hover {
  background: rgba(15, 23, 42, 0.06);
}

.emoji-image {
  display: block;
}
</style>
