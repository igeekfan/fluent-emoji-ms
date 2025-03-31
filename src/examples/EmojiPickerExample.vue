<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import EmojiPicker from '../components/EmojiPicker.vue'
import { emojiCategories } from '../data/emoji-categories'
import { filterEmojisByCategories } from '../data/emoji-utils'
import type { EmojiItem } from '../types/emoji.d.ts'
import { useEmojiConfig } from '../plugin'
import CodeBlock from './components/CodeBlock.vue' // 导入 CodeBlock 组件

// 使用全局 CDN 配置
const { config } = useEmojiConfig()

// 当前选择的分类
const selectedCategory = ref('smileys')

// 搜索关键字
const searchQuery = ref('')

// 选中的表情符号
const selectedEmoji = ref<EmojiItem | null>(null)

// 表情风格
const emojiStyle = ref('modern')

// 设置本地默认值，避免依赖config对象上可能不存在的属性
const displayCategories = ['smileys', 'people', 'animals', 'food', 'activities', 'travel', 'places', 'objects', 'symbols', 'flags']
const maxPerCategory = 100

// 获取过滤后的表情列表
const filteredEmojis = computed<EmojiItem[]>(() => {
  // 获取要显示的分类
  const categoriesToFilter = selectedCategory.value === 'all' 
    ? displayCategories 
    : [selectedCategory.value];
  
  // 获取表情列表
  const allEmojis = filterEmojisByCategories(categoriesToFilter);
  
  // 按分类进行分组并限制数量
  const groupedByCategory: Record<string, EmojiItem[]> = {};
  
  allEmojis.forEach(emoji => {
    const category = emoji.category || 'other';
    if (!groupedByCategory[category]) {
      groupedByCategory[category] = [];
    }
    
    if (groupedByCategory[category].length < maxPerCategory) {
      groupedByCategory[category].push(emoji);
    }
  });
  
  // 合并限制后的表情
  const limitedEmojis = Object.values(groupedByCategory).flat();
  
  // 应用搜索过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    return limitedEmojis.filter(emoji => 
      emoji.name.toLowerCase().includes(query) || 
      (emoji.category && emoji.category.toLowerCase().includes(query))
    );
  }
  
  return limitedEmojis;
})

// 可用的分类列表
const availableCategories = computed(() => {
  return [
    { value: 'all', name: '全部', icon: '🌟' },
    ...emojiCategories.filter(cat => 
      cat.value !== 'all' && displayCategories.includes(cat.value)
    )
  ];
})

// 更改选择的类别
const changeCategory = (category: string): void => {
  selectedCategory.value = category;
}

// 处理表情选择
const handleSelectEmoji = (emoji: EmojiItem): void => {
  selectedEmoji.value = emoji;
  console.log('选中表情:', emoji);
}

// 切换表情风格
const changeStyle = (style: string): void => {
  emojiStyle.value = style;
}

// 获取分类图标
const getCategoryIcon = (category: string | undefined): string => {
  if (!category) return '📋';
  const cat = emojiCategories.find(c => c.value === category);
  return cat?.icon || '📋';
}

// 获取分类名称
const getCategoryName = (category: string | undefined): string => {
  if (!category) return '未分类';
  const cat = emojiCategories.find(c => c.value === category);
  return cat?.name || category;
}

// 添加示例代码
const exampleCode = `<template>
  <div>
    <h2>EmojiPicker 基础组件示例</h2>
    
    <!-- 表情风格选择 -->
    <div class="style-selector">
      <span class="label">表情风格:</span>
      <div class="style-buttons">
        <button 
          :class="['style-button', { active: emojiStyle === 'modern' }]" 
          @click="changeStyle('modern')"
        >
          现代风格
        </button>
        <button 
          :class="['style-button', { active: emojiStyle === 'flat' }]" 
          @click="changeStyle('flat')"
        >
          扁平风格
        </button>
        <button 
          :class="['style-button', { active: emojiStyle === 'high-contrast' }]" 
          @click="changeStyle('high-contrast')"
        >
          高对比风格
        </button>
      </div>
    </div>
    
    <!-- 表情分类选择 -->
    <div class="category-selector">
      <div class="category-buttons">
        <button 
          v-for="category in availableCategories" 
          :key="category.value"
          :class="['category-button', { active: selectedCategory === category.value }]"
          @click="changeCategory(category.value)"
        >
          <span class="category-icon">{{ category.icon }}</span>
          <span class="category-name">{{ category.name }}</span>
        </button>
      </div>
    </div>
    
    <!-- 搜索框 -->
    <div class="search-container">
      <input 
        type="text"
        v-model="searchQuery"
        placeholder="搜索表情..."
        class="search-input"
      />
    </div>
    
    <!-- 表情选择器 -->
    <div class="picker-container">
      <EmojiPicker
        :emojis="filteredEmojis"
        :selectedCategory="emojiStyle"
        :selectedEmojiCategory="selectedCategory"
        :searchQuery="searchQuery"
        :baseUrl="cdnBaseUrl"
        :columns="6"
        :width="650"
        @select-emoji="handleSelectEmoji"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { EmojiPicker } from 'fluent-emoji-ms'
import { emojiCategories } from 'fluent-emoji-ms'
import { filterEmojisByCategories } from 'fluent-emoji-ms'

// 当前选择的分类
const selectedCategory = ref('smileys')

// 搜索关键字
const searchQuery = ref('')

// 选中的表情符号
const selectedEmoji = ref(null)

// 表情风格
const emojiStyle = ref('modern')

// CDN 基础URL
const cdnBaseUrl = 'https://cdn.jsdelivr.net/npm/fluentui-emoji@1.1.1'

// 要显示的分类
const displayCategories = ['smileys', 'people', 'animals', 'food', 'activities']

// 获取过滤后的表情列表
const filteredEmojis = computed(() => {
  const categoriesToFilter = selectedCategory.value === 'all' 
    ? displayCategories : [selectedCategory.value]
  
  // 获取表情列表
  return filterEmojisByCategories(categoriesToFilter)
})

// 可用的分类列表
const availableCategories = computed(() => {
  return [
    { value: 'all', name: '全部', icon: '🌟' },
    ...emojiCategories.filter(cat => cat.value !== 'all')
  ]
})

// 更改选择的类别
const changeCategory = (category) => {
  selectedCategory.value = category
}

// 处理表情选择
const handleSelectEmoji = (emoji) => {
  selectedEmoji.value = emoji
  console.log('选中表情:', emoji)
}

// 切换表情风格
const changeStyle = (style) => {
  emojiStyle.value = style
}
<\/script>`

</script>

<template>
  <div>
    <div class="example-layout">
      <!-- 左侧示例区域 -->
      <div class="example-container">
        <!-- 表情风格选择 -->
        <div class="style-selector">
          <span class="label">表情风格:</span>
          <div class="style-buttons">
            <button 
              :class="['style-button', { active: emojiStyle === 'modern' }]" 
              @click="changeStyle('modern')"
            >
              现代风格
            </button>
            <button 
              :class="['style-button', { active: emojiStyle === 'flat' }]" 
              @click="changeStyle('flat')"
            >
              扁平风格
            </button>
            <button 
              :class="['style-button', { active: emojiStyle === 'high-contrast' }]" 
              @click="changeStyle('high-contrast')"
            >
              高对比度风格
            </button>
          </div>
        </div>
        
        <!-- 表情分类选择 -->
        <div class="category-selector">
          <div class="category-buttons">
            <button 
              v-for="category in availableCategories" 
              :key="category.value"
              :class="['category-button', { active: selectedCategory === category.value }]"
              @click="changeCategory(category.value)"
            >
              <span class="category-icon">{{ category.icon }}</span>
              <span class="category-name">{{ category.name }}</span>
            </button>
          </div>
        </div>
        
        <!-- 搜索框 -->
        <div class="search-container">
          <input 
            type="text"
            v-model="searchQuery"
            placeholder="搜索表情..."
            class="search-input"
          />
        </div>
        
        <!-- 表情选择器 - 使用全局 CDN 配置 -->
        <div class="picker-container">
          <EmojiPicker
            :emojis="filteredEmojis"
            :selectedCategory="emojiStyle"
            :selectedEmojiCategory="selectedCategory"
            :searchQuery="searchQuery"
            :baseUrl="config.cdn.baseUrl"
            :columns="6"
            :width="650"
            @select-emoji="handleSelectEmoji"
          />
        </div>
        
        <!-- 限制提示 -->
        <div class="limit-notice">
          注意：为提高加载速度，每个分类最多显示{{ maxPerCategory }}个表情
        </div>
        
        <!-- 选中的表情 - 使用全局 CDN 配置 -->
        <div v-if="selectedEmoji" class="selected-emoji-display">
          <img 
            :src="`${config.cdn.baseUrl}/icons/${emojiStyle}/${selectedEmoji.path}`" 
            :alt="selectedEmoji.name"
            class="selected-emoji"
          />
          <div class="emoji-info">
            <div class="emoji-name">{{ selectedEmoji.name }}</div>
            <div class="emoji-category">
              分类: {{ getCategoryName(selectedEmoji.category) }}
              <span class="category-icon">{{ getCategoryIcon(selectedEmoji.category) }}</span>
            </div>
            <div class="emoji-path">路径: {{ selectedEmoji.path }}</div>
          </div>
        </div>
      </div>
      
      <!-- 右侧代码区域 -->
      <div class="code-area">
        <CodeBlock 
          :code="exampleCode" 
          language="vue" 
          title="EmojiPicker 示例" 
          :floating="true" 
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
h2 {
  margin-bottom: 1.5rem;
  color: #333;
  text-align: center;
}

.example-layout {
  display: flex;
  gap: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.example-container {
  flex: 1;
  padding: 1rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
}

.code-area {
  width: 40%;
}

.style-selector,
.category-selector {
  margin-bottom: 1rem;
}

.label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #555;
}

.style-buttons,
.category-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.category-button,
.style-button {
  padding: 6px 12px;
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 6px;
}

.category-icon {
  font-size: 1.2em;
}

.category-button.active,
.style-button.active {
  background-color: #4a90e2;
  color: white;
  border-color: #4a90e2;
}

.picker-container {
  margin-bottom: 1rem;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 0.5rem;
}

.search-container {
  margin-bottom: 1rem;
}

.search-input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
}

.selected-emoji-display {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1.5rem;
  padding: 1rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  border: 1px solid #eee;
}

.selected-emoji {
  width: 64px;
  height: 64px;
}

.emoji-info {
  flex-grow: 1;
}

.emoji-name {
  font-weight: 600;
  margin-bottom: 0.2rem;
}

.emoji-category,
.emoji-path {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.2rem;
  display: flex;
  align-items: center;
  gap: 6px;
}

.limit-notice {
  font-size: 0.8rem;
  color: #888;
  margin-bottom: 0.5rem;
  text-align: center;
  font-style: italic;
}

.cdn-config-section {
  display: none; /* 隐藏 CDN 配置区块 */
}

/* 添加样式 */
.code-reference {
  margin-top: 2rem;
  padding: 1rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
}

@media (max-width: 1200px) {
  .example-layout {
    flex-direction: column;
  }
  
  .code-area {
    width: 100%;
  }
}
</style>
