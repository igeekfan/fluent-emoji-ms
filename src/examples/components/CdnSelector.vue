<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { EmojiLocale } from '@fluent-emoji-ms/vue'
import { getDemoMessages } from '../demo-locale'

const props = withDefaults(defineProps<{
  modelValue: string
  showTestButton?: boolean
  locale?: EmojiLocale
}>(), {
  showTestButton: true,
  locale: 'zh-CN'
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const messages = computed(() => getDemoMessages(props.locale).cdnSelector)
const cdnOptions = computed(() => [
  {
    name: messages.value.jsDelivr.name,
    value: 'https://cdn.jsdelivr.net/npm/fluentui-emoji@1.1.1',
    description: messages.value.jsDelivr.description
  },
  {
    name: messages.value.unpkg.name,
    value: 'https://unpkg.com/fluentui-emoji@1.1.1',
    description: messages.value.unpkg.description
  },
  {
    name: messages.value.custom.name,
    value: 'custom',
    description: messages.value.custom.description
  }
])

const selectedCdn = ref(findInitialCdn())
const customCdnUrl = ref(isCustomUrl() ? props.modelValue : '')
const cdnTestStatus = ref<'idle' | 'testing' | 'success' | 'error'>('idle')
const testImageSrc = ref('')

function findInitialCdn() {
  const matchedCdn = cdnOptions.value.find((cdn) => cdn.value === props.modelValue)
  return matchedCdn ? matchedCdn.value : 'custom'
}

function isCustomUrl() {
  return !cdnOptions.value.some((cdn) => cdn.value === props.modelValue && cdn.value !== 'custom')
}

const actualCdnUrl = computed(() => {
  return selectedCdn.value === 'custom' ? customCdnUrl.value : selectedCdn.value
})

const testStatusLabel = computed(() => {
  if (cdnTestStatus.value === 'testing') {
    return messages.value.testing
  }

  if (cdnTestStatus.value === 'success') {
    return messages.value.success
  }

  if (cdnTestStatus.value === 'error') {
    return messages.value.error
  }

  return messages.value.testIdle
})

function updateCdnValue() {
  emit('update:modelValue', actualCdnUrl.value)
}

watch(selectedCdn, () => {
  updateCdnValue()
})

watch(customCdnUrl, () => {
  if (selectedCdn.value === 'custom') {
    updateCdnValue()
  }
})

function testCdnConnection() {
  cdnTestStatus.value = 'testing'

  const testEmojis = [
    'smiling-face.svg',
    'grinning-face.svg',
    'face-with-tears-of-joy.svg',
    'partying-face.svg'
  ]
  const randomEmoji = testEmojis[Math.floor(Math.random() * testEmojis.length)]
  const timestamp = new Date().getTime()

  testImageSrc.value = `${actualCdnUrl.value}/icons/flat/${randomEmoji}?t=${timestamp}`

  const img = new Image()
  img.onload = () => {
    cdnTestStatus.value = 'success'
    setTimeout(() => {
      cdnTestStatus.value = 'idle'
    }, 3000)
  }

  img.onerror = () => {
    cdnTestStatus.value = 'error'
    setTimeout(() => {
      cdnTestStatus.value = 'idle'
    }, 3000)
  }

  img.src = testImageSrc.value
}
</script>

<template>
  <div class="cdn-selector">
    <div class="cdn-options">
      <div class="cdn-radio-group">
        <label 
          v-for="option in cdnOptions" 
          :key="option.value"
          class="cdn-radio-option"
          :class="{ active: selectedCdn === option.value }"
        >
          <input 
            type="radio" 
            :value="option.value"
            v-model="selectedCdn"
            name="cdn-option"
          />
          <div class="option-content">
            <span class="option-name">{{ option.name }}</span>
            <span class="option-description">{{ option.description }}</span>
          </div>
        </label>
      </div>
      
      <div v-if="selectedCdn === 'custom'" class="custom-cdn-input">
        <input 
          type="text" 
          v-model="customCdnUrl" 
          :placeholder="messages.customPlaceholder"
          class="cdn-input"
        />
      </div>
      
      <div v-if="showTestButton" class="cdn-test-container">
        <button 
          @click="testCdnConnection" 
          class="test-cdn-button"
          :disabled="cdnTestStatus === 'testing'"
        >
          <span :class="{ 'success-message': cdnTestStatus === 'success', 'error-message': cdnTestStatus === 'error' }">
            {{ testStatusLabel }}
          </span>
        </button>
        
        <div v-if="cdnTestStatus === 'success'" class="test-result success">
          <img :src="testImageSrc" alt="Test Emoji" class="test-image" />
          <span>{{ messages.successMessage }}</span>
        </div>
        
        <div v-if="cdnTestStatus === 'error'" class="test-result error">
          {{ messages.errorMessage }}
        </div>
      </div>
    </div>
    
    <div class="current-cdn">
      <span class="label">{{ messages.currentUrl }}</span>
      <span class="value">{{ actualCdnUrl }}</span>
    </div>
  </div>
</template>

<style scoped>
.cdn-selector {
  background-color: #f8fafc;
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 12px;
}

.cdn-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.cdn-radio-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.cdn-radio-option {
  display: flex;
  align-items: flex-start;
  padding: 6px 8px;
  border-radius: 4px;
  cursor: pointer;
  background-color: white;
  border: 1px solid #e2e8f0;
  transition: all 0.2s;
}

.cdn-radio-option:hover {
  background-color: #f1f5f9;
}

.cdn-radio-option.active {
  border-color: #3b82f6;
  background-color: #eff6ff;
}

.cdn-radio-option input {
  margin-right: 6px;
  margin-top: 3px;
}

.option-content {
  display: flex;
  flex-direction: column;
}

.option-name {
  font-weight: 500;
  font-size: 14px;
  color: #1e293b;
}

.option-description {
  font-size: 11px;
  color: #64748b;
  margin-top: 1px;
}

.custom-cdn-input {
  margin-top: 4px;
}

.cdn-input {
  width: 100%;
  padding: 6px 8px;
  border: 1px solid #cbd5e1;
  border-radius: 4px;
  font-size: 13px;
}

.cdn-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.3);
}

.cdn-test-container {
  margin-top: 8px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
}

.test-cdn-button {
  background-color: #f8fafc;
  border: 1px solid #cbd5e1;
  border-radius: 4px;
  padding: 4px 10px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.test-cdn-button:hover:not(:disabled) {
  background-color: #f1f5f9;
  border-color: #94a3b8;
}

.test-cdn-button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.success-message {
  color: #16a34a;
}

.error-message {
  color: #dc2626;
}

.test-result {
  margin-left: 6px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 13px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.test-result.success {
  background-color: #f0fdf4;
  border: 1px solid #bbf7d0;
  color: #166534;
}

.test-result.error {
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  color: #991b1b;
}

.test-image {
  width: 16px;
  height: 16px;
}

.current-cdn {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
}

.label {
  color: #64748b;
  white-space: nowrap;
}

.value {
  font-family: monospace;
  font-size: 12px;
  color: #334155;
  background-color: #f1f5f9;
  padding: 2px 4px;
  border-radius: 3px;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
}

@media (max-width: 640px) {
  .cdn-radio-option {
    padding: 6px;
  }
  
  .option-name {
    font-size: 13px;
  }
  
  .option-description {
    font-size: 10px;
  }
}
</style>
