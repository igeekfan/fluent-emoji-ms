<script setup lang="ts">
import { ref, computed, markRaw, onMounted } from 'vue'
import { SimpleEmojiPickerExample, EmojiPickerExample, FluentEmojiPickerExample, EmojiMessengerApp, SlotCustomizationExample } from './examples'
import CdnSelector from './examples/components/CdnSelector.vue'
import { useEmojiConfig } from './plugin'

// 全局 CDN 配置
const { config, updateConfig } = useEmojiConfig()
const showCdnConfig = ref(false) // 控制 CDN 配置展示

// 控制显示哪个示例
const currentExample = ref('simple')

// 将组件标记为原始以避免被代理，解决类型问题
const rawComponents = {
  SimpleEmojiPickerExample: markRaw(SimpleEmojiPickerExample),
  EmojiPickerExample: markRaw(EmojiPickerExample),
  FluentEmojiPickerExample: markRaw(FluentEmojiPickerExample),
  SlotCustomizationExample: markRaw(SlotCustomizationExample),
  EmojiMessengerApp: markRaw(EmojiMessengerApp)
}

// 示例选项
const examples = [
  { id: 'simple', name: '基础示例', component: rawComponents.SimpleEmojiPickerExample, description: '展示最基本的表情选择器用法' },
  { id: 'EmojiPicker', name: 'EmojiPicker组件', component: rawComponents.EmojiPickerExample, description: '展示基础EmojiPicker组件的详细用法' },
  { id: 'advanced', name: '高级配置示例', component: rawComponents.FluentEmojiPickerExample, description: '展示表情选择器的全部高级配置选项' },
  { id: 'slots', name: '插槽自定义', component: rawComponents.SlotCustomizationExample, description: '通过插槽自定义表情选择器按钮' },
  { id: 'messenger', name: '聊天应用示例', component: rawComponents.EmojiMessengerApp, description: '在实际聊天应用场景中使用表情选择器' }
]

// 切换示例
const switchExample = (exampleId: string) => {
  currentExample.value = exampleId
}

// 获取当前示例对象
const currentExampleObj = computed(() => {
  return examples.find(example => example.id === currentExample.value) 
    || examples[0]
})

// 更新 CDN 配置
const updateCdnUrl = (newUrl: string) => {
  updateConfig('cdn', { baseUrl: newUrl })
}

// 切换 CDN 配置面板显示
const toggleCdnConfig = () => {
  showCdnConfig.value = !showCdnConfig.value
}

// 页面加载完成后，自动展示 CDN 配置一次
onMounted(() => {
  // 如果是首次访问，显示 CDN 配置
  if (!localStorage.getItem('cdnConfigShown')) {
    showCdnConfig.value = true
    localStorage.setItem('cdnConfigShown', 'true')
  }
})
</script>

<template>
  <div class="app-container">
    <header class="header">
      <div class="header-main">
        <h1 class="title">Fluent Emoji MS 示例</h1>
        <p class="description">Vue 3 组件库，用于在应用中集成微软 Fluent UI 表情符号</p>
      </div>
      
      <div class="header-actions">
        <button @click="toggleCdnConfig" class="cdn-config-toggle" :class="{ active: showCdnConfig }">
          <span class="icon">⚙️</span>
          <span class="text">CDN 设置</span>
        </button>
      </div>
    </header>
    
    <!-- 全局 CDN 配置面板 -->
    <div v-if="showCdnConfig" class="global-cdn-panel">
      <div class="panel-header">
        <h3>全局 CDN 配置</h3>
        <p class="panel-description">所有示例将使用相同的 CDN 配置获取表情图标</p>
        <button @click="toggleCdnConfig" class="close-panel">×</button>
      </div>
      
      <div class="panel-content">
        <CdnSelector 
          :modelValue="config.cdn.baseUrl"
          @update:modelValue="updateCdnUrl"
        />
      </div>
    </div>

    <div class="example-tabs">
      <button 
        v-for="example in examples" 
        :key="example.id"
        :class="['tab-button', { active: currentExample === example.id }]"
        @click="switchExample(example.id)"
      >
        {{ example.name }}
      </button>
    </div>

    <main class="content">
      <div class="example-container">
        <div class="example-header">
          <h2>{{ currentExampleObj.name }}</h2>
          <p>{{ currentExampleObj.description }}</p>
        </div>
        
        <!-- 动态组件，根据currentExample切换 -->
        <component :is="currentExampleObj.component" />
      </div>
    </main>

    <footer class="footer">
      <p>
        <a href="https://github.com/microsoft/fluentui-emoji" target="_blank">Fluent UI Emoji</a> 
        由 Microsoft 提供 | 
        <a href="https://github.com/yourusername/fluent-emoji-ms" target="_blank">Fluent Emoji MS</a>
        组件库
      </p>
      <p>
        <button @click="toggleCdnConfig" class="footer-cdn-button">
          配置 CDN 设置
        </button>
      </p>
    </footer>
  </div>
</template>

<style>
/* 全局样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, sans-serif;
  background-color: #f5f7fa;
  color: #333;
  line-height: 1.6;
}

.app-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/* 头部样式 */
.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 20px 0 20px;
  margin-bottom: 20px;
  border-bottom: 1px solid #e5e8eb;
}

.header-main {
  text-align: center;
  flex-grow: 1;
}

.header-actions {
  display: flex;
  align-items: center;
  margin-left: 20px;
}

.cdn-config-toggle {
  display: flex;
  align-items: center;
  gap: 6px;
  background-color: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 14px;
  color: #4b5563;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cdn-config-toggle.active {
  background-color: #e5edff;
  border-color: #3b82f6;
  color: #3b82f6;
}

.cdn-config-toggle:hover {
  background-color: #e5e7eb;
}

.cdn-config-toggle .icon {
  font-size: 16px;
}

.title {
  font-size: 2.5rem;
  font-weight: 600;
  margin-bottom: 10px;
  color: #2d3748;
}

.description {
  font-size: 1.1rem;
  color: #718096;
  margin-bottom: 25px;
}

.example-tabs {
  display: flex;
  margin-bottom: 20px;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
}

/* 标签页样式可能与组件内部样式冲突，修改其作用域 */
.tab-button {
  padding: 10px 20px;
  font-size: 1rem;
  background-color: #edf2f7;
  border: none;
  border-radius: 6px;
  color: #4a5568;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tab-button:hover {
  background-color: #e2e8f0;
}

.tab-button.active {
  background-color: #4d6af2;
  color: white;
  box-shadow: 0 4px 12px rgba(77, 106, 242, 0.2);
}

/* 内容区域样式 */
.content {
  min-height: 600px;
  margin-bottom: 40px;
}

.example-container {
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 30px;
  overflow: hidden;
}

.example-header {
  margin-bottom: 30px;
  text-align: center;
}

.example-header h2 {
  font-size: 1.8rem;
  color: #2d3748;
  margin-bottom: 10px;
}

.example-header p {
  color: #718096;
  font-size: 1.1rem;
}

/* 页脚样式 */
.footer {
  text-align: center;
  padding: 20px 0;
  color: #718096;
  font-size: 0.9rem;
}

.footer a {
  color: #4d6af2;
  text-decoration: none;
}

.footer a:hover {
  text-decoration: underline;
}

.footer-cdn-button {
  background: none;
  border: none;
  color: #4d6af2;
  text-decoration: underline;
  font-size: 14px;
  cursor: pointer;
  padding: 0;
  margin-top: 8px;
}

.footer-cdn-button:hover {
  color: #3a51c7;
}

/* 响应式样式 */
@media (max-width: 768px) {
  .app-container {
    padding: 15px;
  }
  
  .title {
    font-size: 2rem;
  }
  
  .example-container {
    padding: 20px 15px;
  }
}

/* 添加 CDN 配置面板样式 */
.global-cdn-panel {
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  overflow: hidden;
  position: relative;
  animation: slideDown 0.3s;
}

.panel-header {
  background-color: #f8fafc;
  padding: 16px 20px;
  border-bottom: 1px solid #e2e8f0;
  position: relative;
}

.panel-header h3 {
  margin: 0;
  color: #1e293b;
  font-size: 18px;
  margin-bottom: 4px;
}

.panel-description {
  margin: 0;
  font-size: 14px;
  color: #64748b;
}

.close-panel {
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  font-size: 20px;
  color: #64748b;
  cursor: pointer;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.close-panel:hover {
  background-color: #e2e8f0;
  color: #475569;
}

.panel-content {
  padding: 20px;
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
