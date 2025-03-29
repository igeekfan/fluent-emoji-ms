<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { filterEmojisByCategories, filterCategories, defaultCategories } from '../data/emoji-utils'
  import EmojiPicker from './EmojiPicker.vue'
  import Popover from './Popover.vue'
  import type { EmojiItem, EmojiItemWithStyle, StyleOption, EmojiCategory } from '../types/emoji.d.ts'

  const props = defineProps({
    // 是否禁用选择器
    disabled: {
      type: Boolean,
      default: false
    },
    // 初始风格
    initialStyle: {
      type: String,
      default: 'modern'
    },
    // 默认表情类别
    defaultCategory: {
      type: String,
      default: 'all'
    },
    // 自定义按钮文本
    buttonText: {
      type: String,
      default: '选择表情'
    },
    // 表情图标基础URL
    baseUrl: {
      type: String,
      default: 'https://cdn.jsdelivr.net/npm/fluentui-emoji@1.1.1'
    },
    // 新增宽度配置
    width: {
      type: [Number, String],
      default: 320
    },
    // 列数配置
    columns: {
      type: Number,
      default: 6
    },
    // 要显示的表情分类
    categories: {
      type: Array as () => string[],
      default: () => defaultCategories
    },
    // 选择表情后是否关闭面板
    closeOnSelect: {
      type: Boolean,
      default: true
    },
    // 是否显示选中的表情区域
    showSelectedEmoji: {
      type: Boolean,
      default: false
    },
    // 自动填充行 - 让每行表情数量自适应
    autoFill: {
      type: Boolean,
      default: true
    },
    // 表情大小
    emojiSize: {
      type: Number,
      default: 28
    },
  })

  const emit = defineEmits<{
    'select': [emoji: EmojiItemWithStyle]
    'clear': []
  }>()

  // 定义风格选项
  const styleOptions = ref([
    { name: "现代", value: "modern" },
    { name: "扁平", value: "flat" },
    { name: "高对比", value: "high-contrast" }
  ])

  // 当前选中的风格
  const selectedStyle = ref<string>(props.initialStyle)

  // 表情数据 - 根据指定分类过滤
  const emojis = computed<EmojiItem[]>(() => filterEmojisByCategories(props.categories))

  // 过滤后的分类列表
  const availableCategories = computed<EmojiCategory[]>(() => {
    // 确保我们有有效的分类数据
    const categories = filterCategories(props.categories);
    console.log('可用分类:', categories);
    return categories;
  })

  // 当前选中的表情分类
  const selectedEmojiCategory = ref(props.defaultCategory)

  // 搜索关键词
  const searchQuery = ref('')

  // 选中的表情
  const selectedEmoji = ref<EmojiItem | null>(null)

  // 控制弹框显示
  const showEmojiPicker = ref(false)

  // 触发元素引用
  const triggerElementRef = ref<HTMLElement | null>(null)

  // 处理表情选择
  const handleEmojiSelect = (emoji: EmojiItem) => {
    selectedEmoji.value = emoji

    // 根据配置决定是否关闭弹框
    if (props.closeOnSelect) {
      showEmojiPicker.value = false
      // 强制重置触发元素引用，确保下次可以正常打开
      setTimeout(() => {
        triggerElementRef.value = null
      }, 100)
    }

    // 创建包含表情和风格的对象
    const emojiWithStyle: EmojiItemWithStyle = {
      ...emoji,
      style: selectedStyle.value // 添加当前选择的风格
    }

    // 发出事件，传递包含风格的表情对象
    emit('select', emojiWithStyle)
  }

  // 打开表情选择器
  const openEmojiPicker = (event: MouseEvent) => {
    if (props.disabled) return

    // 如果已经显示，点击应该关闭它
    if (showEmojiPicker.value) {
      showEmojiPicker.value = false
      return
    }

    // 保存当前触发元素并显示选择器
    triggerElementRef.value = event.currentTarget as HTMLElement
    showEmojiPicker.value = true

    // 确保事件不会冒泡到document上，避免立即关闭
    event.stopPropagation()
  }

  // 关闭表情选择器
  const closeEmojiPicker = () => {
    showEmojiPicker.value = false
  }

  // 修改图片加载器函数，使用配置的baseUrl并添加错误处理
  const myLoader = ({ src, width = 28, quality = 75 }: { src: string, width?: number, quality?: number }) => {
    try {
      if (!src) {
        console.warn('无效的表情路径数据:', { src });
        return '';
      }
      return `${props.baseUrl}/icons/${src}`;
    } catch (error) {
      console.error('图片URL构建错误:', error, width, quality);
      return '';
    }
  }

  // 复制emoji名称到剪贴板
  const copyToClipboard = () => {
    if (!selectedEmoji.value) return

    navigator.clipboard.writeText(selectedEmoji.value.name)
      .then(() => {
        alert('已复制到剪贴板!')
      })
      .catch(err => {
        console.error('复制失败: ', err)
      })
  }

  // 清除选择
  const clearSelection = () => {
    selectedEmoji.value = null
    emit('clear')
  }

  // 修改代码，处理点击类别按钮的逻辑
  const handleCategoryChange = (category: string) => {
    selectedEmojiCategory.value = category
  }

  // 获取风格的显示名称
  const getStyleDisplayName = computed<string>(() => {
    const style = styleOptions.value.find(s => s.value === selectedStyle.value);
    return style ? style.name : selectedStyle.value;
  });

  // 仅用于弹出框宽度
  const popoverWidth = computed(() => {
    if (typeof props.width === 'number') {
      return `${props.width}px`;
    }
    return props.width;
  });
</script>

<template>
  <div class="emoji-picker-container">
    <div class="action-area">
      <!-- 使用默认插槽允许自定义按钮内容, 确保点击事件正确绑定 -->
      <div @click.stop="openEmojiPicker">
        <slot>
          <button type="button"
            class="emoji-picker-button"
            :class="{ active: showEmojiPicker, disabled: disabled }">
            <span>{{ buttonText }}</span>
            <span v-if="selectedEmoji"
              class="selected-emoji-icon-small">
              <img
                :src="myLoader({ src: `${selectedStyle}/${selectedEmoji.path}`, width: 20 })"
                :alt="selectedEmoji.name" />
            </span>
          </button>
        </slot>
      </div>
    </div>

    <!-- 使用Popover组件包装EmojiPicker -->
    <Popover :show="showEmojiPicker"
      :trigger-element="triggerElementRef"
      position="bottom"
      :width="popoverWidth"
      @close="closeEmojiPicker">
      <div class="emoji-toolbar">
        <div class="tabs">
          <button v-for="category in availableCategories"
            :key="category.value"
            :class="['tab-button', { active: selectedEmojiCategory === category.value }]"
            @click="handleCategoryChange(category.value)">
            {{ category.name }}
          </button>
        </div>
        <select v-model="selectedStyle"
          class="style-selector">
          <option v-for="style in styleOptions"
            :key="style.value"
            :value="style.value">
            {{ style.name }}
          </option>
        </select>
      </div>

      <div class="emoji-picker-wrapper">
        <EmojiPicker :emojis="emojis"
          :selectedCategory="selectedStyle"
          :searchQuery="searchQuery"
          :selectedEmojiCategory="selectedEmojiCategory"
          :autoClose="false"
          :baseUrl="baseUrl"
          :width="width"
          :columns="columns"
          :autoFill="autoFill"
          :emojiSize="emojiSize"
          :categories="categories"
          @select-emoji="handleEmojiSelect"
          @close="closeEmojiPicker"
          @change-category="handleCategoryChange" />
      </div>
    </Popover>

    <!-- 只有在showSelectedEmoji为true时才显示选中表情区域 -->
    <div v-if="selectedEmoji && showSelectedEmoji"
      class="selected-emoji-display">
      <img
        :src="myLoader({ src: `${selectedStyle}/${selectedEmoji.path}`, width: 32 })"
        :alt="selectedEmoji.name"
        class="selected-emoji-icon" />
      <div class="emoji-info">
        <div class="emoji-name">{{ selectedEmoji.name }}</div>
        <div class="emoji-style">风格：{{ getStyleDisplayName }}</div>
      </div>
      <div class="emoji-actions">
        <button @click="copyToClipboard"
          class="action-button">
          复制
        </button>
        <button @click="clearSelection"
          class="action-button clear">
          清除
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.emoji-picker-container {
  display: contents; /* 关键修改：使用contents，不参与布局流 */
  position: relative;
}

.action-area {
  position: relative;
  display: inline-block; /* 让按钮区域只占用必要的空间 */
  width: fit-content; /* 确保宽度适应内容 */
}

.emoji-picker-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: 1px solid #ccc;
  background-color: #f0f0f0;
  cursor: pointer;
  font-size: 0.9rem;
  gap: 0.5rem;
  transition: all 0.2s;
  width: fit-content; /* 确保按钮宽度适合内容 */
}

.emoji-picker-button:hover:not(.disabled) {
  background-color: #e0e0e0;
  border-color: #aaa;
}

.emoji-picker-button.active {
  background-color: #e8e8e8;
}

.emoji-picker-button.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.selected-emoji-icon-small {
  display: flex;
  width: 18px;
  /* 减小尺寸从20px到18px */
  height: 18px;
}

.emoji-toolbar {
  display: flex;
  justify-content: space-between;
  padding: 0 0.25rem 0.25rem;
  /* 减少内边距 */
  border-bottom: 1px solid #eee;
  margin-bottom: 0.25rem;
  /* 减少外边距 */
  width: 100%;
  box-sizing: border-box;
  flex-wrap: wrap;
  /* 在小屏幕上允许换行 */
  gap: 4px;
  /* 减少间距从8px到4px */
  flex-shrink: 0;
  /* 防止工具栏被压缩 */
}

/* 修复选项卡样式 - 增加特异性和对比度 */
.tabs {
  display: flex;
  gap: 2px;
  /* 减少间距从4px到2px */
  flex-wrap: wrap;
  /* 允许标签换行 */
}

.tab-button {
  background: none;
  border: none;
  padding: 3px 6px;
  /* 减少内边距从4px 8px到3px 6px */
  font-size: 0.8rem;
  cursor: pointer;
  border-radius: 4px;
  color: #333;
  /* 确保文字颜色足够深 */
}

.tab-button.active {
  background-color: #4d6af2;
  /* 使用主题蓝色 */
  color: white;
  /* 白色文字确保可读性 */
  font-weight: 500;
}

.tab-button:hover:not(.active) {
  background-color: #e8e8e8;
  /* 非激活状态的悬停效果 */
}

.style-selector {
  padding: 2px 4px;
  font-size: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.emoji-picker-wrapper {
  flex-grow: 1;
  width: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.selected-emoji-display {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border: 1px solid #eee;
  border-radius: 4px;
  background-color: #f9f9f9;
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
  z-index: 999;
}

.selected-emoji-icon {
  width: 32px;
  height: 32px;
}

.emoji-info {
  flex-grow: 1;
  min-width: 0;
  /* 允许内容在必要时收缩 */
  display: flex;
  flex-direction: column;
}

.emoji-name {
  font-size: 0.9rem;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.emoji-style {
  font-size: 0.75rem;
  color: #666;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.emoji-actions {
  display: flex;
  gap: 0.3rem;
}

.action-button {
  padding: 0.3rem 0.5rem;
  background-color: #f0f0f0;
  color: #333;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  transition: background-color 0.2s;
}

.action-button:hover {
  background-color: #e0e0e0;
}

.action-button.clear {
  background-color: #fff0f0;
  color: #c00;
  border-color: #fcc;
}

.action-button.clear:hover {
  background-color: #ffe0e0;
}

/* 修改弹出框样式 */
:deep(.popover-content) {
  z-index: 1000;
}
</style>