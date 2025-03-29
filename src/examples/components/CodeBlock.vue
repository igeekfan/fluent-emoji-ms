<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
  code: {
    type: String,
    required: true
  },
  language: {
    type: String,
    default: 'html'
  },
  title: {
    type: String,
    default: ''
  },
  floating: {
    type: Boolean,
    default: false
  }
})

const copyStatus = ref('复制')
const isExpanded = ref(false)

function copyCode() {
  navigator.clipboard.writeText(props.code)
    .then(() => {
      copyStatus.value = '已复制!'
      setTimeout(() => {
        copyStatus.value = '复制'
      }, 2000)
    })
    .catch(err => {
      console.error('无法复制:', err)
      copyStatus.value = '复制失败'
    })
}

function toggleCode() {
  isExpanded.value = !isExpanded.value
}
</script>

<template>
  <div class="code-block" :class="{ 'floating': floating }">
    <div class="code-header">
      <div class="header-left">
        <span v-if="title" class="title">{{ title }}</span>
        <button @click="toggleCode" class="toggle-button">
          {{ isExpanded ? '收起代码' : '查看源码' }}
          <span class="toggle-icon">{{ isExpanded ? '▲' : '▼' }}</span>
        </button>
      </div>
      <button v-if="isExpanded" @click="copyCode" class="copy-button">{{ copyStatus }}</button>
    </div>
    <div class="code-container" v-show="isExpanded">
      <pre class="code-content" :class="language"><code>{{ code }}</code></pre>
    </div>
  </div>
</template>

<style scoped>
.code-block {
  margin: 0.5rem 0;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  overflow: hidden;
  background-color: #fff;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  transition: box-shadow 0.2s;
}

.code-block:hover {
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
}

/* 浮动代码块样式 */
.code-block.floating {
  position: sticky;
  top: 24px;
  margin-left: 0;
  width: 100%;
  height: fit-content;
  max-height: calc(100vh - 48px);
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
}

.code-block.floating:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.code-block.floating .code-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  max-height: 70vh;
}

.code-block.floating .code-content {
  flex: 1;
  overflow: auto;
}

.code-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1.25rem;
  background-color: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.title {
  font-weight: 600;
  color: #334155;
  font-size: 0.9rem;
  display: inline-flex;
  align-items: center;
  padding: 0;
  margin: 0;
  height: 32px; /* 与按钮高度一致 */
}

.toggle-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background-color: transparent;
  border: none;
  color: #3b82f6;
  cursor: pointer;
  padding: 6px 12px;
  margin: 0;
  border-radius: 0.25rem;
  font-size: 0.9rem;
  transition: background-color 0.15s;
  font-weight: 500;
  height: 32px; /* 固定高度 */
  line-height: 1; /* 确保文本垂直居中 */
  box-sizing: border-box;
}

.toggle-button:hover {
  background-color: #eff6ff;
}

.toggle-icon {
  font-size: 0.7rem;
  transition: transform 0.15s;
}

.copy-button {
  background-color: #f1f5f9;
  border: none;
  border-radius: 0.25rem;
  padding: 0.5rem 0.75rem;
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.15s;
  font-weight: 500;
  color: #475569;
}

.copy-button:hover {
  background-color: #e2e8f0;
  color: #1e293b;
}

.code-container {
  max-height: 500px;
  overflow: auto;
  background-color: #1e293b;
}

.code-content {
  padding: 1.25rem;
  margin: 0;
  overflow-x: auto;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.9rem;
  line-height: 1.6;
  color: #e2e8f0;
  white-space: pre-wrap;
  text-align: left;
}

/* 针对不同语言的语法高亮 */
.code-content.html, .code-content.vue {
  color: #e2e8f0;
}

.code-content.js, .code-content.javascript, .code-content.ts, .code-content.typescript {
  color: #e2e8f0;
}

.code-content.css {
  color: #e2e8f0;
}

@media (max-width: 1400px) {
  .code-block.floating {
    position: static;
    max-height: none;
  }
}
</style>
