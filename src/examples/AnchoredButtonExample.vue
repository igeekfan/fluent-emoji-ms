<script setup lang="ts">
import { computed, ref } from 'vue'
import { FluentEmojiPicker, buildEmojiImageUrl, type EmojiItemWithStyle, type EmojiLocale, useEmojiConfig } from '@fluent-emoji-ms/vue'
import CodeBlock from './components/CodeBlock.vue'
import { getDemoMessages } from './demo-locale'

const props = withDefaults(defineProps<{ locale?: EmojiLocale }>(), {
  locale: 'zh-CN'
})

const { config } = useEmojiConfig()
const selectedEmoji = ref<EmojiItemWithStyle | null>(null)
const demo = computed(() => getDemoMessages(props.locale).anchored)

const exampleCode = computed(() => `<FluentEmojiPicker locale="${props.locale}" :width="320" preset="workflow" :show-search="false" @select="selectedEmoji = $event">
  <template #trigger="{ toggleOpen, isOpen }">
    <button type="button" class="toolbar-button accent" @click="toggleOpen">
      {{ isOpen ? '${demo.value.collapse}' : '${demo.value.insert}' }}
    </button>
  </template>
</FluentEmojiPicker>`)
</script>

<template>
  <div class="anchored-layout">
    <section class="scene-card">
      <div class="scene-header">
        <div>
          <p class="scene-label">{{ demo.sectionLabel }}</p>
          <h3>{{ demo.title }}</h3>
        </div>
        <p class="scene-copy">{{ demo.copy }}</p>
      </div>

      <div class="editor-shell">
        <div class="toolbar-row">
          <button type="button" class="toolbar-button">{{ demo.mention }}</button>
          <button type="button" class="toolbar-button">{{ demo.upload }}</button>

          <FluentEmojiPicker
            :locale="locale"
            preset="workflow"
            :show-search="false"
            :width="320"
            :close-on-select="false"
            @select="selectedEmoji = $event"
          >
            <template #trigger="{ toggleOpen, isOpen }">
              <button type="button" class="toolbar-button accent" @click="toggleOpen">
                <span>{{ isOpen ? demo.collapse : demo.insert }}</span>
                <span v-if="selectedEmoji">{{ selectedEmoji.name }}</span>
              </button>
            </template>
          </FluentEmojiPicker>

          <button type="button" class="toolbar-button">{{ demo.preview }}</button>
        </div>

        <div class="draft-card">
          <p class="draft-label">{{ demo.currentScene }}</p>
          <p class="draft-copy">{{ demo.currentCopy }}</p>

          <div v-if="selectedEmoji" class="selection-row">
            <img
              :src="buildEmojiImageUrl(config.cdn.baseUrl, selectedEmoji.style, selectedEmoji.path)"
              :alt="selectedEmoji.name"
              width="48"
              height="48"
            />
            <div>
              <strong>{{ selectedEmoji.name }}</strong>
              <p>{{ selectedEmoji.category }} / {{ selectedEmoji.style }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="aside-card">
      <div class="tip-card">
        <h3>{{ demo.tipsTitle }}</h3>
        <ul>
          <li v-for="tip in demo.tips" :key="tip">{{ tip }}</li>
        </ul>
      </div>

      <CodeBlock :locale="locale" language="vue" :title="demo.codeTitle" :code="exampleCode" />
    </section>
  </div>
</template>

<style scoped>
.anchored-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) minmax(320px, 0.7fr);
  gap: 24px;
}

.scene-card,
.aside-card,
.tip-card,
.draft-card {
  display: grid;
  gap: 16px;
}

.scene-card,
.tip-card,
.draft-card {
  padding: 20px;
  border: 1px solid rgba(148, 163, 184, 0.22);
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.94);
  box-shadow: 0 18px 44px rgba(15, 23, 42, 0.06);
}

.scene-header {
  display: grid;
  gap: 10px;
}

.scene-label,
.draft-label {
  margin: 0;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #0f766e;
}

.scene-header h3,
.tip-card h3 {
  margin: 0;
}

.scene-copy,
.draft-copy,
.selection-row p,
.tip-card ul {
  margin: 0;
  color: #475569;
}

.editor-shell {
  display: grid;
  gap: 16px;
}

.toolbar-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  padding: 14px;
  border-radius: 20px;
  background: linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%);
  border: 1px solid rgba(148, 163, 184, 0.24);
}

.toolbar-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 42px;
  padding: 10px 14px;
  border: 1px solid #cbd5e1;
  border-radius: 999px;
  background: #fff;
  color: #0f172a;
  cursor: pointer;
}

.toolbar-button.accent {
  border-color: #0f766e;
  background: #0f766e;
  color: #fff;
}

.selection-row {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 12px;
  align-items: center;
}

.selection-row img {
  border-radius: 14px;
  background: #f8fafc;
}

.tip-card ul {
  padding-left: 18px;
}

@media (max-width: 960px) {
  .anchored-layout {
    grid-template-columns: 1fr;
  }
}
</style>