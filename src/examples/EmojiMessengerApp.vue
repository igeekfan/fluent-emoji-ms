<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'
import { FluentEmojiPicker, buildEmojiImageUrl, type EmojiItemWithStyle, type EmojiLocale, useEmojiConfig } from '@igeekfan/fluent-emoji-ms-vue'
import CodeBlock from './components/CodeBlock.vue'

type ChatMessage = {
  id: number
  text: string
  sender: 'user' | 'other'
  emojis: EmojiItemWithStyle[]
  timestamp: string
}

type MessageGroup = {
  sender: 'user' | 'other'
  name: string
  messages: ChatMessage[]
}

const props = withDefaults(defineProps<{ locale?: EmojiLocale }>(), {
  locale: 'zh-CN'
})

const { config } = useEmojiConfig()
const locale = computed(() => props.locale)
const textareaRef = ref<HTMLTextAreaElement | null>(null)
const messages = ref<ChatMessage[]>([])
const draft = ref('')
const draftEmojis = ref<EmojiItemWithStyle[]>([])
const username = ref(props.locale === 'en-US' ? 'You' : '我')
const otherUsername = ref(props.locale === 'en-US' ? 'Teammate' : '同事')
const isTyping = ref(false)
const showSettings = ref(false)
const storageKey = 'fluent-emoji-ms-demo-chat'

const text = computed(() => props.locale === 'en-US'
  ? {
      title: 'Emoji Messenger',
      copy: 'This example keeps the richer chat flow from the previous demo while inserting emoji tokens at the current cursor position.',
      clearChat: 'Clear Chat',
      settings: 'Settings',
      placeholder: 'Write a message...',
      packButton: 'Emoji Pack',
      send: 'Send',
      currentDraft: 'Current draft emoji',
      typing: 'is typing...',
      usernames: {
        self: 'Your Name',
        other: 'Other Participant'
      },
      confirmClear: 'Clear all chat history?',
      emptyHint: 'Pick emoji from the floating pack to insert them into the text box and attach them to the outgoing message.',
      codeTitle: 'Chat app integration example'
    }
  : {
      title: 'Emoji Messenger',
      copy: '这个示例保留了旧版更完整的聊天流，同时继续支持从悬浮表情包里把内容插入到当前光标位置。',
      clearChat: '清空聊天',
      settings: '设置',
      placeholder: '输入消息...',
      packButton: '表情包',
      send: '发送',
      currentDraft: '当前草稿表情',
      typing: '正在输入...',
      usernames: {
        self: '我的昵称',
        other: '对方昵称'
      },
      confirmClear: '确定要清空所有聊天记录吗？',
      emptyHint: '从悬浮表情包里选择表情，既会插入到文本框，也会挂到当前待发送消息里。',
      codeTitle: '聊天应用集成示例'
    })

const groupedMessages = computed<MessageGroup[]>(() => {
  return messages.value.reduce<MessageGroup[]>((groups, message) => {
    const lastGroup = groups[groups.length - 1]
    if (!lastGroup || lastGroup.sender !== message.sender) {
      groups.push({
        sender: message.sender,
        name: message.sender === 'user' ? username.value : otherUsername.value,
        messages: [message]
      })
      return groups
    }

    lastGroup.messages.push(message)
    return groups
  }, [])
})

const exampleCode = computed(() => `<textarea ref="textareaRef" v-model="draft" />

<FluentEmojiPicker locale="${props.locale}" preset="reactions" :show-search="false" :close-on-select="false" @select="insertEmojiToken">
  <template #trigger="{ toggleOpen }">
    <button type="button" @click="toggleOpen">${text.value.packButton}</button>
  </template>
</FluentEmojiPicker>`)

function loadMessages() {
  try {
    const savedMessages = localStorage.getItem(storageKey)
    if (savedMessages) {
      messages.value = JSON.parse(savedMessages)
    }
  } catch (error) {
    console.error('Failed to load messages', error)
  }
}

function saveMessages() {
  localStorage.setItem(storageKey, JSON.stringify(messages.value))
}

function seedMessages() {
  if (messages.value.length > 0) {
    return
  }

  messages.value = [
    {
      id: 1,
      sender: 'other',
      text: props.locale === 'en-US' ? 'Can we keep the chat demo closer to a real product flow?' : '这次能把聊天示例做得更接近真实产品吗？',
      emojis: [],
      timestamp: new Date().toISOString()
    },
    {
      id: 2,
      sender: 'user',
      text: props.locale === 'en-US' ? 'Yes, and the emoji pack should insert into the text box before sending.' : '可以，而且表情包要先插入文本框，再决定是否发送。',
      emojis: [],
      timestamp: new Date().toISOString()
    }
  ]
  saveMessages()
}

onMounted(() => {
  loadMessages()
  seedMessages()
})

function insertEmojiToken(emoji: EmojiItemWithStyle) {
  draftEmojis.value.push(emoji)

  const token = `:${emoji.name}:`
  const element = textareaRef.value
  const start = element?.selectionStart ?? draft.value.length
  const end = element?.selectionEnd ?? draft.value.length

  draft.value = `${draft.value.slice(0, start)}${token}${draft.value.slice(end)}`

  nextTick(() => {
    if (!element) {
      return
    }

    element.focus()
    const cursor = start + token.length
    element.setSelectionRange(cursor, cursor)
  })
}

function removeDraftEmoji(index: number) {
  const [removed] = draftEmojis.value.splice(index, 1)
  if (!removed) {
    return
  }

  const token = `:${removed.name}:`
  const tokenIndex = draft.value.indexOf(token)
  if (tokenIndex >= 0) {
    draft.value = `${draft.value.slice(0, tokenIndex)}${draft.value.slice(tokenIndex + token.length)}`
  }
}

function addMessage(textValue: string, sender: 'user' | 'other', emojis: EmojiItemWithStyle[] = []) {
  messages.value.push({
    id: Date.now() + Math.round(Math.random() * 1000),
    sender,
    text: textValue,
    emojis,
    timestamp: new Date().toISOString()
  })
  saveMessages()
}

function simulateResponse() {
  const responses = props.locale === 'en-US'
    ? ['That feels much closer to a real composer.', 'Nice, the emoji preview is clearer now.', 'Keep the richer controls in the demo.']
    : ['这个输入区就更像真实聊天了。', '不错，表情反馈更清晰了。', '这种完整交互更适合放在示例里。']

  isTyping.value = true
  setTimeout(() => {
    isTyping.value = false
    addMessage(responses[Math.floor(Math.random() * responses.length)], 'other')
  }, 1200)
}

function sendMessage() {
  if (!draft.value.trim() && draftEmojis.value.length === 0) {
    return
  }

  addMessage(draft.value.trim(), 'user', [...draftEmojis.value])
  draft.value = ''
  draftEmojis.value = []
  nextTick(() => textareaRef.value?.focus())
  simulateResponse()
}

function clearChat() {
  if (!window.confirm(text.value.confirmClear)) {
    return
  }

  messages.value = []
  saveMessages()
  seedMessages()
}

function formatTime(timestamp: string) {
  return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
</script>

<template>
  <div class="messenger-layout">
    <div class="content-area">
      <section class="chat-card surface-card">
        <div class="chat-header">
          <div>
            <h3>{{ text.title }}</h3>
            <p>{{ text.copy }}</p>
          </div>

          <div class="header-actions">
            <button type="button" class="ghost-button" @click="showSettings = !showSettings">{{ text.settings }}</button>
            <button type="button" class="ghost-button danger" @click="clearChat">{{ text.clearChat }}</button>
          </div>
        </div>

        <div v-if="showSettings" class="settings-panel">
          <label>
            <span>{{ text.usernames.self }}</span>
            <input v-model="username" type="text" />
          </label>
          <label>
            <span>{{ text.usernames.other }}</span>
            <input v-model="otherUsername" type="text" />
          </label>
        </div>

        <div class="messages-container">
          <div v-for="(group, groupIndex) in groupedMessages" :key="`group-${groupIndex}`" class="message-group" :class="group.sender">
            <div class="sender-name">{{ group.name }}</div>

            <div v-for="message in group.messages" :key="message.id" class="message-bubble">
              <p v-if="message.text">{{ message.text }}</p>
              <div v-if="message.emojis.length" class="message-emojis">
                <img
                  v-for="(emoji, index) in message.emojis"
                  :key="`${message.id}-${emoji.name}-${index}`"
                  :src="buildEmojiImageUrl(config.cdn.baseUrl, emoji.style, emoji.path)"
                  :alt="emoji.name"
                  width="24"
                  height="24"
                />
              </div>
              <div class="message-time">{{ formatTime(message.timestamp) }}</div>
            </div>
          </div>

          <div v-if="isTyping" class="typing-indicator">{{ otherUsername }} {{ text.typing }}</div>
        </div>

        <div class="composer-area">
          <div v-if="draftEmojis.length" class="draft-emoji-row">
            <span class="draft-label">{{ text.currentDraft }}</span>
            <div class="draft-chip-list">
              <button v-for="(emoji, index) in draftEmojis" :key="`${emoji.name}-${index}`" type="button" class="draft-chip" @click="removeDraftEmoji(index)">
                <img :src="buildEmojiImageUrl(config.cdn.baseUrl, emoji.style, emoji.path)" :alt="emoji.name" width="20" height="20" />
                <span>{{ emoji.name }}</span>
                <span>×</span>
              </button>
            </div>
          </div>

          <textarea ref="textareaRef" v-model="draft" rows="4" :placeholder="text.placeholder" />

          <div class="composer-actions">
            <FluentEmojiPicker :locale="locale" preset="reactions" :show-search="false" :close-on-select="false" :base-url="config.cdn.baseUrl" @select="insertEmojiToken">
              <template #trigger="{ toggleOpen }">
                <button type="button" class="emoji-pack-button" @click="toggleOpen">{{ text.packButton }}</button>
              </template>
            </FluentEmojiPicker>

            <button type="button" class="send-button" @click="sendMessage">{{ text.send }}</button>
          </div>

          <p class="composer-hint">{{ text.emptyHint }}</p>
        </div>
      </section>
    </div>

    <aside class="code-area">
      <CodeBlock :locale="locale" language="vue" :title="text.codeTitle" :code="exampleCode" />
    </aside>
  </div>
</template>

<style scoped>
.messenger-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) minmax(320px, 0.7fr);
  gap: 24px;
}

.surface-card {
  display: grid;
  gap: 16px;
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}

.chat-header,
.header-actions {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: flex-start;
}

.chat-header h3,
.chat-header p {
  margin: 0;
}

.chat-header p,
.message-time,
.composer-hint,
.sender-name,
.typing-indicator {
  color: #64748b;
}

.ghost-button,
.emoji-pack-button,
.send-button,
.draft-chip {
  cursor: pointer;
}

.ghost-button {
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 999px;
  background: #f9fafb;
}

.ghost-button.danger {
  color: #dc2626;
}

.settings-panel {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.settings-panel label {
  display: grid;
  gap: 8px;
}

.settings-panel input,
.composer-area textarea {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid #d1d5db;
  border-radius: 10px;
}

.messages-container {
  display: grid;
  gap: 16px;
  max-height: 520px;
  overflow: auto;
  padding-right: 4px;
}

.message-group {
  display: grid;
  gap: 8px;
}

.message-group.user {
  justify-items: end;
}

.sender-name {
  font-size: 13px;
}

.message-bubble {
  max-width: 80%;
  display: grid;
  gap: 8px;
  padding: 12px 14px;
  border-radius: 18px;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
}

.message-group.user .message-bubble {
  background: #eff6ff;
  border-color: #bfdbfe;
}

.message-bubble p {
  margin: 0;
  white-space: pre-wrap;
}

.message-emojis {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.message-time {
  font-size: 12px;
}

.composer-area {
  display: grid;
  gap: 12px;
}

.draft-emoji-row {
  display: grid;
  gap: 8px;
}

.draft-label {
  font-size: 13px;
  color: #4b5563;
}

.draft-chip-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.draft-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border: 1px solid #e5e7eb;
  border-radius: 999px;
  background: #f9fafb;
}

.composer-actions {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.emoji-pack-button,
.send-button {
  min-height: 44px;
  padding: 10px 16px;
  border-radius: 999px;
}

.emoji-pack-button {
  border: 1px solid #111827;
  background: white;
  color: #111827;
}

.send-button {
  border: 1px solid #2563eb;
  background: #2563eb;
  color: white;
}

@media (max-width: 1024px) {
  .messenger-layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .chat-header,
  .header-actions,
  .composer-actions,
  .settings-panel {
    grid-template-columns: 1fr;
    flex-direction: column;
  }

  .message-bubble {
    max-width: 100%;
  }
}
</style>
