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
  getEmojiPreset,
  getEmojiStyles,
  getStyleName,
  type EmojiLocale,
  type EmojiPresetKey,
  type EmojiItem,
  type EmojiItemWithStyle
} from '@igeekfan/fluent-emoji-ms-core'
import { computed, onMounted, ref, watch } from 'vue'
import { config } from '../config'
import EmojiPicker from './EmojiPicker.vue'
import Popover from './Popover.vue'

type SearchMode = 'toggle' | 'inline' | 'hidden'
type CategoryTabKind = 'recent' | 'common' | 'category'

interface CategoryTab {
  value: string
  name: string
  icon?: string
  kind: CategoryTabKind
}

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
  searchMode?: SearchMode
  showStyleSelect?: boolean
  showCategoryTabs?: boolean
  showCommonCategory?: boolean
  commonEmojiNames?: string[]
  recentEmojiNames?: string[]
  recentLimit?: number
  persistRecent?: boolean
  storageKey?: string
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
  searchMode: 'toggle',
  showStyleSelect: true,
  showCategoryTabs: true,
  showCommonCategory: true,
  commonEmojiNames: undefined,
  recentEmojiNames: undefined,
  recentLimit: 12,
  persistRecent: true,
  storageKey: 'fluent-emoji-ms:recent',
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
const isSearchOpen = ref(false)
const isOptionsOpen = ref(false)
const storedRecentEmojiNames = ref<string[]>([])
const renderLimit = ref(props.renderBatchSize)
const localizedMessages = computed(() => getEmojiMessages(props.locale))
const localizedStyles = computed(() => getEmojiStyles(props.locale))
const resolvedButtonText = computed(() => props.buttonText || localizedMessages.value.ui.pickerButton)
const commonPreset = computed(() => getEmojiPreset('common', props.locale))
const commonEmojiNames = computed(() => props.commonEmojiNames?.length
  ? props.commonEmojiNames
  : commonPreset.value.emojiNames)
const recentEmojiNames = computed(() => {
  const sourceNames = props.recentEmojiNames?.length ? props.recentEmojiNames : storedRecentEmojiNames.value
  return sourceNames.filter(Boolean).slice(0, props.recentLimit)
})
const recentTabName = computed(() => props.locale === 'en-US' ? 'Recent' : '最近')
const searchButtonLabel = computed(() => props.locale === 'en-US' ? 'Search' : '搜索')
const optionsButtonLabel = computed(() => props.locale === 'en-US' ? 'Options' : '更多')
const activeTab = ref<string>(recentEmojiNames.value.length ? 'recent' : 'common')

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
const categoryTabs = computed<CategoryTab[]>(() => {
  const tabs: CategoryTab[] = []

  if (recentEmojiNames.value.length) {
    tabs.push({
      value: 'recent',
      name: recentTabName.value,
      icon: '🕘',
      kind: 'recent'
    })
  }

  if (props.showCommonCategory && commonEmojiNames.value.length) {
    tabs.push({
      value: 'common',
      name: commonPreset.value.label,
      icon: '⭐',
      kind: 'common'
    })
  }

  if (props.showCategoryTabs) {
    tabs.push(
      ...availableCategories.value
        .filter((category) => category.value !== 'all')
        .map((category) => ({
          value: category.value,
          name: category.name,
          icon: category.icon,
          kind: 'category' as const
        }))
    )
  }

  return tabs
})
const activeCategoryTab = computed(() => categoryTabs.value.find((tab) => tab.value === activeTab.value))
const shouldShowInlineSearch = computed(() =>
  props.showSearch && (props.searchMode === 'inline' || (props.searchMode === 'toggle' && isSearchOpen.value))
)
const shouldShowSearchToggle = computed(() => props.showSearch && props.searchMode === 'toggle')
const pickerEmojiNames = computed(() => {
  if (!activeCategoryTab.value) {
    return props.emojiNames
  }

  if (activeCategoryTab.value?.kind === 'recent') {
    return recentEmojiNames.value
  }

  if (activeCategoryTab.value?.kind === 'common') {
    return commonEmojiNames.value
  }

  return props.emojiNames
})
const pickerPreset = computed(() => {
  if (!activeCategoryTab.value) {
    return props.preset
  }

  return activeCategoryTab.value.kind === 'category' ? props.preset : undefined
})
const pickerCategories = computed(() => {
  if (!activeCategoryTab.value) {
    return effectiveCategories.value
  }

  return activeCategoryTab.value.kind === 'category' ? effectiveCategories.value : ['all']
})
const pickerSelectedCategory = computed(() => {
  if (!activeCategoryTab.value) {
    return selectedEmojiCategory.value
  }

  return activeCategoryTab.value.kind === 'category' ? activeTab.value : 'all'
})

onMounted(() => {
  if (!props.persistRecent || props.recentEmojiNames?.length || typeof window === 'undefined') {
    return
  }

  try {
    const storedValue = window.localStorage.getItem(props.storageKey)
    const parsedValue = storedValue ? JSON.parse(storedValue) : []
    if (Array.isArray(parsedValue)) {
      storedRecentEmojiNames.value = parsedValue.filter((item): item is string => typeof item === 'string')
      if (storedRecentEmojiNames.value.length) {
        activeTab.value = 'recent'
      }
    }
  } catch {
    storedRecentEmojiNames.value = []
  }
})

watch(() => props.initialStyle, (value) => {
  selectedStyle.value = value
  stateStore.setStyle(value)
})

watch(() => props.defaultCategory, (value) => {
  selectedEmojiCategory.value = value
  activeTab.value = value
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
  if (!value) {
    isSearchOpen.value = false
  }
})

watch(() => props.searchMode, (value) => {
  if (value === 'hidden' && searchQuery.value) {
    searchQuery.value = ''
    stateStore.setSearchQuery('')
  }
  if (value !== 'toggle') {
    isSearchOpen.value = false
  }
})

watch(
  [() => props.preset, () => (props.emojiNames ?? []).join('|'), () => effectiveCategories.value.join('|')],
  () => {
    selectedEmojiCategory.value = props.defaultCategory
    activeTab.value = props.defaultCategory
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

watch(categoryTabs, (tabs) => {
  if (!tabs.length) {
    return
  }

  const hasActiveTab = tabs.some((tab) => tab.value === activeTab.value)
  if (!hasActiveTab) {
    activeTab.value = tabs[0].value
  }
}, { immediate: true })

watch(activeTab, (value) => {
  selectedEmojiCategory.value = value
  renderLimit.value = props.renderBatchSize
  stateStore.resetRenderLimit(props.renderBatchSize)
  stateStore.setCategory(value)
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
  isOptionsOpen.value = false
  stateStore.setOpen(false)
}

function selectEmoji(emoji: EmojiItem) {
  selectedEmoji.value = emoji
  rememberRecentEmoji(emoji.name)
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

function toggleSearch() {
  isSearchOpen.value = !isSearchOpen.value
  if (!isSearchOpen.value && searchQuery.value) {
    searchQuery.value = ''
  }
}

function toggleOptions() {
  isOptionsOpen.value = !isOptionsOpen.value
}

function rememberRecentEmoji(name: string) {
  if (!props.persistRecent || props.recentEmojiNames?.length) {
    return
  }

  storedRecentEmojiNames.value = [
    name,
    ...storedRecentEmojiNames.value.filter((item) => item !== name)
  ].slice(0, props.recentLimit)
  activeTab.value = 'recent'

  if (typeof window === 'undefined') {
    return
  }

  try {
    window.localStorage.setItem(props.storageKey, JSON.stringify(storedRecentEmojiNames.value))
  } catch {
    // Ignore storage failures so private browsing or quota limits do not block selection.
  }
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
      <div class="quick-toolbar">
        <div v-if="categoryTabs.length" class="category-tabs" role="tablist">
          <button
            v-for="tab in categoryTabs"
            :key="tab.value"
            type="button"
            class="category-tab"
            :class="{ active: activeTab === tab.value }"
            :title="tab.name"
            role="tab"
            :aria-selected="activeTab === tab.value"
            @click="activeTab = tab.value"
          >
            <span class="category-tab__icon">{{ tab.icon }}</span>
            <span v-if="activeTab === tab.value" class="category-tab__label">{{ tab.name }}</span>
          </button>
        </div>

        <div class="toolbar-actions">
          <button
            v-if="shouldShowSearchToggle"
            type="button"
            class="icon-button"
            :class="{ active: isSearchOpen }"
            :title="searchButtonLabel"
            :aria-label="searchButtonLabel"
            @click="toggleSearch"
          >
            ⌕
          </button>
          <button
            v-if="showStyleSelect"
            type="button"
            class="icon-button"
            :class="{ active: isOptionsOpen }"
            :title="optionsButtonLabel"
            :aria-label="optionsButtonLabel"
            @click="toggleOptions"
          >
            ⋯
          </button>
        </div>
      </div>

      <input
        v-if="shouldShowInlineSearch"
        v-model="searchQuery"
        type="search"
        class="search-input"
        :placeholder="localizedMessages.ui.searchPlaceholder"
      />

      <div v-if="showStyleSelect && isOptionsOpen" class="options-panel">
        <span class="options-label">{{ localizedMessages.ui.style }}</span>
        <select v-model="selectedStyle" class="style-select">
          <option v-for="style in localizedStyles" :key="style.value" :value="style.value">
            {{ style.name }}
          </option>
        </select>
      </div>

      <EmojiPicker
        :categories="pickerCategories"
        :preset="pickerPreset"
        :emoji-names="pickerEmojiNames"
        :selected-category="pickerSelectedCategory"
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
  gap: 10px;
}

.quick-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  min-width: 0;
}

.category-tabs {
  display: flex;
  flex: 1;
  align-items: center;
  gap: 2px;
  min-width: 0;
  padding: 3px;
  overflow-x: auto;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #f5f6f8;
  scrollbar-width: none;
}

.category-tabs::-webkit-scrollbar {
  display: none;
}

.category-tab,
.icon-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 30px;
  flex: 0 0 auto;
  border: 0;
  border-radius: 7px;
  background: transparent;
  color: #475569;
  cursor: pointer;
  transition: background-color 140ms ease, color 140ms ease, box-shadow 140ms ease;
}

.category-tab {
  width: 30px;
  gap: 5px;
  padding: 0;
}

.category-tab:hover,
.icon-button:hover {
  background: rgba(15, 23, 42, 0.06);
  color: #0f172a;
}

.category-tab.active,
.icon-button.active {
  background: #fff;
  color: #111827;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.12);
}

.category-tab.active {
  width: auto;
  max-width: 92px;
  padding: 0 9px 0 7px;
}

.category-tab__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  flex: 0 0 auto;
  opacity: 0.68;
  filter: grayscale(0.35);
  line-height: 1;
  font-size: 15px;
}

.category-tab.active .category-tab__icon,
.category-tab:hover .category-tab__icon {
  opacity: 1;
  filter: none;
}

.category-tab__label {
  overflow: hidden;
  color: #1f2937;
  font-size: 12px;
  font-weight: 500;
  line-height: 1;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.toolbar-actions {
  display: inline-flex;
  gap: 3px;
  flex: 0 0 auto;
  padding: 3px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #fff;
}

.icon-button {
  width: 30px;
  color: #475569;
  font-size: 17px;
}

.search-input,
.style-select {
  min-width: 0;
  padding: 8px 10px;
  border: 1px solid #d0d7de;
  border-radius: 8px;
  font-size: 13px;
}

.options-panel {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: center;
  gap: 8px;
  padding: 8px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  background: #f8fafc;
}

.options-label {
  color: #64748b;
  font-size: 12px;
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
  .quick-toolbar {
    gap: 6px;
  }
}
</style>
