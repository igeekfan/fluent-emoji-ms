<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import FluentEmojiPicker from '../components/FluentEmojiPicker.vue'
import CodeBlock from './components/CodeBlock.vue' // 导入 CodeBlock 组件
import type { EmojiItemWithStyle } from '../types/emoji.d.ts'
import { useEmojiConfig } from '../plugin'

// 使用全局 CDN 配置
const { config } = useEmojiConfig()

// 模拟聊天应用状态
interface ChatMessage {
  id: number;
  text: string;
  sender: 'user' | 'other';
  emojis: EmojiItemWithStyle[];
  timestamp: Date;
}

interface MessageGroup {
  sender: 'user' | 'other';
  name: string;
  messages: {
    id: number;
    text: string;
    emojis: EmojiItemWithStyle[];
    timestamp: Date;
  }[];
}

const messages = ref<ChatMessage[]>([])

const messageInput = ref('')
const showEmojiHint = ref(false)
const currentMessageEmojis = ref<EmojiItemWithStyle[]>([])
const username = ref('User')
const otherUsername = ref('Friend')
const isTyping = ref(false)
const showSettings = ref(false)

// 预设消息用于演示
const presetMessages = [
  { text: "嗨，最近怎么样？", sender: 'other' },
  { text: "我很好，谢谢关心！", sender: 'user' },
  { text: "对了，我们可以用表情符号交流", sender: 'other' },
  { text: "是的，这些表情符号太可爱了！", sender: 'user' },
]

// 初始化聊天
onMounted(() => {
  loadMessages()
  
  if (messages.value.length === 0) {
    // 如果没有保存的消息，添加预设消息
    setTimeout(() => {
      presetMessages.forEach((msg, index) => {
        setTimeout(() => {
          addMessage(msg.text, msg.sender as 'user' | 'other')
        }, index * 800)
      })
    }, 500)
  }
})

// 从LocalStorage加载消息
const loadMessages = () => {
  try {
    const savedMessages = localStorage.getItem('emoji-messenger-messages')
    if (savedMessages) {
      const parsed = JSON.parse(savedMessages)
      parsed.forEach((msg: any) => {
        msg.timestamp = new Date(msg.timestamp)
      })
      messages.value = parsed
    }
  } catch (error) {
    console.error('Failed to load messages:', error)
  }
}

// 保存消息到LocalStorage
const saveMessages = () => {
  try {
    localStorage.setItem('emoji-messenger-messages', JSON.stringify(messages.value))
  } catch (error) {
    console.error('Failed to save messages:', error)
  }
}

// 添加消息到聊天
const addMessage = (text: string, sender: 'user' | 'other', emojis: EmojiItemWithStyle[] = []) => {
  const newMessage = {
    id: Date.now(),
    text,
    sender,
    emojis: [...emojis],
    timestamp: new Date()
  }
  
  messages.value.push(newMessage)
  saveMessages()
  
  // 如果是用户消息，模拟对方正在输入的响应
  if (sender === 'user' && Math.random() > 0.3) {
    simulateResponse()
  }
}

// 模拟对方回复
const simulateResponse = () => {
  const responses = [
    "这真的很有趣！",
    "我明白你的意思！",
    "是的，继续...",
    "我喜欢这些表情符号！",
    "这些表情符号太可爱了！",
    "你选的表情真有趣！",
    "哈哈，很形象！"
  ]
  
  isTyping.value = true
  
  setTimeout(() => {
    isTyping.value = false
    const randomResponse = responses[Math.floor(Math.random() * responses.length)]
    addMessage(randomResponse, 'other')
  }, 1000 + Math.random() * 2000)
}

// 发送消息
const sendMessage = () => {
  if (!messageInput.value.trim() && currentMessageEmojis.value.length === 0) return
  
  addMessage(messageInput.value, 'user', currentMessageEmojis.value)
  messageInput.value = ''
  currentMessageEmojis.value = []
  showEmojiHint.value = false
}

// 处理表情选择
const handleSelectEmoji = (emoji: EmojiItemWithStyle) => {
  currentMessageEmojis.value.push(emoji)
  showEmojiHint.value = true
}

// 移除已选择的表情
const removeEmoji = (index: number) => {
  currentMessageEmojis.value.splice(index, 1)
  if (currentMessageEmojis.value.length === 0 && !messageInput.value) {
    showEmojiHint.value = false
  }
}

// 清空聊天记录
const clearChat = () => {
  if (confirm('确定要清空所有聊天记录吗？')) {
    messages.value = []
    saveMessages()
  }
}

// 格式化时间
const formatTime = (date: Date) => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

// 计算已分组的消息
const groupedMessages = computed<MessageGroup[]>(() => {
  const groups: MessageGroup[] = []
  
  let currentGroup: MessageGroup | null = null
  
  messages.value.forEach(message => {
    if (!currentGroup || currentGroup.sender !== message.sender) {
      currentGroup = {
        sender: message.sender,
        name: message.sender === 'user' ? username.value : otherUsername.value,
        messages: []
      }
      groups.push(currentGroup)
    }
    
    currentGroup.messages.push({
      id: message.id,
      text: message.text,
      emojis: message.emojis,
      timestamp: message.timestamp
    })
  })
  
  return groups
})

// 切换设置面板
const toggleSettings = () => {
  showSettings.value = !showSettings.value
}

// 添加示例代码
const messengerExampleCode = `<template>
  <div class="emoji-messenger-app">
    <header class="app-header">
      <h2>Emoji Messenger</h2>
      <button @click="clearChat" class="clear-button">清空聊天</button>
    </header>
    
    <div class="chat-container">
      <div class="messages-container">
        <div v-for="(group, groupIndex) in groupedMessages" :key="\`group-\${groupIndex}\`" 
             :class="['message-group', group.sender]">
          <div class="sender-name">{{ group.name }}</div>
          
          <div v-for="msg in group.messages" :key="msg.id" class="message">
            <div class="message-content">
              <p v-if="msg.text">{{ msg.text }}</p>
              
              <div v-if="msg.emojis && msg.emojis.length > 0" class="message-emojis">
                <div v-for="(emoji, index) in msg.emojis" :key="\`msg-emoji-\${index}\`" class="message-emoji">
                  <img 
                    :src="\`\${cdnBaseUrl}/icons/\${emoji.style}/\${emoji.path}\`" 
                    :alt="emoji.name"
                    :title="emoji.name"
                    width="24"
                    height="24"
                  />
                </div>
              </div>
            </div>
            <div class="message-time">{{ formatTime(msg.timestamp) }}</div>
          </div>
        </div>
      </div>
      
      <div class="message-input-area">
        <div v-if="currentMessageEmojis.length > 0" class="selected-emojis">
          <div v-for="(emoji, index) in currentMessageEmojis" :key="\`current-emoji-\${index}\`" 
               class="selected-emoji">
            <img 
              :src="\`\${cdnBaseUrl}/icons/\${emoji.style}/\${emoji.path}\`" 
              :alt="emoji.name"
              :title="emoji.name"
              width="20"
              height="20"
            />
            <button class="remove-emoji" @click="removeEmoji(index)">&times;</button>
          </div>
        </div>
        
        <div class="input-container">
          <input 
            v-model="messageInput"
            type="text" 
            placeholder="输入消息..."
            @keyup.enter="sendMessage"
          />
          
          <FluentEmojiPicker 
            @select="handleSelectEmoji"
            :width="320"
            :emojiSize="24"
            :closeOnSelect="false"
            :baseUrl="cdnBaseUrl"
            buttonText=""
            initialStyle="flat"
          >
            <button class="emoji-button" title="选择表情">
              <span class="emoji-icon">😊</span>
            </button>
          </FluentEmojiPicker>
          
          <button class="send-button" @click="sendMessage" title="发送">
            发送
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { FluentEmojiPicker } from 'fluent-emoji-ms'
import 'fluent-emoji-ms/style.css'

// CDN 基础URL
const cdnBaseUrl = 'https://cdn.jsdelivr.net/npm/fluentui-emoji@1.1.1'

// 聊天消息数据
const messages = ref([])
const messageInput = ref('')
const currentMessageEmojis = ref([])
const username = ref('User')
const otherUsername = ref('Friend')

// 添加消息到聊天
const addMessage = (text, sender, emojis = []) => {
  messages.value.push({
    id: Date.now(),
    text,
    sender,
    emojis: [...emojis],
    timestamp: new Date()
  })
}

// 发送消息
const sendMessage = () => {
  if (!messageInput.value.trim() && currentMessageEmojis.value.length === 0) return
  
  addMessage(messageInput.value, 'user', currentMessageEmojis.value)
  messageInput.value = ''
  currentMessageEmojis.value = []
}

// 处理表情选择
const handleSelectEmoji = (emoji) => {
  currentMessageEmojis.value.push(emoji)
}

// 移除已选择的表情
const removeEmoji = (index) => {
  currentMessageEmojis.value.splice(index, 1)
}

// 清空聊天记录
const clearChat = () => {
  if (confirm('确定要清空所有聊天记录吗？')) {
    messages.value = []
  }
}

// 格式化时间
const formatTime = (date) => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

// 计算已分组的消息
const groupedMessages = computed(() => {
  const groups = []
  let currentGroup = null
  
  messages.value.forEach(message => {
    if (!currentGroup || currentGroup.sender !== message.sender) {
      currentGroup = {
        sender: message.sender,
        name: message.sender === 'user' ? username.value : otherUsername.value,
        messages: []
      }
      groups.push(currentGroup)
    }
    
    currentGroup.messages.push({
      id: message.id,
      text: message.text,
      emojis: message.emojis,
      timestamp: message.timestamp
    })
  })
  
  return groups
})
<\/script>`
</script>

<template>
  <div class="messenger-page-layout">
    <div class="emoji-messenger-app">
      <header class="app-header">
        <h2>Emoji Messenger</h2>
        <div class="header-controls">
          <button @click="toggleSettings" class="settings-button" title="设置">
            ⚙️
          </button>
          <button @click="clearChat" class="clear-button">清空聊天</button>
        </div>
      </header>
      
      <!-- 设置面板 -->
      <div v-if="showSettings" class="settings-panel">
        <div class="settings-header">
          <h3>应用设置</h3>
          <button @click="toggleSettings" class="close-settings">×</button>
        </div>
        
        <div class="settings-content">
          <div class="setting-group">
            <label>当前 CDN URL:</label>
            <div class="cdn-display">{{ config.cdn.baseUrl }}</div>
            <div class="cdn-note">CDN设置可以在顶部全局设置按钮中更改</div>
          </div>
          
          <div class="setting-group">
            <label>您的用户名:</label>
            <input type="text" v-model="username" class="settings-input" />
          </div>
          
          <div class="setting-group">
            <label>对方用户名:</label>
            <input type="text" v-model="otherUsername" class="settings-input" />
          </div>
        </div>
      </div>
      
      <div class="chat-container">
        <div class="messages-container" ref="messagesContainer">
          <div v-for="(group, groupIndex) in groupedMessages" :key="`group-${groupIndex}`" 
               :class="['message-group', group.sender]">
            <div class="sender-name">{{ group.name }}</div>
            
            <div v-for="msg in group.messages" :key="msg.id" class="message">
              <div class="message-content">
                <p v-if="msg.text">{{ msg.text }}</p>
                
                <div v-if="msg.emojis && msg.emojis.length > 0" class="message-emojis">
                  <div v-for="(emoji, index) in msg.emojis" :key="`msg-emoji-${index}`" 
                       class="message-emoji">
                    <img 
                      :src="`${config.cdn.baseUrl}/icons/${emoji.style}/${emoji.path}`" 
                      :alt="emoji.name"
                      :title="emoji.name"
                      width="24"
                      height="24"
                    />
                  </div>
                </div>
              </div>
              <div class="message-time">{{ formatTime(msg.timestamp) }}</div>
            </div>
          </div>
          
          <div v-if="isTyping" class="typing-indicator">
            <span>{{ otherUsername }} 正在输入</span>
            <span class="dots"><span>.</span><span>.</span><span>.</span></span>
          </div>
        </div>
        
        <div class="message-input-area">
          <div v-if="showEmojiHint && currentMessageEmojis.length > 0" class="selected-emojis">
            <div v-for="(emoji, index) in currentMessageEmojis" :key="`current-emoji-${index}`" 
                 class="selected-emoji">
              <img 
                :src="`${config.cdn.baseUrl}/icons/${emoji.style}/${emoji.path}`" 
                :alt="emoji.name"
                :title="emoji.name"
                width="20"
                height="20"
              />
              <button class="remove-emoji" @click="removeEmoji(index)" title="移除表情">&times;</button>
            </div>
          </div>
          
          <div class="input-container">
            <input 
              v-model="messageInput"
              type="text" 
              placeholder="输入消息..."
              @keyup.enter="sendMessage"
            />
            
            <FluentEmojiPicker 
              @select="handleSelectEmoji"
              :width="320"
              :autoFill="true"
              :emojiSize="24"
              :closeOnSelect="false"
              :baseUrl="config.cdn.baseUrl"
              buttonText=""
              initialStyle="flat"
            >
              <button class="emoji-button" title="选择表情">
                <span class="emoji-icon">😊</span>
              </button>
            </FluentEmojiPicker>
            
            <button class="send-button" @click="sendMessage" title="发送">
              发送
            </button>
          </div>
        </div>
      </div>
      
      <div class="app-info">
        <p>这是一个模拟聊天应用，展示了表情符号选择器的集成。<br>试试选择不同的表情符号并发送消息！</p>
      </div>
    </div>
    
    <!-- 右侧浮动代码示例 -->
    <div class="floating-code-area">
      <CodeBlock 
        :code="messengerExampleCode" 
        language="vue" 
        title="聊天应用集成示例" 
        :floating="true" 
      />
    </div>
    
    <!-- 移除旧的代码参考区域 -->
  </div>
</template>

<style scoped>
.messenger-page-layout {
  max-width: 1500px; /* 增加最大宽度 */
  margin: 0 auto;
  display: flex;
  gap: 24px;
  padding: 20px;
  position: relative;
}

.emoji-messenger-app {
  flex: 1;
  max-width: none; /* 移除最大宽度限制 */
  min-width: 0; /* 确保可以缩小 */
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 700px;
  background: #f8f8f8;
}

.floating-code-area {
  width: 32%;
  min-width: 320px; /* 设置最小宽度 */
}

/* ...existing style... */

/* 移除旧的代码参考样式 */
.app-code-reference {
  display: none;
}

@media (max-width: 1300px) { /* 提高响应式断点 */
  .messenger-page-layout {
    flex-direction: column;
  }
  
  .floating-code-area {
    width: 100%;
    min-width: 0;
  }
}

.app-header {
  background: #4d6af2;
  color: white;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.app-header h2 {
  margin: 0;
  font-weight: 500;
  font-size: 1.3rem; /* 减小头部标题大小 */
}

.clear-button {
  background: rgba(255,255,255,0.2);
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s;
}

.clear-button:hover {
  background: rgba(255,255,255,0.3);
}

.header-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.settings-button {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: white;
  opacity: 0.8;
  transition: opacity 0.2s;
}

.settings-button:hover {
  opacity: 1;
}

.settings-panel {
  background: white;
  border-bottom: 1px solid #eee;
  padding: 0;
  position: relative;
  animation: slideDown 0.3s;
}

.settings-header {
  background: #f0f0f0;
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.settings-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
}

.close-settings {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #666;
}

.settings-content {
  padding: 16px;
}

.setting-group {
  margin-bottom: 16px;
}

.setting-group:last-child {
  margin-bottom: 0;
}

.setting-group label {
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  font-weight: 500;
  color: #555;
}

.settings-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.settings-input:focus {
  outline: none;
  border-color: #4d6af2;
}

.chat-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: white;
  overflow: hidden;
}

.messages-container {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.message-group {
  display: flex;
  flex-direction: column;
  max-width: 80%;
}

.message-group.user {
  align-self: flex-end;
}

.message-group.other {
  align-self: flex-start;
}

.sender-name {
  font-size: 12px;
  color: #888;
  margin-bottom: 4px;
  padding: 0 8px;
}

.message {
  padding: 10px 12px;
  border-radius: 12px;
  position: relative;
  margin-bottom: 4px;
  animation: fadeIn 0.3s;
}

.message-group.user .message {
  background: #e9f2ff;
  border-bottom-right-radius: 4px;
}

.message-group.other .message {
  background: #f0f0f0;
  border-bottom-left-radius: 4px;
}

.message p {
  margin: 0;
  line-height: 1.4;
  white-space: pre-wrap;
  word-break: break-word;
}

.message-time {
  font-size: 10px;
  color: #aaa;
  margin-top: 4px;
  text-align: right;
}

.message-emojis {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 4px;
}

.message-emoji {
  /* background: rgba(255, 255, 255, 0.5); */
  border-radius: 4px;
  padding: 2px;
}

.message-input-area {
  border-top: 1px solid #eee;
  padding: 12px 16px;
  background: white;
}

.selected-emojis {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 8px;
  padding: 6px;
  background: #f9f9f9;
  border-radius: 8px;
}

.selected-emoji {
  position: relative;
  background: white;
  border-radius: 4px;
  padding: 2px;
  border: 1px solid #eee;
}

.remove-emoji {
  position: absolute;
  top: -5px;
  right: -5px;
  width: 14px;
  height: 14px;
  line-height: 10px;
  text-align: center;
  background: #ff5252;
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 10px;
  padding: 0;
  cursor: pointer;
}

.input-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.input-container input {
  flex: 1;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 20px;
  font-size: 14px;
  outline: none;
  transition: border 0.2s;
}

.input-container input:focus {
  border-color: #4d6af2;
}

.emoji-button {
  background: #f0f0f0;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s;
}

.emoji-button:hover {
  background: #e0e0e0;
}

.emoji-icon {
  font-size: 20px;
}

.send-button {
  background: #4d6af2;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.send-button:hover {
  background: #3a51c7;
}

.typing-indicator {
  padding: 8px;
  font-size: 13px;
  color: #888;
  display: flex;
  align-items: center;
}

.dots span {
  animation: dot 1.4s infinite;
  animation-fill-mode: both;
  margin-left: 2px;
}

.dots span:nth-child(2) {
  animation-delay: 0.2s;
}

.dots span:nth-child(3) {
  animation-delay: 0.4s;
}

.app-info {
  padding: 12px;
  text-align: center;
  font-size: 12px;
  background: #f8f8f8;
  color: #888;
  border-top: 1px solid #eee;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes dot {
  0%, 20% { opacity: 0; }
  50% { opacity: 1; }
  100% { opacity: 0; }
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 添加 CDN 显示样式 */
.cdn-display {
  padding: 8px;
  background: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-family: monospace;
  font-size: 13px;
  word-break: break-all;
  margin-bottom: 4px;
}

.cdn-note {
  font-size: 12px;
  color: #666;
  font-style: italic;
}

/* 添加代码参考区域样式 */
.app-code-reference {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin: 20px auto;
  max-width: 800px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

.app-code-reference h3 {
  margin-top: 0;
  font-weight: 500;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.code-description {
  margin-bottom: 15px;
  color: #555;
  font-size: 14px;
}
</style>
