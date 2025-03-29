<script setup lang="ts">
import { ref, computed, watch } from 'vue';

// 组件属性
const props = defineProps({
  // 当前选中的 CDN URL
  modelValue: {
    type: String,
    required: true
  },
  // 是否显示测试按钮
  showTestButton: {
    type: Boolean,
    default: true
  }
});

// 事件
const emit = defineEmits(['update:modelValue']);

// 预设 CDN 选项
const cdnOptions = [
  { 
    name: 'JSDelivr', 
    value: 'https://cdn.jsdelivr.net/npm/fluentui-emoji@1.1.1',
    description: '性能优秀的全球 CDN'
  },
  { 
    name: 'UNPKG', 
    value: 'https://unpkg.com/fluentui-emoji@1.1.1',
    description: '由 Cloudflare 提供的 CDN'
  },
  { 
    name: '自定义 CDN', 
    value: 'custom',
    description: '自定义 CDN URL'
  }
];

// 当前选择的 CDN
const selectedCdn = ref(findInitialCdn());
// 自定义 CDN URL
const customCdnUrl = ref(isCustomUrl() ? props.modelValue : '');
// CDN 加载状态
const cdnTestStatus = ref<'idle' | 'testing' | 'success' | 'error'>('idle');
// 测试用的图片
const testImageSrc = ref('');

// 从初始值找到匹配的 CDN 选项
function findInitialCdn() {
  const matchedCdn = cdnOptions.find(cdn => cdn.value === props.modelValue);
  return matchedCdn ? matchedCdn.value : 'custom';
}

// 判断当前 URL 是否为自定义 URL
function isCustomUrl() {
  return !cdnOptions.some(cdn => cdn.value === props.modelValue && cdn.value !== 'custom');
}

// 计算当前实际使用的 CDN URL
const actualCdnUrl = computed(() => {
  return selectedCdn.value === 'custom' ? customCdnUrl.value : selectedCdn.value;
});

// 更新 CDN 值
function updateCdnValue() {
  emit('update:modelValue', actualCdnUrl.value);
}

// 监听选择变化
watch(selectedCdn, () => {
  updateCdnValue();
});

// 监听自定义 URL 变化
watch(customCdnUrl, () => {
  if (selectedCdn.value === 'custom') {
    updateCdnValue();
  }
});

// 测试 CDN 连接
function testCdnConnection() {
  cdnTestStatus.value = 'testing';
  
  // 生成随机表情测试路径
  const testEmojis = [
    'smiling-face.svg',
    'grinning-face.svg',
    'face-with-tears-of-joy.svg',
    'partying-face.svg'
  ];
  const randomEmoji = testEmojis[Math.floor(Math.random() * testEmojis.length)];
  const timestamp = new Date().getTime(); // 防止缓存
  
  // 构建测试图片 URL
  testImageSrc.value = `${actualCdnUrl.value}/icons/flat/${randomEmoji}?t=${timestamp}`;
  
  // 创建图片元素测试加载
  const img = new Image();
  img.onload = () => {
    cdnTestStatus.value = 'success';
    setTimeout(() => {
      cdnTestStatus.value = 'idle';
    }, 3000);
  };
  
  img.onerror = () => {
    cdnTestStatus.value = 'error';
    setTimeout(() => {
      cdnTestStatus.value = 'idle';
    }, 3000);
  };
  
  img.src = testImageSrc.value;
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
          placeholder="输入自定义 CDN URL"
          class="cdn-input"
        />
      </div>
      
      <div v-if="showTestButton" class="cdn-test-container">
        <button 
          @click="testCdnConnection" 
          class="test-cdn-button"
          :disabled="cdnTestStatus === 'testing'"
        >
          <span v-if="cdnTestStatus === 'idle'">测试连接</span>
          <span v-else-if="cdnTestStatus === 'testing'">测试中...</span>
          <span v-else-if="cdnTestStatus === 'success'" class="success-message">成功 ✓</span>
          <span v-else-if="cdnTestStatus === 'error'" class="error-message">失败 ✗</span>
        </button>
        
        <div v-if="cdnTestStatus === 'success'" class="test-result success">
          <img :src="testImageSrc" alt="Test Emoji" class="test-image" />
          <span>CDN 连接正常</span>
        </div>
        
        <div v-if="cdnTestStatus === 'error'" class="test-result error">
          无法加载表情图片，请检查 URL 或网络连接
        </div>
      </div>
    </div>
    
    <div class="current-cdn">
      <span class="label">当前 URL:</span>
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
