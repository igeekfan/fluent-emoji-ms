<script setup lang="ts">
import { computed, ref } from 'vue'
import { FluentEmojiPicker, buildEmojiImageUrl, type EmojiItemWithStyle, type EmojiLocale, useEmojiConfig } from '@igeekfan/fluent-emoji-ms-vue'
import CodeBlock from './components/CodeBlock.vue'

type ButtonStyleKey = 'default' | 'blue' | 'green' | 'red' | 'icon'

const props = withDefaults(defineProps<{ locale?: EmojiLocale }>(), {
  locale: 'zh-CN'
})

const { config } = useEmojiConfig()
const selectedEmoji = ref<EmojiItemWithStyle | null>(null)
const currentStyle = ref<ButtonStyleKey>('default')

const text = computed(() => props.locale === 'en-US'
  ? {
      title: 'Customize the trigger through slots',
      copy: 'The trigger slot lets you keep the picker attached to your own button designs while preserving the same selection behavior.',
      emptyTitle: 'No emoji selected yet',
      emptyCopy: 'Pick an emoji from any custom trigger below to preview the selected state.',
      selectedTitle: 'Current selection',
      styleTitle: 'Choose a button style',
      codeTitle: 'Slot customization example',
      styles: {
        default: 'Default',
        blue: 'Blue',
        green: 'Green',
        red: 'Red',
        icon: 'Icon'
      },
      descriptions: {
        default: 'Use the built-in trigger button.',
        blue: 'A primary action button with emoji preview.',
        green: 'A confirm-style button for positive workflows.',
        red: 'A compact attention-grabbing action button.',
        icon: 'A pure icon trigger for dense toolbars.'
      },
      insert: 'Insert Emoji',
      replace: 'Replace Emoji',
      quickReaction: 'Quick Reaction',
      statusAction: 'Status Action',
      toolbar: 'Toolbar Action',
      category: 'Category',
      style: 'Style'
    }
  : {
      title: '通过插槽自定义触发按钮',
      copy: 'trigger 插槽可以把选择器挂到你自己的按钮设计上，同时保留同一套表情选择交互。',
      emptyTitle: '还没有选中表情',
      emptyCopy: '从下方任意一种按钮样式里选一个表情，看看触发器和结果区如何联动。',
      selectedTitle: '当前选中表情',
      styleTitle: '选择按钮样式',
      codeTitle: '插槽自定义示例',
      styles: {
        default: '默认',
        blue: '蓝色',
        green: '绿色',
        red: '红色',
        icon: '图标'
      },
      descriptions: {
        default: '使用组件自带的默认触发按钮。',
        blue: '带预览的主操作按钮，适合插入内容。',
        green: '偏确认语义的按钮，适合正向流程。',
        red: '更醒目的强调按钮，适合高关注动作。',
        icon: '纯图标触发器，适合密集工具栏。'
      },
      insert: '插入表情',
      replace: '更换表情',
      quickReaction: '快速反馈',
      statusAction: '状态动作',
      toolbar: '工具栏动作',
      category: '分类',
      style: '风格'
    })

const styleOptions = computed(() => [
  { key: 'default' as const, label: text.value.styles.default, description: text.value.descriptions.default },
  { key: 'blue' as const, label: text.value.styles.blue, description: text.value.descriptions.blue },
  { key: 'green' as const, label: text.value.styles.green, description: text.value.descriptions.green },
  { key: 'red' as const, label: text.value.styles.red, description: text.value.descriptions.red },
  { key: 'icon' as const, label: text.value.styles.icon, description: text.value.descriptions.icon }
])

const exampleCode = computed(() => {
  if (currentStyle.value === 'default') {
    return `<FluentEmojiPicker locale="${props.locale}" :base-url="${config.cdn.baseUrl}" @select="handleSelectEmoji" />`
  }

  const buttonMarkup = {
    blue: `<button type="button" class="blue-button" @click="toggleOpen">
  <span>${selectedEmoji.value ? text.value.replace : text.value.insert}</span>
</button>`,
    green: `<button type="button" class="green-button" @click="toggleOpen">
  <span>${text.value.quickReaction}</span>
</button>`,
    red: `<button type="button" class="red-button" @click="toggleOpen">
  <span>${text.value.statusAction}</span>
</button>`,
    icon: `<button type="button" class="icon-button" @click="toggleOpen" aria-label="${text.value.toolbar}">
  <span>😊</span>
</button>`
  }[currentStyle.value]

  return `<FluentEmojiPicker locale="${props.locale}" :base-url="${config.cdn.baseUrl}" @select="handleSelectEmoji">
  <template #trigger="{ toggleOpen }">
    ${buttonMarkup}
  </template>
</FluentEmojiPicker>`
})
</script>

<template>
  <div class="slot-layout">
    <section class="preview-card surface-card">
      <div class="section-head">
        <h3>{{ text.title }}</h3>
        <p class="section-copy">{{ text.copy }}</p>
      </div>

      <div v-if="selectedEmoji" class="selected-preview">
        <div class="emoji-preview-image">
          <img
            :src="buildEmojiImageUrl(config.cdn.baseUrl, selectedEmoji.style, selectedEmoji.path)"
            :alt="selectedEmoji.name"
            width="80"
            height="80"
          />
        </div>
        <div>
          <p class="preview-label">{{ text.selectedTitle }}</p>
          <strong>{{ selectedEmoji.name }}</strong>
          <p>{{ text.category }}: {{ selectedEmoji.category }}</p>
          <p>{{ text.style }}: {{ selectedEmoji.style }}</p>
        </div>
      </div>
      <div v-else class="empty-preview">
        <div class="empty-icon">💫</div>
        <strong>{{ text.emptyTitle }}</strong>
        <p>{{ text.emptyCopy }}</p>
      </div>
    </section>

    <section class="surface-card style-card">
      <div class="section-head compact-head">
        <h3>{{ text.styleTitle }}</h3>
      </div>

      <div class="style-selector-grid">
        <button
          v-for="style in styleOptions"
          :key="style.key"
          type="button"
          class="style-selector"
          :class="{ active: currentStyle === style.key }"
          @click="currentStyle = style.key"
        >
          <strong>{{ style.label }}</strong>
          <span>{{ style.description }}</span>
        </button>
      </div>
    </section>

    <div class="showcase-layout">
      <section class="surface-card showcase-card">
        <div class="showcase-demo">
          <FluentEmojiPicker
            v-if="currentStyle === 'default'"
            :locale="locale"
            :base-url="config.cdn.baseUrl"
            @select="selectedEmoji = $event"
            @clear="selectedEmoji = null"
          />

          <FluentEmojiPicker
            v-else
            :locale="locale"
            :base-url="config.cdn.baseUrl"
            @select="selectedEmoji = $event"
            @clear="selectedEmoji = null"
          >
            <template #trigger="{ toggleOpen }">
              <button
                v-if="currentStyle === 'blue'"
                type="button"
                class="blue-button"
                @click="toggleOpen"
              >
                <span>{{ selectedEmoji ? text.replace : text.insert }}</span>
                <span v-if="selectedEmoji" class="trigger-emoji-preview">
                  <img
                    :src="buildEmojiImageUrl(config.cdn.baseUrl, selectedEmoji.style, selectedEmoji.path)"
                    :alt="selectedEmoji.name"
                    width="20"
                    height="20"
                  />
                </span>
              </button>

              <button v-else-if="currentStyle === 'green'" type="button" class="green-button" @click="toggleOpen">
                <span>{{ text.quickReaction }}</span>
              </button>

              <button v-else-if="currentStyle === 'red'" type="button" class="red-button" @click="toggleOpen">
                <span>{{ text.statusAction }}</span>
              </button>

              <button v-else type="button" class="icon-button" :aria-label="text.toolbar" @click="toggleOpen">
                <span>😊</span>
              </button>
            </template>
          </FluentEmojiPicker>
        </div>
      </section>

      <aside class="code-column">
        <CodeBlock :locale="locale" language="vue" :title="text.codeTitle" :code="exampleCode" />
      </aside>
    </div>
  </div>
</template>

<style scoped>
.slot-layout {
  display: grid;
  gap: 20px;
}

.showcase-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 420px;
  gap: 20px;
}

.surface-card {
  padding: 20px;
  border: 1px solid rgba(148, 163, 184, 0.22);
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.94);
  box-shadow: 0 18px 44px rgba(15, 23, 42, 0.06);
}

.section-head {
  display: grid;
  gap: 8px;
}

.compact-head {
  gap: 4px;
}

.section-head h3,
.preview-label,
.empty-preview strong {
  margin: 0;
}

.section-copy,
.selected-preview p,
.empty-preview p {
  margin: 0;
  color: #475569;
}

.selected-preview {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 16px;
  align-items: center;
}

.emoji-preview-image {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 112px;
  height: 112px;
  border-radius: 24px;
  background: #f8fafc;
}

.empty-preview {
  display: grid;
  gap: 8px;
  place-items: center;
  text-align: center;
  padding: 24px;
  border-radius: 20px;
  background: linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%);
}

.empty-icon {
  font-size: 28px;
}

.style-selector-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 12px;
}

.style-selector {
  display: grid;
  gap: 6px;
  text-align: left;
  padding: 14px;
  border: 1px solid #cbd5e1;
  border-radius: 18px;
  background: #fff;
  cursor: pointer;
}

.style-selector span {
  color: #64748b;
  font-size: 13px;
  line-height: 1.5;
}

.style-selector.active {
  border-color: #0f766e;
  background: linear-gradient(180deg, rgba(15, 118, 110, 0.12) 0%, rgba(255, 255, 255, 0.96) 100%);
}

.showcase-card {
  display: grid;
  place-items: center;
  min-height: 220px;
}

.showcase-demo {
  width: 100%;
  display: flex;
  justify-content: center;
}

.blue-button,
.green-button,
.red-button,
.icon-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 0;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.blue-button:hover,
.green-button:hover,
.red-button:hover,
.icon-button:hover {
  transform: translateY(-1px);
}

.blue-button {
  padding: 12px 18px;
  border-radius: 12px;
  background: #2563eb;
  color: #fff;
  box-shadow: 0 10px 24px rgba(37, 99, 235, 0.22);
}

.green-button {
  padding: 12px 18px;
  border-radius: 999px;
  background: #16a34a;
  color: #fff;
  box-shadow: 0 10px 24px rgba(22, 163, 74, 0.2);
}

.red-button {
  padding: 12px 18px;
  border-radius: 999px;
  background: #dc2626;
  color: #fff;
  box-shadow: 0 10px 24px rgba(220, 38, 38, 0.2);
}

.icon-button {
  width: 48px;
  height: 48px;
  border-radius: 999px;
  background: #7c3aed;
  color: #fff;
  font-size: 20px;
  box-shadow: 0 10px 24px rgba(124, 58, 237, 0.22);
}

.trigger-emoji-preview {
  display: inline-flex;
  align-items: center;
}

@media (max-width: 1080px) {
  .showcase-layout,
  .style-selector-grid {
    grid-template-columns: 1fr;
  }
}
</style>