<script setup lang="ts">
import { ref, computed } from 'vue'
import FluentEmojiPicker from '../components/FluentEmojiPicker.vue'
import CodeBlock from './components/CodeBlock.vue' // 导入 CodeBlock 组件
import type { EmojiItemWithStyle } from '@/types/emoji.d.ts'
import { useEmojiConfig } from '../plugin'

// 使用全局 CDN 配置
const { config } = useEmojiConfig()

// 选中的表情
const selectedEmoji = ref<EmojiItemWithStyle | null>(null)

// 处理表情选择
const handleSelectEmoji = (emoji: EmojiItemWithStyle) => {
  selectedEmoji.value = emoji
  console.log('选中表情:', emoji.name)
}

// 处理清除操作
const handleClearEmoji = () => {
  selectedEmoji.value = null
  console.log('已清除选择')
}

// 自定义按钮样式演示，增加图标样式
const buttonStyles = [
  { name: '默认', class: '', icon: '' },
  { name: '蓝色', class: 'blue-button', icon: 'icon-emoji' },
  { name: '绿色', class: 'green-button', icon: 'icon-add' },
  { name: '红色', class: 'red-button', icon: 'icon-smile' },
  { name: '图标', class: 'icon-button', icon: 'icon-emoji-face' }
]

const currentStyle = ref(buttonStyles[0])

const changeButtonStyle = (style: typeof buttonStyles[0]) => {
  currentStyle.value = style
}

// 添加代码示例
const blueButtonCode = `<template>
  <!-- 自定义蓝色按钮 -->
  <FluentEmojiPicker 
    @select="handleSelectEmoji"
    :baseUrl="cdnBaseUrl"
    :closeOnSelect="true"
  >
    <button class="blue-button">
      <i class="icon-emoji"></i>
      <span class="button-text">{{ selectedEmoji ? '更换表情' : '插入表情' }}</span>
      <span v-if="selectedEmoji" class="emoji-preview">
        <img 
          :src="\`\${cdnBaseUrl}/icons/\${selectedEmoji.style}/\${selectedEmoji.path}\`" 
          :alt="selectedEmoji.name"
          width="20"
          height="20"
        />
      </span>
    </button>
  </FluentEmojiPicker>
</template>

<script setup>
import { ref } from 'vue'
import { FluentEmojiPicker } from 'fluent-emoji-ms'
import 'fluent-emoji-ms/style.css'

const cdnBaseUrl = 'https://cdn.jsdelivr.net/npm/fluentui-emoji@1.1.1'
const selectedEmoji = ref(null)

function handleSelectEmoji(emoji) {
  selectedEmoji.value = emoji
  console.log('选中表情:', emoji.name)
}
<\/script>

<style>
.blue-button {
  background-color: #3b82f6;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
}

.blue-button:hover {
  background-color: #2563eb;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(59, 130, 246, 0.4);
}

.emoji-preview {
  display: flex;
  align-items: center;
  justify-content: center;
}

.emoji-preview img {
  border-radius: 4px;
  background-color: rgba(255, 255, 255, 0.3);
  padding: 2px;
}

.icon-emoji::before {
  content: "😊";
}
</style>`

const iconButtonCode = `<template>
  <!-- 纯图标按钮 -->
  <FluentEmojiPicker 
    @select="handleSelectEmoji"
    :baseUrl="cdnBaseUrl"
    :closeOnSelect="true"
  >
    <button class="icon-button">
      <i class="icon-emoji-face"></i>
    </button>
  </FluentEmojiPicker>
</template>

<style>
.icon-button {
  background-color: #8b5cf6;
  color: white;
  border: none;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  font-size: 20px;
  box-shadow: 0 2px 4px rgba(139, 92, 246, 0.3);
}

.icon-button:hover {
  background-color: #7c3aed;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(139, 92, 246, 0.4);
}

.icon-emoji-face::before {
  content: "😄";
}
</style>`

// 当前展示的代码示例
const currentCode = computed(() => {
  if (currentStyle.value.name === '蓝色') {
    return blueButtonCode;
  } else if (currentStyle.value.name === '图标') {
    return iconButtonCode;
  }
  return '';
});

// 当前代码标题
const currentCodeTitle = computed(() => {
  if (currentStyle.value.name === '蓝色') {
    return '蓝色按钮示例';
  } else if (currentStyle.value.name === '图标') {
    return '图标按钮示例';
  }
  return '按钮自定义示例';
});
</script>

<template>
    
    <div class="example-layout">
      <!-- 左侧内容区域 -->
      <div class="content-area">
        <!-- 预览区域放在顶部 -->
        <div class="preview-section">
          <div v-if="selectedEmoji" class="selected-emoji-preview">
            <div class="emoji-display">
              <div class="emoji-image-container">
                <img 
                  :src="`${config.cdn.baseUrl}/icons/${selectedEmoji.style}/${selectedEmoji.path}`" 
                  :alt="selectedEmoji.name"
                  width="80"
                  height="80"
                />
              </div>
              <div class="emoji-info">
                <div class="emoji-title">当前选中表情</div>
                <div class="emoji-name">{{ selectedEmoji.name }}</div>
                <div class="emoji-meta">
                  <span class="emoji-category">{{ selectedEmoji.category || '未知分类' }}</span>
                  <span class="emoji-style">{{ selectedEmoji.style }}</span>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="empty-preview">
            <div class="empty-icon">💫</div>
            <div class="empty-text">从下方选择一个表情</div>
          </div>
        </div>
        
        <!-- 按钮样式选择卡片 -->
        <div class="style-selector-card">
          <h3>选择按钮样式</h3>
          <div class="style-buttons-grid">
            <button 
              v-for="style in buttonStyles" 
              :key="style.name"
              :class="['style-selector-button', { active: currentStyle.name === style.name }]"
              @click="changeButtonStyle(style)"
            >
              <span class="style-icon" :class="style.class">
                <i :class="style.icon"></i>
              </span>
              <span class="style-name">{{ style.name }}</span>
            </button>
          </div>
        </div>
        
        <!-- 示例按钮展示区 -->
        <div class="buttons-showcase">
          <!-- 默认按钮样式 -->
          <div v-if="currentStyle.name === '默认'" class="showcase-item">
            <h4>默认样式</h4>
            <div class="showcase-description">使用组件的默认按钮外观</div>
            <div class="showcase-demo">
              <FluentEmojiPicker 
                @select="handleSelectEmoji"
                @clear="handleClearEmoji"
                :baseUrl="config.cdn.baseUrl"
                :closeOnSelect="true"
              />
            </div>
          </div>
          
          <!-- 自定义蓝色按钮 -->
          <div v-if="currentStyle.name === '蓝色'" class="showcase-item">
            <h4>蓝色样式</h4>
            <div class="showcase-description">现代感蓝色按钮设计</div>
            <div class="showcase-demo">
              <FluentEmojiPicker 
                @select="handleSelectEmoji"
                @clear="handleClearEmoji"
                :baseUrl="config.cdn.baseUrl"
                :closeOnSelect="true"
              >
                <button type="button" class="blue-button">
                  <i class="icon-emoji"></i>
                  <span class="button-text">{{ selectedEmoji ? '更换表情' : '插入表情' }}</span>
                  <span v-if="selectedEmoji" class="emoji-preview">
                    <img 
                      :src="`${config.cdn.baseUrl}/icons/${selectedEmoji.style}/${selectedEmoji.path}`" 
                      :alt="selectedEmoji.name"
                      width="20"
                      height="20"
                    />
                  </span>
                </button>
              </FluentEmojiPicker>
            </div>
          </div>
          
          <!-- 自定义绿色按钮 -->
          <div v-if="currentStyle.name === '绿色'" class="showcase-item">
            <h4>绿色样式</h4>
            <div class="showcase-description">环保主题绿色按钮</div>
            <div class="showcase-demo">
              <FluentEmojiPicker 
                @select="handleSelectEmoji"
                @clear="handleClearEmoji"
                :baseUrl="config.cdn.baseUrl"
                :closeOnSelect="true"
              >
                <button type="button" class="green-button">
                  <span v-if="selectedEmoji" class="emoji-preview">
                    <img 
                      :src="`${config.cdn.baseUrl}/icons/${selectedEmoji.style}/${selectedEmoji.path}`" 
                      :alt="selectedEmoji.name"
                      width="20"
                      height="20"
                    />
                  </span>
                  <span class="button-text">{{ selectedEmoji ? '更改表情' : '添加表情' }}</span>
                  <i class="icon-add"></i>
                </button>
              </FluentEmojiPicker>
            </div>
          </div>
          
          <!-- 自定义红色按钮 -->
          <div v-if="currentStyle.name === '红色'" class="showcase-item">
            <h4>红色样式</h4>
            <div class="showcase-description">醒目的红色按钮设计</div>
            <div class="showcase-demo">
              <FluentEmojiPicker 
                @select="handleSelectEmoji"
                @clear="handleClearEmoji"
                :baseUrl="config.cdn.baseUrl"
                :closeOnSelect="true"
              >
                <button type="button" class="red-button">
                  <i class="icon-smile"></i>
                  <span v-if="selectedEmoji" class="emoji-preview">
                    <img 
                      :src="`${config.cdn.baseUrl}/icons/${selectedEmoji.style}/${selectedEmoji.path}`" 
                      :alt="selectedEmoji.name"
                      width="20"
                      height="20"
                    />
                  </span>
                </button>
              </FluentEmojiPicker>
            </div>
          </div>
          
          <!-- 自定义图标按钮 -->
          <div v-if="currentStyle.name === '图标'" class="showcase-item">
            <h4>图标按钮</h4>
            <div class="showcase-description">简约的纯图标按钮</div>
            <div class="showcase-demo">
              <FluentEmojiPicker 
                @select="handleSelectEmoji"
                @clear="handleClearEmoji"
                :baseUrl="config.cdn.baseUrl"
                :closeOnSelect="true"
              >
                <button type="button" class="icon-button">
                  <i class="icon-emoji-face"></i>
                </button>
              </FluentEmojiPicker>
            </div>
          </div>
        </div>
        
        <!-- JSON 详细信息卡片 -->
        <div v-if="selectedEmoji" class="detail-card">
          <div class="card-header">
            <h3>表情数据结构</h3>
            <span class="json-badge">JSON</span>
          </div>
          <pre class="emoji-details-code">{{ JSON.stringify(selectedEmoji, null, 2) }}</pre>
        </div>
      </div>
      
      <!-- 右侧代码区域 -->
      <div class="code-area" v-if="currentCode">
        <CodeBlock 
          :code="currentCode" 
          language="vue" 
          :title="currentCodeTitle" 
          :floating="true" 
        />
      </div>
    </div>
</template>

<style scoped>

.example-layout {
  display: flex;
  gap: 24px;
}

.content-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 32px;
  min-width: 0; /* 确保内容区域可以缩小 */
}

.code-area {
  width: 35%;
  min-width: 320px; /* 设置最小宽度 */
}

h2 {
  margin: 0 0 16px;
  color: #2d3748;
  font-size: 1.5rem; /* 减小标题大小 */
  font-weight: 700;
  text-align: center; /* 居中标题 */
  padding: 16px 0; /* 添加上下内边距 */
}

h3 {
  margin: 0 0 16px;
  font-size: 1.2rem; /* 减小副标题大小 */
  color: #2d3748;
  font-weight: 600;
}

h4 {
  margin: 0 0 8px;
  font-size: 1rem; /* 减小小标题大小 */
  color: #2d3748;
}

/* 预览区域改进 */
.preview-section {
  width: 100%;
}

.selected-emoji-preview {
  background: linear-gradient(135deg, #f6f9fc, #edf2f7);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.06);
}

.emoji-display {
  display: flex;
  align-items: center;
  gap: 24px;
}

.emoji-image-container {
  background-color: white;
  padding: 16px;
  border-radius: 16px;
  box-shadow: 0 6px 12px rgba(0,0,0,0.08);
}

.emoji-image-container img {
  display: block;
}

.emoji-info {
  flex-grow: 1;
}

.emoji-title {
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #718096;
  margin-bottom: 4px;
}

.emoji-name {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 8px;
}

.emoji-meta {
  display: flex;
  gap: 8px;
}

.emoji-category, .emoji-style {
  background-color: #e2e8f0;
  color: #4a5568;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 500;
}

.empty-preview {
  background: linear-gradient(135deg, #f6f9fc, #edf2f7);
  border-radius: 16px;
  padding: 40px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0,0,0,0.06);
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.7;
}

.empty-text {
  color: #718096;
  font-size: 1.1rem;
}

/* 按钮样式选择器卡片 */
.style-selector-card {
  background-color: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.06);
}

.style-buttons-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(110px, 1fr)); /* 减小最小宽度 */
  gap: 12px; /* 减小间距 */
}

.style-selector-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  background: #f8fafc;
  border: 2px solid transparent;
  border-radius: 12px;
  padding: 16px 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.style-selector-button:hover {
  background-color: #f1f5f9;
  transform: translateY(-2px);
}

.style-selector-button.active {
  border-color: #3b82f6;
  background-color: #eff6ff;
}

.style-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-size: 20px;
  color: white;
}

.style-icon.blue-button {
  background-color: #3b82f6;
}

.style-icon.green-button {
  background-color: #10b981;
}

.style-icon.red-button {
  background-color: #ef4444;
}

.style-icon.icon-button {
  background-color: #8b5cf6;
}

.style-name {
  font-size: 0.9rem;
  font-weight: 500;
}

/* 按钮展示区域优化 */
.buttons-showcase {
  background-color: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.06);
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.showcase-item {
  padding: 24px;
  border-radius: 12px;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
}

.showcase-description {
  color: #64748b;
  margin-bottom: 16px;
  font-size: 0.9rem;
}

.showcase-demo {
  padding: 24px;
  border: 1px dashed #cbd5e1;
  border-radius: 8px;
  background-color: white;
  display: flex;
  justify-content: center;
}

/* 自定义按钮样式优化 */
.blue-button {
  background-color: #3b82f6;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
}

.blue-button:hover {
  background-color: #2563eb;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(59, 130, 246, 0.4);
}

.green-button {
  background-color: #10b981;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(16, 185, 129, 0.3);
}

.green-button:hover {
  background-color: #059669;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(16, 185, 129, 0.4);
}

.red-button {
  background-color: #ef4444;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(239, 68, 68, 0.3);
}

.red-button:hover {
  background-color: #dc2626;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(239, 68, 68, 0.4);
}

.icon-button {
  background-color: #8b5cf6;
  color: white;
  border: none;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  font-size: 20px;
  box-shadow: 0 2px 4px rgba(139, 92, 246, 0.3);
}

.icon-button:hover {
  background-color: #7c3aed;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(139, 92, 246, 0.4);
}

.button-text {
  font-weight: 500;
}

.emoji-preview {
  display: flex;
  align-items: center;
  justify-content: center;
}

.emoji-preview img {
  border-radius: 4px;
  background-color: rgba(255, 255, 255, 0.3);
  padding: 2px;
}

/* 图标样式 */
.icon-emoji::before {
  content: "😊";
}

.icon-add::before {
  content: "+";
}

.icon-smile::before {
  content: "☺";
}

.icon-emoji-face::before {
  content: "😄";
}

/* JSON详细信息卡片 */
.detail-card {
  background-color: #1e293b;
  border-radius: 16px;
  overflow: hidden;
}

.card-header {
  background-color: #334155;
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  color: white;
  margin: 0;
}

.json-badge {
  background-color: #475569;
  color: #cbd5e1;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-family: monospace;
}

.emoji-details-code {
  margin: 0;
  padding: 24px;
  color: #f1f5f9;
  font-family: monospace;
  font-size: 14px;
  overflow-x: auto;
  background-color: #1e293b;
  line-height: 1.5;
}

/* CDN 配置卡片 */
.cdn-config-card {
  background-color: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.06);
  margin-bottom: 24px;
}

/* 媒体查询适配 */
@media (max-width: 1300px) { /* 提高响应式断点 */
  .example-layout {
    flex-direction: column;
  }
  
  .code-area {
    width: 100%;
    min-width: 0;
  }
}

@media (max-width: 640px) {
  .emoji-display {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .style-buttons-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.code-description {
  color: #64748b;
  margin-bottom: 16px;
  font-size: 0.9rem;
}

.example-card {
  background-color: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.06);
  margin-top: 24px;
}
</style>
