<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'

const props = withDefaults(defineProps<{
  show?: boolean
  triggerElement?: HTMLElement | null
  offset?: number
  width?: string | number
}>(), {
  show: false,
  triggerElement: null,
  offset: 10,
  width: 'auto'
})

const emit = defineEmits<{
  close: []
}>()

const popoverRef = ref<HTMLElement | null>(null)

function handleClickOutside(event: MouseEvent) {
  if (!props.show) {
    return
  }

  const target = event.target as Node
  if (
    popoverRef.value &&
    !popoverRef.value.contains(target) &&
    props.triggerElement &&
    !props.triggerElement.contains(target)
  ) {
    emit('close')
  }
}

function positionPopover() {
  if (!popoverRef.value || !props.triggerElement) {
    return
  }

  const triggerRect = props.triggerElement.getBoundingClientRect()
  const popover = popoverRef.value

  popover.style.visibility = 'hidden'
  popover.style.display = 'block'
  popover.style.position = 'fixed'

  if (props.width !== 'auto') {
    popover.style.width = typeof props.width === 'number' ? `${props.width}px` : props.width
  }

  requestAnimationFrame(() => {
    const rect = popover.getBoundingClientRect()
    let left = triggerRect.left
    let top = triggerRect.bottom + props.offset

    if (left + rect.width > window.innerWidth - 10) {
      left = Math.max(10, window.innerWidth - rect.width - 10)
    }

    if (top + rect.height > window.innerHeight - 10) {
      top = Math.max(10, triggerRect.top - rect.height - props.offset)
    }

    popover.style.left = `${left}px`
    popover.style.top = `${top}px`
    popover.style.visibility = 'visible'
  })
}

function syncListeners() {
  if (props.show) {
    setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside)
    }, 0)
    requestAnimationFrame(positionPopover)
    return
  }

  document.removeEventListener('mousedown', handleClickOutside)
}

watch(() => props.show, syncListeners, { immediate: true })

onMounted(() => {
  if (props.show) {
    syncListeners()
  }

  window.addEventListener('resize', positionPopover)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
  window.removeEventListener('resize', positionPopover)
})
</script>

<template>
  <Teleport to="body">
    <div v-if="show" ref="popoverRef" class="popover-wrapper" @click.stop>
      <div class="popover-content">
        <slot />
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.popover-wrapper {
  z-index: 1000;
  max-width: calc(100vw - 20px);
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 20px 48px rgba(15, 23, 42, 0.18);
  border: 1px solid #e2e8f0;
  overflow: hidden;
}

.popover-content {
  padding: 10px;
}
</style>