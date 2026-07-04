<script setup lang="ts">
import { buildEmojiImageUrl, type EmojiItem } from '@igeekfan/fluent-emoji-ms-core'
import { computed, shallowRef } from 'vue'

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

const loadedImageKeys = shallowRef(new Set<string>())
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

function getImageKey(item: EmojiItem) {
  return `${props.baseUrl}:${props.styleValue}:${item.path}`
}

function markImageLoaded(item: EmojiItem) {
  const nextKeys = new Set(loadedImageKeys.value)
  nextKeys.add(getImageKey(item))
  loadedImageKeys.value = nextKeys
}
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
      <span
        v-if="!loadedImageKeys.has(getImageKey(item))"
        class="emoji-placeholder"
        aria-hidden="true"
      />
      <img
        :src="buildEmojiImageUrl(baseUrl, styleValue, item.path)"
        :alt="item.name"
        class="emoji-image"
        :class="{ loaded: loadedImageKeys.has(getImageKey(item)) }"
        :style="{ width: `${emojiSize}px`, height: `${emojiSize}px` }"
        loading="lazy"
        decoding="async"
        @load="markImageLoaded(item)"
        @error="markImageLoaded(item)"
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
  position: relative;
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
  position: relative;
  display: block;
  opacity: 0;
  transform: scale(0.92);
  transition: opacity 120ms ease, transform 120ms ease;
}

.emoji-image.loaded {
  opacity: 1;
  transform: scale(1);
}

.emoji-placeholder {
  position: absolute;
  width: 68%;
  height: 68%;
  border-radius: 9px;
  background:
    linear-gradient(110deg, rgba(226, 232, 240, 0.7) 8%, rgba(248, 250, 252, 0.95) 18%, rgba(226, 232, 240, 0.7) 33%);
  background-size: 200% 100%;
  animation: emoji-placeholder-shimmer 1.1s linear infinite;
}

@keyframes emoji-placeholder-shimmer {
  to {
    background-position-x: -200%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .emoji-image,
  .emoji-placeholder {
    transition: none;
    animation: none;
  }
}
</style>
