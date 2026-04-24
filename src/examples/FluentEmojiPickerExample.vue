<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import {
  FluentEmojiPicker,
  buildEmojiImageUrl,
  defaultCategories,
  filterCategories,
  getEmojiPresets,
  getEmojiStyles,
  type EmojiItemWithStyle,
  type EmojiLocale,
  type EmojiPresetKey,
  useEmojiConfig
} from '@fluent-emoji-ms/vue'
import CodeBlock from './components/CodeBlock.vue'

type ConfigTab = 'basic' | 'layout' | 'content' | 'advanced'
type ScopeMode = 'default' | 'preset' | 'categories' | 'emojiNames'

const tabs: ConfigTab[] = ['basic', 'layout', 'content', 'advanced']
const scopeModes: ScopeMode[] = ['default', 'preset', 'categories', 'emojiNames']

const props = withDefaults(defineProps<{ locale?: EmojiLocale }>(), {
  locale: 'zh-CN'
})

const { config } = useEmojiConfig()
const locale = computed(() => props.locale)
const activeTab = ref<ConfigTab>('basic')
const scopeMode = ref<ScopeMode>('default')
const selectedPreset = ref<EmojiPresetKey>('basic')
const emojiNamesInput = ref('Thumbs Up Default\nRed Heart\nSparkles')
const useCustomBaseUrl = ref(false)
const customBaseUrl = ref(config.cdn.baseUrl)
const selectedEmoji = ref<EmojiItemWithStyle | null>(null)
const selectedEmojis = ref<EmojiItemWithStyle[]>([])

const text = computed(() => props.locale === 'en-US'
  ? {
      configTitle: 'Component Configuration',
      reset: 'Reset Defaults',
      tabs: {
        basic: 'Basic',
        layout: 'Layout',
        content: 'Collection',
        advanced: 'Advanced'
      },
      scopeModes: {
        default: 'Default Categories',
        preset: 'Preset',
        categories: 'Custom Categories',
        emojiNames: 'Explicit Emoji Names'
      },
      labels: {
        style: 'Emoji Style',
        buttonText: 'Button Label',
        disabled: 'Disable Picker',
        closeOnSelect: 'Close After Select',
        showSelectedEmoji: 'Show Selected Summary',
        width: 'Panel Width',
        columns: 'Columns',
        autoFill: 'Auto Fill Grid',
        emojiSize: 'Emoji Size',
        scopeMode: 'Collection Source',
        preset: 'Preset',
        categories: 'Visible Categories',
        defaultCategory: 'Default Category',
        selectAll: 'Select All',
        restoreDefault: 'Restore Recommended',
        selectedCategories: 'Selected Categories',
        emojiNames: 'Emoji Names',
        emojiNamesPlaceholder: 'One emoji name per line, for example:\nThumbs Up Default\nRed Heart\nSparkles',
        emojiNamesHelp: 'When emojiNames are active, one emoji name per line is supported.',
        emojiCount: 'Active emoji names',
        showSearch: 'Show Search',
        renderBatchSize: 'Render Batch',
        useCustomBaseUrl: 'Override baseUrl',
        baseUrl: 'Emoji CDN',
        localeHint: 'Locale is inherited from the page-level language switch.',
        currentScope: 'Current Scope',
        currentConfig: 'Config JSON',
        previewTitle: 'Live Preview',
        previewCopy: 'The preview below uses an emoji-pack trigger, and width only controls the popup panel.',
        selectedList: 'Selected Emoji',
        clearSelections: 'Clear Selections',
        docs: 'Configuration Notes',
        emptySelection: 'No emoji selected yet.',
        all: 'All'
      },
      docs: {
        basic: [
          'Basic tab exposes initialStyle, buttonText, disabled, closeOnSelect, and showSelectedEmoji.',
          'This demo uses buttonText as the label for the custom emoji-pack trigger.'
        ],
        layout: [
          'width, columns, autoFill, and emojiSize directly affect popup density.',
          'width now controls the popup panel instead of stretching the trigger button.'
        ],
        content: [
          'Switch between default categories, preset, custom categories, and explicit emojiNames.',
          'Use one mode at a time so the prop precedence stays obvious in the preview and code sample.'
        ],
        advanced: [
          'renderBatchSize and baseUrl are exposed here alongside the page-level locale note.',
          'Use the selected emoji list below to verify the final interaction and asset source.'
        ]
      },
      defaults: {
        buttonText: 'Emoji Pack'
      },
      codeTitle: 'Complete high-level configuration example'
    }
  : {
      configTitle: '组件配置',
      reset: '恢复默认',
      tabs: {
        basic: '基础配置',
        layout: '布局配置',
        content: '集合配置',
        advanced: '高级配置'
      },
      scopeModes: {
        default: '默认分类',
        preset: '预设集合',
        categories: '自定义分类',
        emojiNames: '显式 emojiNames'
      },
      labels: {
        style: '表情风格',
        buttonText: '按钮文本',
        disabled: '禁用选择器',
        closeOnSelect: '选择后关闭面板',
        showSelectedEmoji: '显示选中摘要',
        width: '面板宽度',
        columns: '网格列数',
        autoFill: '自动填充网格',
        emojiSize: '表情尺寸',
        scopeMode: '集合来源',
        preset: '预设',
        categories: '显示分类',
        defaultCategory: '默认分类',
        selectAll: '全选',
        restoreDefault: '恢复推荐集合',
        selectedCategories: '已选分类',
        emojiNames: 'Emoji 名称',
        emojiNamesPlaceholder: '每行一个 emoji 名称，例如：\nThumbs Up Default\nRed Heart\nSparkles',
        emojiNamesHelp: '切到 emojiNames 模式后，这里支持逐行输入明确的表情名称。',
        emojiCount: '当前生效的 emojiNames',
        showSearch: '显示搜索框',
        renderBatchSize: '批量渲染数量',
        useCustomBaseUrl: '覆盖 baseUrl',
        baseUrl: '表情 CDN',
        localeHint: 'locale 继续由页面顶部的语言切换控制。',
        currentScope: '当前集合',
        currentConfig: '配置 JSON',
        previewTitle: '实时预览',
        previewCopy: '下方预览使用“表情包”触发按钮，并且宽度只控制弹层面板，不再拉伸按钮。',
        selectedList: '已选择的表情',
        clearSelections: '清空记录',
        docs: '参数说明',
        emptySelection: '还没有选中任何表情。',
        all: '全部'
      },
      docs: {
        basic: [
          '基础配置页暴露了 initialStyle、buttonText、disabled、closeOnSelect 和 showSelectedEmoji。',
          '这个示例会把 buttonText 直接用于自定义“表情包”触发按钮的文本。'
        ],
        layout: [
          'width、columns、autoFill 和 emojiSize 会直接影响弹层密度。',
          'width 现在只控制弹层面板，不再把触发按钮一起拉宽。'
        ],
        content: [
          '可以在默认分类、preset、自定义 categories 和 emojiNames 四种模式间切换。',
          '示例一次只启用一种集合来源，便于观察参数优先级和最终效果。'
        ],
        advanced: [
          'renderBatchSize 和 baseUrl 会在这里一起暴露，方便和页面级 locale 一起验证。',
          '下方的已选列表能帮助你确认最终交互和资源地址是否正确。'
        ]
      },
      defaults: {
        buttonText: '表情包'
      },
      codeTitle: '高阶组件完整配置示例'
    })

const localizedStyles = computed(() => getEmojiStyles(props.locale))
const presetMap = computed(() => getEmojiPresets(props.locale))
const presetOptions = computed(() => Object.values(presetMap.value))
const currentPreset = computed(() => presetMap.value[selectedPreset.value])
const availableCategories = computed(() => filterCategories(['all'], props.locale).filter((category) => category.value !== 'all'))
const normalizedEmojiNames = computed(() => Array.from(new Set(
  emojiNamesInput.value
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean)
)))

function createDefaultConfig() {
  return {
    initialStyle: 'modern',
    buttonText: text.value.defaults.buttonText,
    disabled: false,
    closeOnSelect: true,
    showSelectedEmoji: false,
    width: 280,
    columns: 6,
    autoFill: true,
    emojiSize: 28,
    defaultCategory: 'all',
    categories: [...defaultCategories],
    showSearch: true,
    renderBatchSize: 120
  }
}

const configOptions = reactive(createDefaultConfig())

const resolvedBaseUrl = computed(() => {
  if (!useCustomBaseUrl.value) {
    return config.cdn.baseUrl
  }

  return customBaseUrl.value.trim() || config.cdn.baseUrl
})

const resolvedPreset = computed(() => scopeMode.value === 'preset' ? selectedPreset.value : undefined)
const resolvedEmojiNames = computed(() => scopeMode.value === 'emojiNames' && normalizedEmojiNames.value.length
  ? normalizedEmojiNames.value
  : undefined)
const resolvedCategories = computed(() => scopeMode.value === 'categories' ? configOptions.categories : undefined)

const scopedCategoryOptions = computed(() => filterCategories({
  categories: resolvedCategories.value,
  preset: resolvedPreset.value,
  emojiNames: resolvedEmojiNames.value
}, props.locale))

const selectedCategoryLabels = computed(() => {
  return availableCategories.value
    .filter((category) => configOptions.categories.includes(category.value))
    .map((category) => category.name)
})

const scopeSummary = computed(() => {
  if (scopeMode.value === 'preset') {
    return currentPreset.value.label
  }

  if (scopeMode.value === 'categories') {
    return selectedCategoryLabels.value.join(', ')
  }

  if (scopeMode.value === 'emojiNames') {
    return `${text.value.labels.emojiCount}: ${normalizedEmojiNames.value.length}`
  }

  return availableCategories.value
    .filter((category) => defaultCategories.includes(category.value))
    .map((category) => category.name)
    .join(', ')
})

watch(
  [useCustomBaseUrl, () => config.cdn.baseUrl],
  ([enabled, baseUrl]) => {
    if (!enabled) {
      customBaseUrl.value = baseUrl
    }
  },
  { immediate: true }
)

watch(() => props.locale, (_, previousLocale) => {
  const previousDefault = previousLocale === 'en-US' ? 'Emoji Pack' : '表情包'
  if (configOptions.buttonText === previousDefault) {
    configOptions.buttonText = text.value.defaults.buttonText
  }
})

watch(scopedCategoryOptions, (options) => {
  if (!options.some((option) => option.value === configOptions.defaultCategory)) {
    configOptions.defaultCategory = 'all'
  }
}, { immediate: true })

const configJson = computed(() => JSON.stringify({
  locale: props.locale,
  baseUrl: resolvedBaseUrl.value,
  initialStyle: configOptions.initialStyle,
  buttonText: configOptions.buttonText,
  disabled: configOptions.disabled,
  closeOnSelect: configOptions.closeOnSelect,
  showSelectedEmoji: configOptions.showSelectedEmoji,
  width: configOptions.width,
  columns: configOptions.columns,
  autoFill: configOptions.autoFill,
  emojiSize: configOptions.emojiSize,
  defaultCategory: configOptions.defaultCategory,
  ...(resolvedCategories.value ? { categories: resolvedCategories.value } : {}),
  ...(resolvedPreset.value ? { preset: resolvedPreset.value } : {}),
  ...(resolvedEmojiNames.value ? { emojiNames: resolvedEmojiNames.value } : {}),
  showSearch: configOptions.showSearch,
  renderBatchSize: configOptions.renderBatchSize
}, null, 2))

const exampleCode = computed(() => {
  const lines = [
    '<FluentEmojiPicker',
    `  locale="${props.locale}"`,
    `  :base-url="${JSON.stringify(resolvedBaseUrl.value)}"`,
    `  initial-style="${configOptions.initialStyle}"`,
    `  button-text="${configOptions.buttonText}"`,
    `  :disabled="${configOptions.disabled}"`,
    `  :close-on-select="${configOptions.closeOnSelect}"`,
    `  :show-selected-emoji="${configOptions.showSelectedEmoji}"`,
    `  :width="${configOptions.width}"`,
    `  :columns="${configOptions.columns}"`,
    `  :auto-fill="${configOptions.autoFill}"`,
    `  :emoji-size="${configOptions.emojiSize}"`,
    `  default-category="${configOptions.defaultCategory}"`
  ]

  if (resolvedPreset.value) {
    lines.push(`  preset="${resolvedPreset.value}"`)
  }

  if (resolvedCategories.value) {
    lines.push(`  :categories="${JSON.stringify(resolvedCategories.value)}"`)
  }

  if (resolvedEmojiNames.value) {
    lines.push(`  :emoji-names="${JSON.stringify(resolvedEmojiNames.value)}"`)
  }

  lines.push(`  :show-search="${configOptions.showSearch}"`)
  lines.push(`  :render-batch-size="${configOptions.renderBatchSize}"`)
  lines.push('  @select="handleSelectEmoji"')
  lines.push('>')
  lines.push('  <template #trigger="{ toggleOpen, disabled }">')
  lines.push('    <button type="button" class="emoji-pack-trigger" :disabled="disabled" @click="toggleOpen">')
  lines.push('      <span class="emoji-pack-trigger__icon">😀</span>')
  lines.push(`      <span>${configOptions.buttonText}</span>`)
  lines.push('    </button>')
  lines.push('  </template>')
  lines.push('</FluentEmojiPicker>')

  return lines.join('\n')
})

function resetConfig() {
  Object.assign(configOptions, createDefaultConfig())
  scopeMode.value = 'default'
  selectedPreset.value = 'basic'
  emojiNamesInput.value = 'Thumbs Up Default\nRed Heart\nSparkles'
  useCustomBaseUrl.value = false
  selectedEmoji.value = null
  selectedEmojis.value = []
}

function toggleCategory(categoryValue: string) {
  if (configOptions.categories.includes(categoryValue)) {
    if (configOptions.categories.length === 1) {
      return
    }
    configOptions.categories = configOptions.categories.filter((value) => value !== categoryValue)
  } else {
    configOptions.categories = [...configOptions.categories, categoryValue]
  }
}

function selectAllCategories() {
  configOptions.categories = availableCategories.value.map((category) => category.value)
}

function restoreDefaultCategories() {
  configOptions.categories = [...defaultCategories]
  configOptions.defaultCategory = 'all'
}

function getCategoryName(categoryValue: string) {
  return availableCategories.value.find((category) => category.value === categoryValue)?.name ?? categoryValue
}

function handleSelectEmoji(emoji: EmojiItemWithStyle) {
  selectedEmoji.value = emoji
  selectedEmojis.value = [emoji, ...selectedEmojis.value.filter((item) => item.name !== emoji.name || item.style !== emoji.style)].slice(0, 12)
}

function handleClearEmoji() {
  selectedEmoji.value = null
}

function clearAllEmojis() {
  selectedEmoji.value = null
  selectedEmojis.value = []
}

function removeEmoji(index: number) {
  selectedEmojis.value.splice(index, 1)
}
</script>

<template>
  <div class="advanced-layout">
    <div class="content-area">
      <div class="layout-container">
        <div class="config-area">
          <section class="config-panel surface-card">
            <div class="panel-header">
              <h3>{{ text.configTitle }}</h3>
              <button type="button" class="action-button" @click="resetConfig">{{ text.reset }}</button>
            </div>

            <div class="tabs">
              <button
                v-for="tab in tabs"
                :key="tab"
                type="button"
                class="tab-header"
                :class="{ active: activeTab === tab }"
                @click="activeTab = tab"
              >
                {{ text.tabs[tab] }}
              </button>
            </div>

            <div v-if="activeTab === 'basic'" class="tab-content">
              <label>
                <span>{{ text.labels.style }}</span>
                <select v-model="configOptions.initialStyle" class="text-input">
                  <option v-for="style in localizedStyles" :key="style.value" :value="style.value">{{ style.name }}</option>
                </select>
              </label>

              <label>
                <span>{{ text.labels.buttonText }}</span>
                <input v-model="configOptions.buttonText" type="text" class="text-input" />
              </label>

              <label class="checkbox-row"><input v-model="configOptions.disabled" type="checkbox" /> <span>{{ text.labels.disabled }}</span></label>
              <label class="checkbox-row"><input v-model="configOptions.closeOnSelect" type="checkbox" /> <span>{{ text.labels.closeOnSelect }}</span></label>
              <label class="checkbox-row"><input v-model="configOptions.showSelectedEmoji" type="checkbox" /> <span>{{ text.labels.showSelectedEmoji }}</span></label>
            </div>

            <div v-else-if="activeTab === 'layout'" class="tab-content">
              <label>
                <span>{{ text.labels.width }}</span>
                <input v-model.number="configOptions.width" type="range" min="240" max="520" step="20" />
                <strong>{{ configOptions.width }}px</strong>
              </label>

              <label>
                <span>{{ text.labels.columns }}</span>
                <input v-model.number="configOptions.columns" type="range" min="4" max="10" step="1" />
                <strong>{{ configOptions.columns }}</strong>
              </label>

              <label class="checkbox-row"><input v-model="configOptions.autoFill" type="checkbox" /> <span>{{ text.labels.autoFill }}</span></label>

              <label>
                <span>{{ text.labels.emojiSize }}</span>
                <input v-model.number="configOptions.emojiSize" type="range" min="20" max="36" step="2" />
                <strong>{{ configOptions.emojiSize }}px</strong>
              </label>
            </div>

            <div v-else-if="activeTab === 'content'" class="tab-content">
              <div class="scope-block">
                <span>{{ text.labels.scopeMode }}</span>
                <div class="scope-mode-row">
                  <button
                    v-for="mode in scopeModes"
                    :key="mode"
                    type="button"
                    class="mode-button"
                    :class="{ active: scopeMode === mode }"
                    @click="scopeMode = mode"
                  >
                    {{ text.scopeModes[mode] }}
                  </button>
                </div>
              </div>

              <label v-if="scopeMode === 'preset'">
                <span>{{ text.labels.preset }}</span>
                <select v-model="selectedPreset" class="text-input">
                  <option v-for="preset in presetOptions" :key="preset.key" :value="preset.key">{{ preset.label }}</option>
                </select>
              </label>

              <div v-if="scopeMode === 'preset'" class="hint-box">
                <strong>{{ currentPreset.label }}</strong>
                <p>{{ currentPreset.description }}</p>
              </div>

              <div v-else-if="scopeMode === 'categories'" class="category-mode-block">
                <div class="categories-header">
                  <span>{{ text.labels.categories }}</span>
                  <div class="categories-actions">
                    <button type="button" class="small-button" @click="selectAllCategories">{{ text.labels.selectAll }}</button>
                    <button type="button" class="small-button" @click="restoreDefaultCategories">{{ text.labels.restoreDefault }}</button>
                  </div>
                </div>

                <div class="categories-grid">
                  <label v-for="category in availableCategories" :key="category.value" class="category-checkbox">
                    <input
                      type="checkbox"
                      :checked="configOptions.categories.includes(category.value)"
                      @change="toggleCategory(category.value)"
                    />
                    <span>{{ category.name }}</span>
                  </label>
                </div>

                <div class="selected-tags">
                  <strong>{{ text.labels.selectedCategories }}</strong>
                  <div class="tag-list">
                    <span v-for="categoryLabel in selectedCategoryLabels" :key="categoryLabel" class="tag-chip">{{ categoryLabel }}</span>
                  </div>
                </div>
              </div>

              <label v-else-if="scopeMode === 'emojiNames'">
                <span>{{ text.labels.emojiNames }}</span>
                <textarea v-model="emojiNamesInput" class="text-input textarea-input" :placeholder="text.labels.emojiNamesPlaceholder" />
              </label>

              <div v-if="scopeMode === 'emojiNames'" class="hint-box compact">
                <strong>{{ text.labels.emojiCount }}</strong>
                <p>{{ normalizedEmojiNames.length }}</p>
                <span>{{ text.labels.emojiNamesHelp }}</span>
              </div>

              <label>
                <span>{{ text.labels.defaultCategory }}</span>
                <select v-model="configOptions.defaultCategory" class="text-input">
                  <option v-for="category in scopedCategoryOptions" :key="category.value" :value="category.value">{{ category.name }}</option>
                </select>
              </label>

              <div class="hint-box compact">
                <strong>{{ text.labels.currentScope }}</strong>
                <p>{{ scopeSummary }}</p>
              </div>

              <label class="checkbox-row"><input v-model="configOptions.showSearch" type="checkbox" /> <span>{{ text.labels.showSearch }}</span></label>
            </div>

            <div v-else class="tab-content">
              <label>
                <span>{{ text.labels.renderBatchSize }}</span>
                <input v-model.number="configOptions.renderBatchSize" type="range" min="60" max="240" step="30" />
                <strong>{{ configOptions.renderBatchSize }}</strong>
              </label>

              <label class="checkbox-row"><input v-model="useCustomBaseUrl" type="checkbox" /> <span>{{ text.labels.useCustomBaseUrl }}</span></label>

              <label>
                <span>{{ text.labels.baseUrl }}</span>
                <input v-model="customBaseUrl" type="text" class="text-input" :disabled="!useCustomBaseUrl" />
              </label>

              <div class="hint-box compact">
                <strong>{{ text.labels.baseUrl }}</strong>
                <p>{{ resolvedBaseUrl }}</p>
                <span>{{ text.labels.localeHint }}</span>
              </div>
            </div>
          </section>

          <section class="current-config surface-card">
            <div class="section-header">
              <h3>{{ text.labels.currentConfig }}</h3>
              <span class="code-label">JSON</span>
            </div>
            <pre class="config-code">{{ configJson }}</pre>
          </section>
        </div>

        <div class="preview-area">
          <section class="preview-section surface-card">
            <div class="section-header stacked">
              <h3>{{ text.labels.previewTitle }}</h3>
              <p>{{ text.labels.previewCopy }}</p>
            </div>

            <div class="picker-container">
              <FluentEmojiPicker
                :locale="locale"
                :base-url="resolvedBaseUrl"
                :initial-style="configOptions.initialStyle"
                :button-text="configOptions.buttonText"
                :disabled="configOptions.disabled"
                :close-on-select="configOptions.closeOnSelect"
                :show-selected-emoji="configOptions.showSelectedEmoji"
                :width="configOptions.width"
                :columns="configOptions.columns"
                :auto-fill="configOptions.autoFill"
                :emoji-size="configOptions.emojiSize"
                :default-category="configOptions.defaultCategory"
                :categories="resolvedCategories"
                :preset="resolvedPreset"
                :emoji-names="resolvedEmojiNames"
                :show-search="configOptions.showSearch"
                :render-batch-size="configOptions.renderBatchSize"
                @select="handleSelectEmoji"
                @clear="handleClearEmoji"
              >
                <template #trigger="{ toggleOpen, disabled }">
                  <button type="button" class="emoji-pack-trigger" :disabled="disabled" @click="toggleOpen">
                    <span class="emoji-pack-trigger__icon">😀</span>
                    <span>{{ configOptions.buttonText }}</span>
                  </button>
                </template>
              </FluentEmojiPicker>
            </div>
          </section>

          <section class="selected-section surface-card">
            <div class="section-header">
              <h3>{{ text.labels.selectedList }}</h3>
              <button v-if="selectedEmojis.length" type="button" class="action-button secondary" @click="clearAllEmojis">{{ text.labels.clearSelections }}</button>
            </div>

            <div v-if="selectedEmojis.length === 0" class="empty-selection">{{ text.labels.emptySelection }}</div>

            <ul v-else class="emoji-list">
              <li v-for="(emoji, index) in selectedEmojis" :key="`${emoji.name}-${emoji.style}-${index}`" class="emoji-item">
                <div class="emoji-item-content">
                  <img :src="buildEmojiImageUrl(resolvedBaseUrl, emoji.style, emoji.path)" :alt="emoji.name" width="36" height="36" />
                  <div>
                    <strong>{{ emoji.name }}</strong>
                    <p>{{ getCategoryName(emoji.category) }} / {{ emoji.style }}</p>
                  </div>
                </div>
                <button type="button" class="remove-button" @click="removeEmoji(index)">×</button>
              </li>
            </ul>
          </section>
        </div>
      </div>

      <section class="notes surface-card">
        <h3>{{ text.labels.docs }}</h3>
        <div class="docs-grid">
          <div class="doc-section">
            <h4>{{ text.tabs.basic }}</h4>
            <ul><li v-for="item in text.docs.basic" :key="item">{{ item }}</li></ul>
          </div>
          <div class="doc-section">
            <h4>{{ text.tabs.layout }}</h4>
            <ul><li v-for="item in text.docs.layout" :key="item">{{ item }}</li></ul>
          </div>
          <div class="doc-section">
            <h4>{{ text.tabs.content }}</h4>
            <ul><li v-for="item in text.docs.content" :key="item">{{ item }}</li></ul>
          </div>
          <div class="doc-section">
            <h4>{{ text.tabs.advanced }}</h4>
            <ul><li v-for="item in text.docs.advanced" :key="item">{{ item }}</li></ul>
          </div>
        </div>
      </section>
    </div>

    <aside class="code-area">
      <CodeBlock :locale="locale" language="vue" :title="text.codeTitle" :code="exampleCode" floating always-expanded />
    </aside>
  </div>
</template>

<style scoped>
.advanced-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) 420px;
  gap: 24px;
}

.content-area,
.config-area,
.preview-area {
  display: grid;
  gap: 20px;
}

.layout-container {
  display: grid;
  grid-template-columns: minmax(300px, 0.95fr) minmax(320px, 1.05fr);
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

.panel-header,
.section-header,
.categories-header {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
}

.section-header.stacked {
  display: grid;
  justify-content: start;
}

.panel-header h3,
.section-header h3,
.notes h3,
.doc-section h4 {
  margin: 0;
}

.section-header.stacked p,
.emoji-item-content p,
.empty-selection,
.hint-box p,
.hint-box span {
  margin: 0;
  color: #64748b;
}

.tabs,
.scope-mode-row,
.tag-list,
.categories-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tab-header,
.action-button,
.small-button,
.mode-button {
  border: 1px solid #e5e7eb;
  background: #f9fafb;
  cursor: pointer;
}

.tab-header,
.mode-button {
  padding: 8px 12px;
  border-radius: 999px;
}

.tab-header.active,
.mode-button.active {
  background: #3b82f6;
  border-color: #2563eb;
  color: white;
}

.tab-content,
.scope-block,
.category-mode-block,
.selected-tags {
  display: grid;
  gap: 14px;
}

.tab-content label {
  display: grid;
  gap: 8px;
}

.text-input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 10px;
}

.textarea-input {
  min-height: 120px;
  resize: vertical;
}

.checkbox-row,
.category-checkbox {
  display: flex !important;
  align-items: center;
  gap: 10px;
}

.small-button,
.action-button {
  padding: 8px 12px;
  border-radius: 8px;
}

.action-button.secondary {
  background: #eff6ff;
  border-color: #bfdbfe;
  color: #2563eb;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.category-checkbox {
  padding: 10px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
}

.hint-box {
  display: grid;
  gap: 6px;
  padding: 12px 14px;
  border-radius: 10px;
  background: #f8fafc;
}

.hint-box.compact strong {
  font-size: 13px;
}

.tag-chip,
.code-label {
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 999px;
  background: #eff6ff;
  color: #2563eb;
  font-size: 12px;
}

.config-code {
  margin: 0;
  padding: 16px;
  border-radius: 10px;
  background: #0f172a;
  color: #e2e8f0;
  font-size: 13px;
  overflow: auto;
}

.picker-container {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 12px;
  border-radius: 12px;
  background: #f8fafc;
}

.emoji-pack-trigger {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border: 1px solid #d1d5db;
  border-radius: 999px;
  background: white;
  color: #111827;
  cursor: pointer;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.06);
}

.emoji-pack-trigger:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.emoji-pack-trigger__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 999px;
  background: #fef3c7;
  font-size: 16px;
}

.emoji-list {
  display: grid;
  gap: 10px;
  list-style: none;
  padding: 0;
  margin: 0;
}

.emoji-item {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
  padding: 10px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
}

.emoji-item-content {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 12px;
  align-items: center;
}

.emoji-item-content img {
  border-radius: 10px;
  background: #f8fafc;
}

.remove-button {
  border: none;
  background: transparent;
  color: #ef4444;
  font-size: 20px;
  cursor: pointer;
}

.docs-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.doc-section ul {
  margin: 0;
  padding-left: 18px;
  color: #64748b;
}

@media (max-width: 1200px) {
  .advanced-layout,
  .layout-container {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .categories-grid,
  .docs-grid {
    grid-template-columns: 1fr;
  }
}
</style>
