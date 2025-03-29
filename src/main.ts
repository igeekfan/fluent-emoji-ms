import { createApp } from 'vue'
import App from './App.vue'
import { FluentEmojiPlugin } from './plugin'

const app = createApp(App)

// 使用插件，设置默认 CDN
app.use(FluentEmojiPlugin, {
  baseUrl: 'https://cdn.jsdelivr.net/npm/fluentui-emoji@1.1.1',
  globalComponents: true
})

app.mount('#app')
