<script setup lang="ts">
import { computed, markRaw, onMounted, ref, watch } from 'vue'
import { type EmojiLocale, useEmojiConfig } from '@igeekfan/fluent-emoji-ms-vue'
import CdnSelector from './examples/components/CdnSelector.vue'
import { getDemoMessages } from './examples/demo-locale'
import {
  EmojiMessengerApp,
  EmojiPickerExample,
  FluentEmojiPickerExample,
  SimpleEmojiPickerExample,
  SlotCustomizationExample
} from './examples'

const { config, updateConfig } = useEmojiConfig()
const showCdnConfig = ref(false)
const currentExample = ref('simple')
const demoLocale = ref<EmojiLocale>(getInitialLocale())

const messages = computed(() => getDemoMessages(demoLocale.value))
const examples = computed(() => [
  {
    id: 'simple',
    name: messages.value.app.examples.simple.name,
    description: messages.value.app.examples.simple.description,
    component: markRaw(SimpleEmojiPickerExample)
  },
  {
    id: 'low-level',
    name: messages.value.app.examples.lowLevel.name,
    description: messages.value.app.examples.lowLevel.description,
    component: markRaw(EmojiPickerExample)
  },
  {
    id: 'advanced',
    name: messages.value.app.examples.advanced.name,
    description: messages.value.app.examples.advanced.description,
    component: markRaw(FluentEmojiPickerExample)
  },
  {
    id: 'slot',
    name: messages.value.app.examples.slot.name,
    description: messages.value.app.examples.slot.description,
    component: markRaw(SlotCustomizationExample)
  },
  {
    id: 'messenger',
    name: messages.value.app.examples.messenger.name,
    description: messages.value.app.examples.messenger.description,
    component: markRaw(EmojiMessengerApp)
  }
])

const currentExampleEntry = computed(() => {
  return examples.value.find((example) => example.id === currentExample.value) ?? examples.value[0]
})

function getInitialLocale(): EmojiLocale {
  const storedLocale = localStorage.getItem('demoLocale')
  return storedLocale === 'en-US' ? 'en-US' : 'zh-CN'
}

function toggleCdnConfig() {
  showCdnConfig.value = !showCdnConfig.value
}

function updateCdnUrl(url: string) {
  updateConfig('cdn', { baseUrl: url })
}

watch(demoLocale, (value) => {
  localStorage.setItem('demoLocale', value)
})

onMounted(() => {
  if (!localStorage.getItem('demoCdnConfigShown')) {
    showCdnConfig.value = true
    localStorage.setItem('demoCdnConfigShown', 'true')
  }
})
</script>

<template>
  <div class="app-container">
    <header class="header">
      <div class="header-main">
        <h1 class="title">{{ messages.app.title }}</h1>
        <p class="description">{{ messages.app.heroCopy }}</p>
      </div>

      <div class="header-actions">
        <div class="language-group" :aria-label="messages.app.actions.language">
          <button
            type="button"
            class="language-chip"
            :class="{ active: demoLocale === 'zh-CN' }"
            @click="demoLocale = 'zh-CN'"
          >
            {{ messages.app.actions.chinese }}
          </button>
          <button
            type="button"
            class="language-chip"
            :class="{ active: demoLocale === 'en-US' }"
            @click="demoLocale = 'en-US'"
          >
            {{ messages.app.actions.english }}
          </button>
        </div>

        <button type="button" class="cdn-config-toggle" :class="{ active: showCdnConfig }" @click="toggleCdnConfig">
          {{ messages.app.actions.cdn }}
        </button>
        <a class="github-link" href="https://github.com/igeekfan/fluent-emoji-ms" target="_blank">{{ messages.app.actions.github }}</a>
      </div>
    </header>

    <div v-if="showCdnConfig" class="global-cdn-panel">
      <div class="panel-header">
        <div>
          <h3>{{ messages.app.cdn.title }}</h3>
          <p class="panel-description">{{ messages.app.cdn.description }}</p>
        </div>
        <button type="button" class="close-panel" @click="toggleCdnConfig">{{ messages.app.cdn.close }}</button>
      </div>

      <div class="panel-content">
        <CdnSelector :model-value="config.cdn.baseUrl" :locale="demoLocale" @update:model-value="updateCdnUrl" />
      </div>
    </div>

    <div class="example-tabs">
      <button
        v-for="example in examples"
        :key="example.id"
        type="button"
        :class="['tab-button', { active: currentExample === example.id }]"
        @click="currentExample = example.id"
      >
        {{ example.name }}
      </button>
    </div>

    <main class="content">
      <div class="example-container">
        <div class="example-header">
          <h2>{{ currentExampleEntry.name }}</h2>
          <p>{{ currentExampleEntry.description }}</p>
        </div>

        <component :is="currentExampleEntry.component" :locale="demoLocale" />
      </div>
    </main>

    <footer class="footer">
      <p>
        <a href="https://github.com/microsoft/fluentui-emoji" target="_blank">Fluent UI Emoji</a>
        <span class="footer-separator">|</span>
        <a href="https://github.com/igeekfan/fluent-emoji-ms" target="_blank">Fluent Emoji MS</a>
      </p>
      <p>
        <button type="button" class="footer-cdn-button" @click="toggleCdnConfig">{{ messages.app.actions.cdn }}</button>
      </p>
    </footer>
  </div>
</template>

<style>
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: #f5f7fa;
  color: #333;
  line-height: 1.6;
}

.app-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  padding: 20px 0;
  margin-bottom: 20px;
  border-bottom: 1px solid #e5e8eb;
}

.header-main {
  flex: 1;
  text-align: center;
}

.title {
  margin: 0 0 10px;
  font-size: 2.5rem;
  font-weight: 600;
  color: #2d3748;
}

.description {
  margin: 0;
  font-size: 1.05rem;
  color: #718096;
}

.header-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}

.language-group {
  display: flex;
  gap: 8px;
}

.language-chip,
.cdn-config-toggle,
.github-link,
.close-panel,
.tab-button {
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background: #f3f4f6;
  color: #4b5563;
  padding: 8px 12px;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.2s ease;
}

.language-chip.active,
.cdn-config-toggle.active,
.tab-button.active {
  background-color: #e5edff;
  border-color: #3b82f6;
  color: #3b82f6;
}

.language-chip:hover,
.cdn-config-toggle:hover,
.github-link:hover,
.tab-button:hover {
  background-color: #e5e7eb;
}

.global-cdn-panel {
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  overflow: hidden;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: flex-start;
  background-color: #f8fafc;
  padding: 16px 20px;
  border-bottom: 1px solid #e2e8f0;
}

.panel-header h3,
.example-header h2 {
  margin: 0 0 4px;
  color: #1e293b;
}

.panel-description,
.example-header p {
  margin: 0;
  color: #64748b;
}

.panel-content {
  padding: 20px;
}

.example-tabs {
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.tab-button.active {
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.18);
}

.content {
  min-height: 600px;
  margin-bottom: 40px;
}

.example-container {
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 30px;
  overflow: hidden;
}

.example-header {
  margin-bottom: 30px;
  text-align: center;
}

.footer {
  text-align: center;
  padding: 20px 0;
  color: #718096;
  font-size: 0.9rem;
}

.footer a,
.github-link,
.footer-cdn-button {
  color: #3b82f6;
}

.footer-separator {
  margin: 0 8px;
  color: #cbd5e1;
}

.footer-cdn-button {
  background: none;
  border: none;
  text-decoration: underline;
  font-size: 14px;
  cursor: pointer;
  padding: 0;
}

@media (max-width: 768px) {
  .app-container {
    padding: 15px;
  }

  .header {
    flex-direction: column;
  }

  .header-main {
    text-align: left;
  }

  .title {
    font-size: 2rem;
  }

  .example-container {
    padding: 20px 15px;
  }
}
</style>
            }

            @media (max-width: 768px) {
              .app-container {
                padding: 15px;
              }

              .header {
                flex-direction: column;
              }

              .header-main {
                text-align: left;
              }

              .title {
                font-size: 2rem;
              }

              .example-container {
                padding: 20px 15px;
              }
            }
