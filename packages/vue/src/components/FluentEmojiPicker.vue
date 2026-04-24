<script setup lang="ts">
import {
  DEFAULT_BASE_URL,
  DEFAULT_RENDER_BATCH_SIZE,
  buildEmojiImageUrl,
  createEmojiPickerState,
  defaultCategories,
  defaultEmojiLocale,
  filterCategories,
  getEmojiMessages,
  getEmojiStyles,
  getStyleName,
  type EmojiLocale,
  type EmojiPresetKey,
  type EmojiItem,
  type EmojiItemWithStyle
} from '@igeekfan/fluent-emoji-ms-core'
import { computed, ref, watch } from 'vue'
import { config } from '../config'
import EmojiPicker from './EmojiPicker.vue'
import Popover from './Popover.vue'

const props = withDefaults(defineProps<{
  disabled?: boolean
  initialStyle?: string
  defaultCategory?: string
  buttonText?: string
  baseUrl?: string
  locale?: EmojiLocale
  width?: number | string
  categories?: string[]
  preset?: EmojiPresetKey
  emojiNames?: string[]
  showSearch?: boolean
  closeOnSelect?: boolean
  showSelectedEmoji?: boolean
  emojiSize?: number
  columns?: number
  autoFill?: boolean
  renderBatchSize?: number
}>(), {
  disabled: false,
  initialStyle: 'modern',
  defaultCategory: 'all',
  baseUrl: '',
  locale: defaultEmojiLocale,
  width: 320,
  showSearch: true,
  closeOnSelect: true,
  showSelectedEmoji: false,
  emojiSize: 28,
  columns: 6,
  autoFill: true,
  renderBatchSize: DEFAULT_RENDER_BATCH_SIZE
})

const emit = defineEmits<{
  select: [emoji: EmojiItemWithStyle]
  clear: []
}>()

const hostRef = ref<HTMLElement | null>(null)
const triggerRef = ref<HTMLElement | null>(null)
const searchQuery = ref('')
const selectedStyle = ref(props.initialStyle)
const selectedEmojiCategory = ref(props.defaultCategory)
const selectedEmoji = ref<EmojiItem | null>(null)
const isOpen = ref(false)
const renderLimit = ref(props.renderBatchSize)
const localizedMessages = computed(() => getEmojiMessages(props.locale))
const localizedStyles = computed(() => getEmojiStyles(props.locale))
const resolvedButtonText = computed(() => props.buttonText || localizedMessages.value.ui.pickerButton)

const effectiveCategories = computed(() => {
  if (props.categories?.length) {
    return props.categories
  }

  if (props.preset || props.emojiNames?.length) {
    return ['all']
  }

  return defaultCategories
})

const stateStore = createEmojiPickerState({
  baseUrl: props.baseUrl || config.cdn.baseUrl || DEFAULT_BASE_URL,
  selectedStyle: props.initialStyle,
  selectedEmojiCategory: props.defaultCategory,
  renderLimit: props.renderBatchSize
})

const resolvedBaseUrl = computed(() => props.baseUrl || config.cdn.baseUrl || DEFAULT_BASE_URL)
const availableCategories = computed(() => filterCategories({
  categories: effectiveCategories.value,
  preset: props.preset,
  emojiNames: props.emojiNames
}, props.locale))
const showCategorySelect = computed(() => availableCategories.value.length > 2)

watch(() => props.initialStyle, (value) => {
  selectedStyle.value = value
  stateStore.setStyle(value)
})

watch(() => props.defaultCategory, (value) => {
  selectedEmojiCategory.value = value
  renderLimit.value = props.renderBatchSize
  stateStore.resetRenderLimit(props.renderBatchSize)
  stateStore.setCategory(value)
})

watch(() => props.renderBatchSize, (value) => {
  renderLimit.value = value
  stateStore.resetRenderLimit(value)
})

watch(() => props.showSearch, (value) => {
  if (!value && searchQuery.value) {
    searchQuery.value = ''
    stateStore.setSearchQuery('')
  }
})

watch(
  [() => props.preset, () => (props.emojiNames ?? []).join('|'), () => effectiveCategories.value.join('|')],
  () => {
    selectedEmojiCategory.value = props.defaultCategory
    renderLimit.value = props.renderBatchSize
    stateStore.resetRenderLimit(props.renderBatchSize)
    stateStore.setCategory(props.defaultCategory)
  }
)

watch(resolvedBaseUrl, (value) => {
  stateStore.setBaseUrl(value)
}, { immediate: true })

watch([searchQuery, selectedEmojiCategory], () => {
  renderLimit.value = props.renderBatchSize
  stateStore.resetRenderLimit(props.renderBatchSize)
  stateStore.setCategory(selectedEmojiCategory.value)
  stateStore.setSearchQuery(searchQuery.value)
})

watch(selectedStyle, (value) => {
  stateStore.setStyle(value)
})

function toggleOpen() {
  if (props.disabled) {
    return
  }

  isOpen.value = !isOpen.value
  stateStore.setOpen(isOpen.value)
}

function closePanel() {
  isOpen.value = false
  stateStore.setOpen(false)
}

function selectEmoji(emoji: EmojiItem) {
  selectedEmoji.value = emoji
  const emojiWithStyle: EmojiItemWithStyle = {
    ...emoji,
    style: selectedStyle.value
  }

  stateStore.selectEmoji(emojiWithStyle)
  emit('select', emojiWithStyle)

  if (props.closeOnSelect) {
    closePanel()
  }
}

function clearSelection() {
  selectedEmoji.value = null
  stateStore.clearSelection()
  emit('clear')
}

function loadMore() {
  renderLimit.value += props.renderBatchSize
  stateStore.loadMore(props.renderBatchSize)
}

</script>

<template>
  <div ref="hostRef" class="picker-host">
    <div ref="triggerRef" class="trigger-slot">
      <slot
        name="trigger"
        :toggle-open="toggleOpen"
        :is-open="isOpen"
        :selected-emoji="selectedEmoji"
        :disabled="disabled"
      >
        <button type="button" class="trigger-button" :disabled="disabled" @click="toggleOpen">
          <span>{{ resolvedButtonText }}</span>
          <span v-if="selectedEmoji" class="trigger-emoji">
            <img
              :src="buildEmojiImageUrl(resolvedBaseUrl, selectedStyle, selectedEmoji.path)"
              :alt="selectedEmoji.name"
              width="20"
              height="20"
            />
          </span>
        </button>
      </slot>
    </div>

    <Popover :show="isOpen" :trigger-element="triggerRef" :width="width" @close="closePanel">
      <div class="panel">
      <div class="toolbar">
        <input
          v-if="showSearch"
          v-model="searchQuery"
          type="search"
          class="search-input"
          :placeholder="localizedMessages.ui.searchPlaceholder"
        />
        <select v-model="selectedStyle" class="style-select">
          <option v-for="style in localizedStyles" :key="style.value" :value="style.value">
            {{ style.name }}
          </option>
        </select>
        <select v-if="showCategorySelect" v-model="selectedEmojiCategory" class="category-select">
          <option v-for="category in availableCategories" :key="category.value" :value="category.value">
            {{ category.name }}
          </option>
        </select>
      </div>

      <EmojiPicker
        :categories="effectiveCategories"
        :preset="preset"
        :emoji-names="emojiNames"
        :selected-category="selectedEmojiCategory"
        :search-query="searchQuery"
        :base-url="resolvedBaseUrl"
        :selected-style="selectedStyle"
        :locale="locale"
        :emoji-size="emojiSize"
        :columns="columns"
        :auto-fill="autoFill"
        :render-limit="renderLimit"
        :render-batch-size="renderBatchSize"
        @select="selectEmoji"
        @load-more="loadMore"
      />
      </div>
    </Popover>

    <div v-if="showSelectedEmoji && selectedEmoji" class="selected-summary">
      <img
        :src="buildEmojiImageUrl(resolvedBaseUrl, selectedStyle, selectedEmoji.path)"
        :alt="selectedEmoji.name"
        width="32"
        height="32"
      />
      <div class="summary-text">
        <div>{{ selectedEmoji.name }}</div>
        <div class="summary-style">{{ localizedMessages.ui.style }}: {{ getStyleName(selectedStyle, locale) }}</div>
      </div>
      <button type="button" class="clear-button" @click="clearSelection">
        {{ localizedMessages.ui.clear }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.picker-host {
  position: relative;
  display: inline-grid;
  max-width: 100%;
  justify-items: start;
}

.trigger-slot {
  display: inline-grid;
  width: auto;
  max-width: 100%;
}

.trigger-button,
.category-chip,
.clear-button {
  border: 1px solid #d0d7de;
  background: #fff;
  cursor: pointer;
}

.trigger-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 10px;
  width: auto;
  max-width: 100%;
  justify-content: center;
  min-height: 44px;
}

.trigger-emoji img {
  display: block;
}

.panel {
  display: grid;
  gap: 8px;
}

.toolbar {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 8px;
}

.search-input,
.style-select,
.category-select {
  min-width: 0;
  padding: 8px 10px;
  border: 1px solid #d0d7de;
  border-radius: 8px;
  font-size: 13px;
}

.grid-container {
  max-height: 320px;
  overflow: auto;
}

.empty-state {
  padding: 20px 0;
  color: #64748b;
  text-align: center;
}

.selected-summary {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
  padding: 10px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
}

.summary-style {
  color: #64748b;
  font-size: 12px;
}

.clear-button {
  padding: 7px 10px;
  border-radius: 8px;
  font-size: 13px;
}

@media (max-width: 640px) {
  .toolbar {
    grid-template-columns: 1fr;
  }
}
</style>
