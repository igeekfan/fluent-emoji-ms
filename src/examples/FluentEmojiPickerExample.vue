<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue'
import FluentEmojiPicker from '../components/FluentEmojiPicker.vue'
import { defaultCategories } from '../data/emoji-utils'
import { emojiCategories } from '../data/emoji-categories'
import { emojiStyles } from '../data/emoji-styles'
import CdnSelector from './components/CdnSelector.vue'
import { useEmojiConfig } from '../plugin'
import CodeBlock from './components/CodeBlock.vue' // 导入 CodeBlock 组件

// 获取全局配置
const { config } = useEmojiConfig()

// 选中的表情
const selectedEmoji = ref<{ name: string, path: string, category?: string, style?: string } | null>(null)

// 配置项示例 - 扩展所有可配置参数，使用全局 CDN 配置
const configOptions = reactive({
  // 基础配置
  initialStyle: 'modern',
  buttonText: '选择表情',
  disabled: false,
  closeOnSelect: true, // 新增配置项：选择后是否关闭
  showSelectedEmoji: false,  // 新增配置项：是否显示选中表情区域
  
  // 布局配置
  width: 320,
  columns: 6,
  
  // 内容配置
  defaultCategory: 'smileys',
  categories: [...defaultCategories], // 复制数组，避免直接修改默认值
  
  // 高级配置 - 使用全局 CDN 配置的值
  get baseUrl() { return config.cdn.baseUrl }
})

// 初始化时同步全局配置
onMounted(() => {
  // 这里可以添加额外的初始化逻辑
})

// 当前激活的配置标签页
const activeTab = ref('basic')

// 可用的分类列表，用于多选框
const availableCategories = emojiCategories.filter(category => category.value !== 'all')

// 示例数据 - 存储多个选中的表情
const selectedEmojis = ref<Array<{ name: string, path: string, category?: string, style: string }>>([])

// 处理表情选择
const handleSelectEmoji = (emoji: { name: string, path: string, category?: string, style?: string }) => {
  selectedEmoji.value = emoji
  
  // 添加到选中列表
  selectedEmojis.value.push({
    ...emoji,
    style: emoji.style || configOptions.initialStyle
  })
  
  console.log('选中表情:', emoji)
}

// 处理清除操作
const handleClearEmoji = () => {
  selectedEmoji.value = null
  console.log('已清除选择')
}

// 移除列表中的特定表情
const removeEmoji = (index: number) => {
  selectedEmojis.value.splice(index, 1)
}

// 重置所有配置到默认值
const resetConfig = () => {
  configOptions.initialStyle = 'modern'
  configOptions.buttonText = '选择表情'
  configOptions.disabled = false
  configOptions.closeOnSelect = true // 重置新增的配置项
  configOptions.showSelectedEmoji = false  // 重置新增配置项
  configOptions.width = 320
  configOptions.columns = 6
  configOptions.defaultCategory = 'smileys'
  configOptions.categories = [...defaultCategories]
}

// 清空选中的表情列表
const clearAllEmojis = () => {
  selectedEmojis.value = []
  selectedEmoji.value = null
}

// 获取风格的中文名称
const getStyleDisplayName = (styleValue: string) => {
  const style = emojiStyles.find(s => s.value === styleValue)
  return style ? style.name : styleValue
}

// 处理分类的切换
const toggleCategory = (category: string) => {
  const index = configOptions.categories.indexOf(category)
  if (index === -1) {
    configOptions.categories.push(category)
  } else {
    configOptions.categories.splice(index, 1)
  }
}

// 分类是否被选中
const isCategorySelected = (category: string) => {
  return configOptions.categories.includes(category)
}

// 选择标签页
const selectTab = (tab: string) => {
  activeTab.value = tab
}

// 获取分类名称
const getCategoryName = (categoryValue: string) => {
  const category = emojiCategories.find(c => c.value === categoryValue)
  return category ? category.name : categoryValue
}

// 是否所有分类都被选中
const isAllCategoriesSelected = computed(() => {
  // 过滤掉 "all" 分类，检查所有其他分类是否都被选中
  return availableCategories.every(cat => configOptions.categories.includes(cat.value))
})

// 全选/取消全选分类
const toggleAllCategories = (select: boolean) => {
  if (select) {
    // 选择所有分类
    configOptions.categories = availableCategories.map(cat => cat.value)
  } else {
    // 至少保留一个分类
    configOptions.categories = ['smileys']
  }
}

// 完整配置示例代码
const fullConfigExampleCode = `<template>
  <FluentEmojiPicker 
    :disabled="false"
    initialStyle="modern"
    defaultCategory="face-emotion"
    buttonText="选择表情"
    :baseUrl="cdnBaseUrl"
    :width="320"
    :columns="6"
    :categories="['face-emotion', 'people-body', 'animals-nature']"
    :closeOnSelect="true"
    :showSelectedEmoji="true"
    :autoFill="true"
    :emojiSize="28"
    @select="handleSelectEmoji"
    @clear="handleClear"
  />
</template>

<script setup>
import { ref } from 'vue'
import { FluentEmojiPicker } from 'fluent-emoji-ms'
import 'fluent-emoji-ms/style.css'

const cdnBaseUrl = 'https://cdn.jsdelivr.net/npm/fluentui-emoji@1.1.1'
const selectedEmoji = ref(null)

function handleSelectEmoji(emoji) {
  selectedEmoji.value = emoji
  console.log('选中表情:', emoji)
}

function handleClear() {
  selectedEmoji.value = null
  console.log('表情已清除')
}
<\/script>`
</script>

<template>
    <div class="example-layout">
      <!-- 示例和配置区域 -->
      <div class="content-area">
        <div class="layout-container">
          <!-- 左侧：配置区域 -->
          <div class="config-area">
            <div class="config-panel">
              <div class="panel-header">
                <h3>组件配置</h3>
                <div class="panel-actions">
                  <button @click="resetConfig" class="action-button reset">恢复默认</button>
                </div>
              </div>
              
              <div class="tabs">
                <div class="tab-headers">
                  <button 
                    v-for="tab in ['basic', 'layout', 'content', 'advanced']"
                    :key="tab"
                    class="tab-header" 
                    :class="{ active: activeTab === tab }"
                    @click="selectTab(tab)"
                  >
                    {{ {'basic': '基础配置', 'layout': '布局配置', 'content': '内容配置', 'advanced': '高级配置'}[tab] }}
                  </button>
                </div>
                
                <div class="tab-content" v-if="activeTab === 'basic'">
                  <div class="config-section">
                    <div class="config-group">
                      <div class="config-option">
                        <label>表情风格:</label>
                        <div class="radio-group">
                          <label v-for="style in emojiStyles" :key="style.value" class="radio-label">
                            <input type="radio" v-model="configOptions.initialStyle" :value="style.value"> 
                            <span class="radio-text">{{ style.name }}</span>
                          </label>
                        </div>
                      </div>
                      
                      <div class="config-option">
                        <label>按钮文本:</label>
                        <input type="text" v-model="configOptions.buttonText" placeholder="选择表情" class="text-input">
                      </div>
                      
                      <div class="config-option checkbox-option">
                        <label class="checkbox-label">
                          <input type="checkbox" v-model="configOptions.disabled"> 
                          <span>禁用选择器</span>
                        </label>
                      </div>
                      
                      <div class="config-option checkbox-option">
                        <label class="checkbox-label">
                          <input type="checkbox" v-model="configOptions.closeOnSelect"> 
                          <span>选择后关闭面板</span>
                        </label>
                      </div>
                      
                      <div class="config-option checkbox-option">
                        <label class="checkbox-label">
                          <input type="checkbox" v-model="configOptions.showSelectedEmoji"> 
                          <span>显示选中表情区域</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="tab-content" v-if="activeTab === 'layout'">
                  <div class="config-section">
                    <div class="config-group">
                      <div class="config-option">
                        <label>选择器宽度:</label>
                        <div class="input-with-unit">
                          <input type="number" v-model.number="configOptions.width" min="200" max="800" class="number-input">
                          <span class="unit">px</span>
                        </div>
                      </div>
                      
                      <div class="config-option">
                        <label>表情列数: <span class="value-badge">{{ configOptions.columns }}</span></label>
                        <input type="range" v-model.number="configOptions.columns" min="4" max="10" step="1" class="range-input">
                        <div class="range-markers">
                          <span>4</span>
                          <span>7</span>
                          <span>10</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="tab-content" v-if="activeTab === 'content'">
                  <div class="config-section">
                    <div class="config-group vertical">
                      <div class="config-option">
                        <label>默认表情类别:</label>
                        <select v-model="configOptions.defaultCategory" class="select-input">
                          <option value="all">全部</option>
                          <option v-for="category in availableCategories" :key="category.value" :value="category.value">
                            {{ category.name }}
                          </option>
                        </select>
                      </div>
                      
                      <div class="config-option">
                        <div class="categories-header">
                          <label>要显示的表情分类:</label>
                          <button 
                            @click="toggleAllCategories(!isAllCategoriesSelected)" 
                            class="small-button"
                          >
                            {{ isAllCategoriesSelected ? '取消全选' : '全选' }}
                          </button>
                        </div>
                        <div class="categories-grid">
                          <label v-for="category in availableCategories" :key="category.value" class="category-checkbox">
                            <input 
                              type="checkbox" 
                              :checked="isCategorySelected(category.value)" 
                              @change="toggleCategory(category.value)"
                            >
                            <span>{{ category.name }}</span>
                          </label>
                        </div>
                      </div>
                      
                      <div class="selected-categories">
                        <label class="subtle-label">已选分类:</label>
                        <div class="selected-categories-tags">
                          <div class="selected-category-tag" v-for="categoryValue in configOptions.categories" :key="categoryValue">
                            {{ getCategoryName(categoryValue) }}
                            <button @click="toggleCategory(categoryValue)" class="remove-tag">×</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="tab-content" v-if="activeTab === 'advanced'">
                  <div class="config-section">
                    <h4>高级选项</h4>
                    <div class="config-group">
                      <div class="config-option full-width">
                        <label>表情图标 CDN:</label>
                        <div class="cdn-info">
                          <div class="cdn-value">{{ configOptions.baseUrl }}</div>
                          <div class="cdn-note">使用全局 CDN 配置，可在页面顶部设置按钮中修改</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 当前配置信息 -->
            <div class="current-config">
              <div class="section-header">
                <h3>配置代码</h3>
                <div class="code-label">JSON</div>
              </div>
              <pre class="config-code">{{ JSON.stringify(configOptions, null, 2) }}</pre>
            </div>
          </div>
          
          <!-- 右侧：预览区域 -->
          <div class="preview-area">
            <!-- 使用FluentEmojiPicker组件，传递所有配置 -->
            <div class="preview-section">
              <h3 class="preview-title">预览效果</h3>
              <div class="picker-container">
                <FluentEmojiPicker 
                  @select="handleSelectEmoji" 
                  @clear="handleClearEmoji" 
                  :initialStyle="configOptions.initialStyle"
                  :buttonText="configOptions.buttonText"
                  :disabled="configOptions.disabled"
                  :width="configOptions.width"
                  :columns="configOptions.columns"
                  :defaultCategory="configOptions.defaultCategory"
                  :categories="configOptions.categories"
                  :baseUrl="configOptions.baseUrl"
                  :closeOnSelect="configOptions.closeOnSelect"
                  :showSelectedEmoji="configOptions.showSelectedEmoji"
                >
                  <!-- 自定义按钮示例 -->
                  <template v-if="false">
                    <button class="custom-emoji-button">
                      <span>{{ configOptions.buttonText }}</span>
                      <span v-if="selectedEmoji" class="emoji-preview">
                        <img 
                          :src="`${configOptions.baseUrl}/icons/${selectedEmoji!.style}/${selectedEmoji!.path}`" 
                          :alt="selectedEmoji!.name"
                          width="20"
                          height="20"
                        />
                      </span>
                    </button>
                  </template>
                </FluentEmojiPicker>
              </div>
            </div>
            
            <!-- 显示多个选中的表情 -->
            <div class="selected-emojis">
              <div class="section-header">
                <h3>已选择的表情 <span class="counter-badge">{{ selectedEmojis.length }}</span></h3>
                <button v-if="selectedEmojis.length > 0" @click="clearAllEmojis" class="action-button clear">
                  清空
                </button>
              </div>
              
              <div v-if="selectedEmojis.length === 0" class="empty-list">
                <div class="empty-icon">🔍</div>
                <div>未选择任何表情</div>
              </div>
              <div v-else class="emoji-container">
                <ul class="emoji-list">
                  <li v-for="(emoji, index) in selectedEmojis" :key="index" class="emoji-list-item">
                    <div class="emoji-list-content">
                      <img 
                        :src="`${configOptions.baseUrl}/icons/${emoji.style}/${emoji.path}`" 
                        :alt="emoji.name"
                        class="emoji-image"
                      >
                      <div class="emoji-details">
                        <span class="emoji-name">{{ emoji.name }}</span>
                        <span class="emoji-style-tag">{{ getStyleDisplayName(emoji.style) }}</span>
                      </div>
                    </div>
                    <button class="remove-button" @click="removeEmoji(index)" title="移除">×</button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <div class="notes">
          <h3>配置选项说明</h3>
          <div class="documentation">
            <div class="doc-section">
              <h4>基础配置</h4>
              <dl class="doc-list">
                <dt><code>initialStyle</code></dt>
                <dd>初始表情风格（modern/flat/high-contrast），默认值: 'modern'</dd>
                
                <dt><code>buttonText</code></dt>
                <dd>自定义按钮文本，默认值: '选择表情'</dd>
                
                <dt><code>disabled</code></dt>
                <dd>是否禁用选择器，默认值: false</dd>
                
                <dt><code>closeOnSelect</code></dt>
                <dd>选择表情后是否自动关闭面板，默认值: true</dd>
                
                <dt><code>showSelectedEmoji</code></dt>
                <dd>是否在组件内显示选中表情区域，默认值: false</dd>
              </dl>
            </div>
            
            <div class="doc-section">
              <h4>布局配置</h4>
              <dl class="doc-list">
                <dt><code>width</code></dt>
                <dd>选择器宽度，可以是数字或CSS宽度字符串，默认值: 280</dd>
                
                <dt><code>columns</code></dt>
                <dd>表情显示的列数，默认值: 6</dd>
              </dl>
            </div>
            
            <div class="doc-section">
              <h4>内容配置</h4>
              <dl class="doc-list">
                <dt><code>defaultCategory</code></dt>
                <dd>默认选中的表情类别，默认值: 'all'</dd>
                
                <dt><code>categories</code></dt>
                <dd>要显示的表情分类列表，默认值: ['smileys', 'symbols', 'animals', 'food']</dd>
              </dl>
            </div>
            
            <div class="doc-section">
              <h4>高级配置</h4>
              <dl class="doc-list">
                <dt><code>baseUrl</code></dt>
                <dd>表情图标CDN的基础URL，默认值: 'https://cdn.jsdelivr.net/npm/fluentui-emoji@1.1.1'</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 右侧代码区域 -->
      <div class="code-area">
        <CodeBlock 
          :code="fullConfigExampleCode" 
          language="vue" 
          title="完整配置示例" 
          :floating="true" 
        />
      </div>
    </div>
</template>

<style scoped>
.example-container {
  max-width: 1500px; /* 增加最大宽度 */
  margin: 0 auto;
  padding: 20px;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
}

.example-layout {
  display: flex;
  gap: 24px;
}

.content-area {
  flex: 1;
  min-width: 0; /* 确保内容区域可以缩小 */
}

.code-area {
  width: 32%;
  min-width: 320px; /* 设置最小宽度 */
}

h2 {
  margin-bottom: 20px;
  color: #333;
  text-align: center;
  font-size: 1.5rem; /* 减小标题大小 */
}

h3 {
  margin-top: 0;
  color: #333;
  font-weight: 600;
}

/* 布局容器 - 左右两栏 */
.layout-container {
  display: grid;
  grid-template-columns: minmax(300px, 2fr) 3fr;
  gap: 24px;
  margin-bottom: 30px;
}

@media (max-width: 768px) {
  .layout-container {
    grid-template-columns: 1fr;
  }
}

/* 左侧配置区域 */
.config-area {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.config-panel {
  background-color: white;
  border-radius: 10px;
  padding: 18px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
  padding-bottom: 12px;
  border-bottom: 1px solid #eee;
}

.panel-actions {
  display: flex;
  gap: 10px;
}

/* 右侧预览区域 */
.preview-area {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.preview-section {
  background-color: white;
  border-radius: 10px;
  padding: 18px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
}

.preview-title {
  margin-bottom: 18px;
  padding-bottom: 12px;
  border-bottom: 1px solid #eee;
}

.picker-container {
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
}

/* 标签页设计优化 */
.tabs {
  position: relative;
}

.tab-headers {
  display: flex;
  margin-bottom: 15px;
  gap: 8px;
  flex-wrap: wrap;
}

.tab-header {
  padding: 8px 15px;
  cursor: pointer;
  background-color: #f5f5f5;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  color: #666;
  transition: all 0.2s;
}

.tab-header.active {
  background-color: #4a90e2;
  color: white;
}

.tab-header:hover:not(.active) {
  background-color: #e8e8e8;
}

.tab-content {
  animation: fadeIn 0.3s;
}

/* 配置区域样式 */
.config-section {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 16px;
}

.config-group {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

.config-group.vertical {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.config-option {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.config-option label {
  font-size: 14px;
  color: #555;
  font-weight: 500;
}

.subtle-label {
  font-size: 13px;
  color: #777;
  margin-bottom: 6px;
}

/* 输入控件样式 */
.text-input, .number-input, .select-input {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.text-input:focus, .number-input:focus, .select-input:focus {
  border-color: #4a90e2;
  outline: none;
  box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
}

.input-with-unit {
  display: flex;
  align-items: stretch;
}

.input-with-unit input {
  flex-grow: 1;
  border-radius: 6px 0 0 6px;
  border-right: none;
}

.unit {
  background-color: #f0f0f0;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-left: none;
  border-radius: 0 6px 6px 0;
  color: #666;
  font-size: 14px;
  display: flex;
  align-items: center;
}

/* 单选框组样式 */
.radio-group {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}

.radio-text {
  font-size: 14px;
}

/* 范围滑块样式 */
.range-input {
  width: 100%;
  margin: 8px 0;
  accent-color: #4a90e2;
}

.range-markers {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #888;
  margin-top: 4px;
}

/* 复选框样式 */
.checkbox-option {
  margin-top: 8px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.checkbox-label span {
  font-size: 14px;
}

/* 分类选择器样式 */
.categories-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.small-button {
  background: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 12px;
  cursor: pointer;
}

.small-button:hover {
  background: #e8e8e8;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 8px;
  max-height: 150px;
  overflow-y: auto;
  padding: 10px;
  background-color: white;
  border: 1px solid #eee;
  border-radius: 6px;
}

.category-checkbox {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  cursor: pointer;
}

.selected-categories {
  margin-top: 6px;
}

.selected-categories-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.selected-category-tag {
  background-color: #e8f0fe;
  color: #4a90e2;
  border: 1px solid #c0d8f3;
  border-radius: 16px;
  padding: 4px 10px;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.remove-tag {
  background: none;
  border: none;
  padding: 0;
  font-size: 14px;
  line-height: 1;
  cursor: pointer;
  color: #4a90e2;
}

/* 注释文本 */
.note {
  font-size: 12px;
  color: #888;
  margin-top: 6px;
}

/* 当前配置展示 */
.current-config {
  background-color: #1e293b;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0,0,0,0.12);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background-color: #0f172a;
}

.current-config .section-header h3 {
  color: white;
  margin: 0;
}

.code-label {
  background-color: #334155;
  color: #94a3b8;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-family: monospace;
}

.config-code {
  margin: 0;
  padding: 16px;
  color: #e2e8f0;
  font-family: monospace;
  font-size: 13px;
  overflow-x: auto;
  white-space: pre-wrap;
  text-align: left; /* 确保配置代码左对齐 */
}

/* 选中的表情列表 */
.selected-emojis {
  background-color: white;
  border-radius: 10px;
  padding: 18px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
}

.selected-emojis .section-header {
  background-color: #4a90e2; /* 使用蓝色背景 */
}

.selected-emojis .section-header h3 {
  color: white; /* 将"已选择的表情"文字改为白色 */
}

.counter-badge {
  background-color: white; /* 调整计数徽章为白底 */
  color: #4a90e2; /* 蓝色文字 */
  padding: 2px 8px;
  border-radius: 20px;
  font-size: 12px;
  margin-left: 8px;
}

.empty-list {
  color: #999;
  text-align: center;
  padding: 30px 15px;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.empty-icon {
  font-size: 24px;
  margin-bottom: 8px;
  opacity: 0.6;
}

.emoji-container {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 4px;
  margin-top: 10px;
}

.emoji-list {
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 300px;
  overflow-y: auto;
  border-radius: 6px;
}

.emoji-list-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  margin: 4px 0;
  border-radius: 6px;
  background-color: white;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  transition: all 0.2s;
}

.emoji-list-item:hover {
  box-shadow: 0 2px 5px rgba(0,0,0,0.08);
  transform: translateY(-1px);
}

.emoji-list-content {
  display: flex;
  align-items: center;
  flex-grow: 1;
}

.emoji-image {
  width: 24px;
  height: 24px;
  border-radius: 4px;
}

.emoji-details {
  margin-left: 10px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.emoji-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.emoji-style-tag {
  font-size: 12px;
  color: #666;
  margin-top: 2px;
}

.remove-button {
  background: none;
  border: none;
  color: #dc3545;
  font-size: 18px;
  cursor: pointer;
  padding: 0 5px;
  opacity: 0.6;
  transition: opacity 0.2s, transform 0.1s;
  margin-left: 8px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.remove-button:hover {
  opacity: 1;
  background-color: #fee2e2;
  transform: scale(1.1);
}

/* 按钮样式 */
.action-button {
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
  border: none;
  background-color: #f0f0f0;
  color: #333;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  transition: all 0.2s;
}

.action-button.reset {
  background-color: #e8f0fe;
  color: #4a90e2;
}

.action-button.reset:hover {
  background-color: #d8e6fd;
}

.action-button.clear {
  background-color: #fee2e2;
  color: #ef4444;
}

.action-button.clear:hover {
  background-color: #fecaca;
}

.value-badge {
  display: inline-block;
  background-color: #4a90e2;
  color: white;
  padding: 1px 6px;
  border-radius: 4px;
  font-size: 12px;
  margin-left: 4px;
}

/* 选项说明部分 */
.notes {
  background-color: white;
  border-radius: 10px;
  padding: 18px;
  margin-top: 20px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
}

.notes h3 {
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #eee;
}

.documentation {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.doc-section {
  margin-bottom: 16px;
}

.doc-section h4 {
  margin-top: 0;
  margin-bottom: 12px;
  font-size: 16px;
  color: #333;
  padding-bottom: 6px;
  border-bottom: 1px solid #eee;
}

.doc-list {
  margin: 0;
}

.doc-list dt {
  font-family: monospace;
  background-color: #f5f5f5;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 14px;
  color: #333;
  display: inline-block;
  margin-bottom: 6px;
  font-weight: bold;
}

.doc-list dd {
  margin-left: 0;
  margin-bottom: 16px;
  font-size: 14px;
  color: #666;
  line-height: 1.5;
}

.doc-list dd:last-child {
  margin-bottom: 0;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.custom-emoji-button {
  background-color: #4a90e2;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  transition: background-color 0.2s;
}

.custom-emoji-button:hover {
  background-color: #3a7bc8;
}

.emoji-preview {
  display: flex;
  align-items: center;
  justify-content: center;
}

.emoji-preview img {
  border-radius: 4px;
}

/* 添加 CDN 信息显示样式 */
.cdn-info {
  background-color: #f9fafb;
  border-radius: 6px;
  padding: 10px 12px;
  border: 1px dashed #cbd5e1;
}

.cdn-value {
  font-family: monospace;
  font-size: 13px;
  color: #334155;
  word-break: break-all;
}

.cdn-note {
  margin-top: 6px;
  font-size: 12px;
  color: #64748b;
  font-style: italic;
}

/* 添加样式 */
.code-reference {
  background-color: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.06);
  margin-top: 24px;
}

@media (max-width: 1400px) {
  .example-layout {
    flex-direction: column;
  }
  
  .code-area {
    width: 100%;
    min-width: 0;
  }
}
</style>
