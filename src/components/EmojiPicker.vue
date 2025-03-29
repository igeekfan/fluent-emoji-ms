<script setup lang="ts">
import { ref, computed } from 'vue'
import type { EmojiItem } from '../types/emoji.d.ts'

// 定义组件的props
const props = defineProps({
  emojis: {
    type: Array as () => EmojiItem[],
    required: true
  },
  selectedCategory: {
    type: String,
    required: true
  },
  searchQuery: {
    type: String,
    default: ''
  },
  selectedEmojiCategory: {
    type: String,
    default: 'all'
  },
  autoClose: {
    type: Boolean,
    default: false
  },
  baseUrl: {
    type: String,
    default: 'https://cdn.jsdelivr.net/npm/fluentui-emoji@1.1.1'
  },
  // 新增宽度配置
  width: {
    type: [Number, String],
    default: 280
  },
  // 列数配置 - 当autoFill为false时使用
  columns: {
    type: Number,
    default: 6
  },
  // 自动填充 - 让每行表情数量根据容器宽度自适应
  autoFill: {
    type: Boolean,
    default: true
  },
  // 表情大小
  emojiSize: {
    type: Number,
    default: 28
  },
  // 添加表情分类顺序配置
  categories: {
    type: Array as () => string[],
    default: () => ['face-emotion', 'people-body', 'animals-nature', 'food-drink', 'travel-places', 'activities', 'objects', 'symbols', 'flags']
  }
})

// 修改emit，添加类别切换事件
const emit = defineEmits<{
  'select-emoji': [emoji: EmojiItem]
  'hover-emoji': [name: string]
  'close': []
  'change-category': [category: string]
}>()

// 悬停的表情
const hoveredEmoji = ref<string>('')

// 根据搜索和分类过滤表情，使用数组循环实现高效排序
const filteredEmojis = computed<EmojiItem[]>(() => {
  // 首先过滤表情
  const filteredItems = props.emojis.filter(emoji => {
    // 根据搜索过滤
    const matchesSearch = props.searchQuery === '' || 
                          emoji.name.toLowerCase().includes(props.searchQuery.toLowerCase())
    
    // 根据类别过滤
    const matchesCategory = props.selectedEmojiCategory === 'all' || 
                            emoji.category === props.selectedEmojiCategory
    
    return matchesSearch && matchesCategory
  });
  
  // 如果不是显示全部表情，或者没有设置分类顺序，直接返回过滤结果
  if (props.selectedEmojiCategory !== 'all' || props.categories.length === 0) {
    return filteredItems;
  }
  
  // 使用分类索引实现高效排序
  // 1. 创建分类映射
  const categoryMap: Record<string, EmojiItem[]> = {};
  
  // 2. 将表情按分类分组
  for (const emoji of filteredItems) {
    if (!categoryMap[emoji.category]) {
      categoryMap[emoji.category] = [];
    }
    categoryMap[emoji.category].push(emoji);
  }
  
  // 3. 按照设定的分类顺序组装结果
  const result: EmojiItem[] = [];
  
  // 先添加指定顺序的分类
  for (const category of props.categories) {
    if (categoryMap[category]) {
      result.push(...categoryMap[category]);
      // 从映射中删除已处理的分类
      delete categoryMap[category];
    }
  }
  
  // 添加其他未指定顺序的分类（如果有）
  for (const category in categoryMap) {
    result.push(...categoryMap[category]);
  }
  
  return result;
})

// 修改图片加载器函数，使用配置的baseUrl
const myLoader = ({ src, width = 28, quality = 75 }: { src: string, width?: number, quality?: number }) => {
  try {
    if (!src) {
      console.warn('无效的表情路径数据:', { src });
      return '';
    }
    // 确保路径格式正确
    return `${props.baseUrl}/icons/${props.selectedCategory}/${src}`;
  } catch (error) {
    console.error('图片URL构建错误:', error);
    return '';
  }
}

// 处理表情选择
const handleEmojiSelect = (emoji: EmojiItem) => {
  emit('select-emoji', emoji)
  // 只有在autoClose为true时才关闭
  if (props.autoClose) {
    emit('close') 
  }
}

// 处理鼠标悬浮
const handleMouseOver = (name: string) => {
  hoveredEmoji.value = name
  emit('hover-emoji', name)
}

const handleMouseLeave = () => {
  hoveredEmoji.value = ''
  emit('hover-emoji', '')

}
// 改进图片加载错误处理
const handleImageError = (event: Event, emoji: EmojiItem): void => {
  const target = event.target as HTMLImageElement;
  console.warn(`表情图片加载失败: ${emoji.name}`, target.src);
  
  // 尝试使用另一种风格作为备用
  const backupStyle = props.selectedCategory === 'modern' ? 'flat' : 'modern';
  target.src = `${props.baseUrl}/icons/${backupStyle}/${emoji.path}`;
  
  // 添加第二次失败的处理
  target.onerror = () => {
    console.error(`备用风格表情图片也加载失败: ${emoji.name}`);
    target.src = `${props.baseUrl}/icons/high-contrast/face-with-spiral-eyes.svg`;
    target.onerror = null; // 防止无限循环
  };
}

// 计算网格模板
const gridTemplateStyle = computed(() => {
  const itemSize = props.emojiSize + 4; // 表情大小 + padding
  
  if (props.autoFill) {
    // 使用auto-fill让浏览器自动决定每行多少列
    return {
      gridTemplateColumns: `repeat(auto-fill, minmax(${itemSize}px, 1fr))`
    };
  } else {
    // 使用固定列数 - 确保在autoFill为false时起效
    return {
      gridTemplateColumns: `repeat(${props.columns}, ${itemSize}px)`
    };
  }
});
</script>

<template>
  <div class="emoji-picker-container" :style="{width: '100%'}">
    <div 
      class="emoji-picker" 
      :style="{
        ...gridTemplateStyle,
        maxWidth: typeof props.width === 'number' ? `${props.width}px` : props.width
      }"
    >
      <div 
        v-for="item in filteredEmojis" 
        :key="item.name"
        class="emoji-item"
        @click="handleEmojiSelect(item)"
        @mouseover="handleMouseOver(item.name)"
        @mouseleave="handleMouseLeave"
        :title="item.name"
      >
        <img 
          :src="myLoader({ src: item.path })"
          :alt="item.name" 
          class="emoji" 
          loading="lazy"
          @error="(e) => handleImageError(e, item)"
        />
      </div>
      
      <!-- 无结果显示 -->
      <div v-if="filteredEmojis.length === 0" class="no-results">
        没有找到匹配的表情符号
      </div>
    </div>
  </div>
</template>

<style scoped>
.emoji-picker-container {
  width: 100%;
  background-color: white;
  border-radius: 8px;
  padding: 4px; /* 减少内边距从8px到4px */
  box-sizing: border-box;
  overflow: hidden;
  /* 确保容器宽度与父元素一致 */
  max-width: inherit;
}

.emoji-picker {
  display: grid;
  gap: 1px;
  max-height: 200px;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
  padding: 2px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
}

/* 自定义滚动条样式 */
.emoji-picker::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.emoji-picker::-webkit-scrollbar-track {
  background: transparent;
}

.emoji-picker::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

.emoji-picker::-webkit-scrollbar-thumb:hover {
  background-color: rgba(0, 0, 0, 0.3);
}

.emoji-item {
  position: relative;
  cursor: pointer;
  padding: 2px;
  border-radius: 4px;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1; /* 保持正方形 */
  min-width: 0; /* 允许项目收缩 */
  box-sizing: border-box;
}

.emoji-item:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.emoji {
  width: v-bind('props.emojiSize + "px"'); /* 动态绑定大小 */
  height: v-bind('props.emojiSize + "px"');
  transition: transform 0.2s;
  flex-shrink: 0;
}

.emoji-item:hover .emoji {
  transform: scale(1.2);
}

.no-results {
  grid-column: 1 / -1;
  padding: 1rem;
  text-align: center;
  color: #888;
  font-size: 0.8rem;
}
</style>
