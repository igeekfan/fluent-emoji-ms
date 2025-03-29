<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  position: {
    type: String,
    default: 'bottom' // 'top', 'bottom', 'left', 'right'
  },
  triggerElement: {
    type: Object as () => HTMLElement | null,
    default: null
  },
  offset: {
    type: Number,
    default: 10
  },
  // 新增宽度属性
  width: {
    type: [String, Number],
    default: 'auto'
  }
})

const emit = defineEmits(['close'])

const popoverRef = ref<HTMLElement | null>(null)

// 处理点击外部关闭弹框
const handleClickOutside = (event: MouseEvent) => {
  // 增加对无效引用的检查
  if (!props.show) return
  
  if (popoverRef.value && !popoverRef.value.contains(event.target as Node) && 
      props.triggerElement && !props.triggerElement.contains(event.target as Node)) {
    emit('close')
  }
}

// 定位弹框
const positionPopover = () => {
  if (!popoverRef.value || !props.triggerElement) return
  
  const triggerRect = props.triggerElement.getBoundingClientRect()
  
  // 先计算位置，但不显示
  popoverRef.value.style.visibility = 'hidden'
  popoverRef.value.style.display = 'block'
  popoverRef.value.style.position = 'fixed'
  
  // 应用自定义宽度设置，确保这里使用的宽度值正确
  if (props.width !== 'auto') {
    const widthValue = typeof props.width === 'number' 
      ? `${props.width}px` 
      : props.width;
    
    popoverRef.value.style.width = widthValue;
    console.log(`设置弹框宽度为: ${widthValue}`);
  }
  
  // 获取弹窗尺寸前先等待DOM更新
  requestAnimationFrame(() => {
    const popoverRect = popoverRef.value!.getBoundingClientRect()
    
    // 根据位置决定弹框的坐标
    switch (props.position) {
      case 'bottom':
        popoverRef.value!.style.top = `${triggerRect.bottom + props.offset}px`
        // 修改这里：直接左对齐，不再居中
        popoverRef.value!.style.left = `${triggerRect.left}px`
        break
      case 'top':
        popoverRef.value!.style.bottom = `${window.innerHeight - triggerRect.top + props.offset}px`
        popoverRef.value!.style.left = `${triggerRect.left + (triggerRect.width - popoverRect.width) / 2}px`
        break
      case 'left':
        popoverRef.value!.style.right = `${window.innerWidth - triggerRect.left + props.offset}px`
        popoverRef.value!.style.top = `${triggerRect.top + (triggerRect.height - popoverRect.height) / 2}px`
        break
      case 'right':
        popoverRef.value!.style.left = `${triggerRect.right + props.offset}px`
        popoverRef.value!.style.top = `${triggerRect.top + (triggerRect.height - popoverRect.height) / 2}px`
        break
    }
  
    // 确保弹框不会超出视口
    const updatedRect = popoverRef.value!.getBoundingClientRect()
    
    if (updatedRect.left < 10) {
      popoverRef.value!.style.left = '10px'
    } else if (updatedRect.right > window.innerWidth - 10) {
      popoverRef.value!.style.left = `${window.innerWidth - updatedRect.width - 10}px`
    }
    
    if (updatedRect.top < 10) {
      popoverRef.value!.style.top = '10px'
    } else if (updatedRect.bottom > window.innerHeight - 10) {
      popoverRef.value!.style.top = `${window.innerHeight - updatedRect.height - 10}px`
    }
    
    // 一次性显示弹框，避免闪烁
    popoverRef.value!.style.visibility = 'visible'
  })
}

// 修改监听器添加方式，使用完整函数
const setupListeners = () => {
  if (props.show) {
    // 使用setTimeout确保在下一个事件循环中添加监听器，避免冲突
    setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside)
    }, 0)
    requestAnimationFrame(positionPopover)
  } else {
    document.removeEventListener('mousedown', handleClickOutside)
  }
}

watch(() => props.show, setupListeners, { immediate: true })

onMounted(() => {
  if (props.show) {
    setupListeners()
  }
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
})

// 监听窗口大小变化
window.addEventListener('resize', () => {
  if (props.show && popoverRef.value) {
    requestAnimationFrame(positionPopover)
  }
})

// 删除有问题的popoverStyle计算属性
// 不再需要该计算属性，因为我们在positionPopover函数中直接设置了样式

</script>

<template>
  <Teleport to="body">
    <div v-if="show" 
      class="popover-wrapper" 
      ref="popoverRef"
      @click.stop
    >
      <!-- 删除不存在的:style绑定 -->
      <div class="popover-content">
        <slot></slot>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.popover-wrapper {
  position: absolute;
  z-index: 1000;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.15);
  max-width: 90vw;
  box-sizing: border-box;
  overflow: hidden; /* 防止内容溢出 */
}

.popover-container {
  position: fixed;
  z-index: 1000;
  pointer-events: auto;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  background: white;
  max-width: calc(100vw - 20px); /* 确保不超过视口宽度 */
  max-height: 80vh; /* 控制最大高度 */
  overflow: hidden; /* 防止内容溢出 */
  transform-origin: top center;
  /* width 现在通过内联样式控制 */
}

/* 删除pop-in动画 */

.popover-content {
  overflow-y: auto;
  overflow-x: hidden; /* 防止横向滚动 */
  padding: 0.25rem; /* 减少内边距 */
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  min-width: 0; /* 允许内容收缩 */
}

.popover-content.bottom::before {
  content: '';
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  border-width: 0 10px 10px;
  border-style: solid;
  border-color: transparent transparent white;
}

.popover-content.top::before {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  border-width: 10px 10px 0;
  border-style: solid;
  border-color: white transparent transparent;
}

.popover-content.left::before {
  content: '';
  position: absolute;
  right: -10px;
  top: 50%;
  transform: translateY(-50%);
  border-width: 10px 0 10px 10px;
  border-style: solid;
  border-color: transparent transparent transparent white;
}

.popover-content.right::before {
  content: '';
  position: absolute;
  left: -10px;
  top: 50%;
  transform: translateY(-50%);
  border-width: 10px 10px 10px 0;
  border-style: solid;
  border-color: transparent white transparent transparent;
}
</style>
