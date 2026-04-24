# Fluent Emoji MS

<div align="right">
	<strong>Language:</strong>
	<a href="./README.md">简体中文</a>
	<span> | </span>
	<a href="./README.en.md">English</a>
</div>

Fluent Emoji MS 是一个面向 Vue、React、Svelte 的 Fluent UI Emoji 组件仓库。仓库采用 pnpm workspace 组织，核心数据与查询逻辑集中在 core 包中，三端组件共享同一套 emoji 数据、preset、搜索、分类过滤与图片地址规则。

预览站位于仓库根目录的 src/examples，当前实际使用的是 workspace 包本身，而不是旧的单体 src 组件实现。

## 功能概览

- 共享 core 数据层：emoji 数据、preset、分类过滤、搜索、render batching
- 三端同名组件：FluentEmojiPicker、EmojiPicker
- 内置三组 preset：basic、reactions、workflow
- 支持 categories、preset、emojiNames 三种集合约束方式
- 高阶组件支持宽度、搜索、风格切换、默认分类、选中摘要
- 低阶组件支持业务方自定义工具栏、搜索框、分类栏和布局
- Vue 额外提供 trigger 插槽，以及 FluentEmojiPlugin / useEmojiConfig 配置能力

## 仓库结构

| 路径 | 包名 | 作用 |
| --- | --- | --- |
| packages/core | @fluent-emoji-ms/core | 共享数据、查询、preset、类型与状态逻辑 |
| packages/vue | @fluent-emoji-ms/vue | Vue 3 组件封装 |
| packages/react | @fluent-emoji-ms/react | React 组件封装 |
| packages/svelte | @fluent-emoji-ms/svelte | Svelte 组件封装 |
| src/examples | - | 预览站示例与文档对照来源 |

## 安装

### 使用仓库进行开发

```bash
pnpm install
pnpm dev
```

### 安装 Vue 包

```bash
pnpm add @fluent-emoji-ms/vue
```

```ts
import '@fluent-emoji-ms/vue/style.css'
```

### 安装 React 包

```bash
pnpm add @fluent-emoji-ms/react
```

```ts
import '@fluent-emoji-ms/react/style.css'
```

### 安装 Svelte 包

```bash
pnpm add @fluent-emoji-ms/svelte
```

```ts
import '@fluent-emoji-ms/svelte/style.css'
```

### 只使用 core 能力

```bash
pnpm add @fluent-emoji-ms/core
```

## 快速开始

### Vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { FluentEmojiPicker, type EmojiItemWithStyle } from '@fluent-emoji-ms/vue'
import '@fluent-emoji-ms/vue/style.css'

const selectedEmoji = ref<EmojiItemWithStyle | null>(null)
</script>

<template>
	<FluentEmojiPicker
		preset="basic"
		button-text="表情包"
		@select="selectedEmoji = $event"
	/>
</template>
```

### React

```tsx
import { useState } from 'react'
import { FluentEmojiPicker, type EmojiItemWithStyle } from '@fluent-emoji-ms/react'
import '@fluent-emoji-ms/react/style.css'

export function App() {
	const [selectedEmoji, setSelectedEmoji] = useState<EmojiItemWithStyle | null>(null)

	return (
		<FluentEmojiPicker
			preset="basic"
			buttonText="Emoji Pack"
			onSelect={setSelectedEmoji}
		/>
	)
}
```

### Svelte

```svelte
<script lang="ts">
	import { FluentEmojiPicker } from '@fluent-emoji-ms/svelte'
	import '@fluent-emoji-ms/svelte/style.css'

	let selectedEmoji = null
</script>

<FluentEmojiPicker preset="basic" buttonText="Emoji Pack" on:select={(event) => (selectedEmoji = event.detail.emoji)} />
```

## 内置预设

| 预设 | 场景 | 说明 |
| --- | --- | --- |
| basic | 默认基础反馈 | 更大的基础表情集合，覆盖点赞、感谢、庆祝、常见心情和聊天高频反馈 |
| reactions | 评论/聊天互动 | 评论区、IM、客服消息、轻互动反馈 |
| workflow | 工作流状态 | 审批、发布、任务流转、状态看板 |

集合优先级如下：

1. emojiNames
2. preset
3. categories
4. defaultCategories

当前 defaultCategories 为：smileys、animals、food、symbols。

## FluentEmojiPicker

高阶组件，负责触发按钮、弹层、搜索、风格切换、分类切换、已选摘要与批量渲染。

### 共享 props

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| disabled | boolean | false | 是否禁用选择器 |
| initialStyle | string | modern | 初始风格 |
| defaultCategory | string | all | 默认激活分类 |
| buttonText | string | 本地化“选择表情” | 默认触发按钮文本 |
| baseUrl | string | jsdelivr fluentui-emoji CDN | 图标基础地址 |
| width | number \| string | 320 | 弹层面板宽度，只控制 popup，不拉伸触发按钮 |
| categories | string[] | defaultCategories | 可见分类范围 |
| preset | basic \| reactions \| workflow | - | 使用内置精选预设 |
| emojiNames | string[] | - | 显式指定一组表情名，优先级高于 preset |
| showSearch | boolean | true | 是否显示搜索框 |
| closeOnSelect | boolean | true | 选择后是否关闭弹层 |
| showSelectedEmoji | boolean | false | 是否显示选中摘要 |
| emojiSize | number | 28 | 图标尺寸 |
| columns | number | 6 | 固定列数，autoFill 为 false 时生效 |
| autoFill | boolean | true | 是否根据面板宽度自动填充网格 |
| renderBatchSize | number | 240 | 每次追加渲染数量 |

### 事件

| 框架 | 事件 |
| --- | --- |
| Vue | @select、@clear |
| React | onSelect、onClear |
| Svelte | on:select、on:clear |

### Vue 专有能力

Vue 版本额外支持 trigger 插槽，用于把触发器换成业务自己的“表情包”按钮、工具栏按钮或输入框入口。

| 插槽 | 参数 |
| --- | --- |
| trigger | toggleOpen、isOpen、selectedEmoji、disabled |

示例：

```vue
<FluentEmojiPicker :width="320" button-text="表情包">
	<template #trigger="{ toggleOpen, disabled }">
		<button type="button" :disabled="disabled" @click="toggleOpen">
			😀 表情包
		</button>
	</template>
</FluentEmojiPicker>
```

### Vue 配置能力

Vue 包还导出了：

- FluentEmojiPlugin
- useEmojiConfig
- config
- updateConfig

这组能力用于注入和更新全局 CDN 配置，预览站中的 CDN 切换即基于它实现。

## EmojiPicker

低阶组件，只负责结果网格与加载更多，不负责触发按钮、搜索输入或分类工具栏。

### 共享 props

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| baseUrl | string | jsdelivr fluentui-emoji CDN | 图标基础地址 |
| width | number \| string | - | 限制低阶网格的最大宽度 |
| selectedStyle | string | modern | 当前风格 |
| categories | string[] | ['all'] | 可见分类范围 |
| preset | basic \| reactions \| workflow | - | 使用内置预设 |
| emojiNames | string[] | - | 显式指定一组表情名 |
| selectedCategory | string | all | 当前激活分类 |
| searchQuery | string | '' | 搜索词 |
| emojiSize | number | 28 | 图标尺寸 |
| columns | number | 6 | 固定列数，autoFill 为 false 时生效 |
| autoFill | boolean | true | 是否自动填充网格 |
| renderLimit | number | 240 | 当前渲染上限 |
| renderBatchSize | number | 240 | 每批加载参考值 |

### 事件

| 框架 | 事件 |
| --- | --- |
| Vue | @select、@load-more |
| React | onSelect、onLoadMore |
| Svelte | on:select、on:loadMore |

## Core 能力

@fluent-emoji-ms/core 当前暴露：

- emojiStyles
- emojiCategories
- defaultCategories
- emojiPresets
- defaultEmojiPreset
- getEmojiPreset
- getEmojiPresets
- queryEmojis
- filterCategories
- buildEmojiImageUrl
- createEmojiPickerState
- DEFAULT_BASE_URL
- DEFAULT_RENDER_BATCH_SIZE

适合这些场景：

- 自己写工具栏或业务布局，只复用查询和数据层
- 只想自己拼接图片地址，不引入 UI 组件
- 在服务端或测试环境中复用 preset、过滤和类型定义

## 搜索与范围建议

推荐按下面顺序决定范围：

1. 先看 basic / reactions / workflow 是否已经覆盖你的入口场景。
2. preset 不够时，再通过 categories 扩大范围。
3. 只有在集合明显变大后，再打开 showSearch 或给 EmojiPicker 传 searchQuery。

## 示例与预览站

当前预览示例来源：

- src/examples/SimpleEmojiPickerExample.vue
- src/examples/EmojiPickerExample.vue
- src/examples/FluentEmojiPickerExample.vue
- src/examples/SlotCustomizationExample.vue
- src/examples/EmojiMessengerApp.vue

这些示例与本文档保持同步。

## 开发命令

```bash
pnpm install
pnpm dev
pnpm build
pnpm build:packages
pnpm build:web
pnpm test:core
pnpm generate-emoji-list
pnpm publish:packages
pnpm release:packages
```

说明：

- pnpm build：构建全部包和预览站
- pnpm build:packages：只构建 core / vue / react / svelte
- pnpm build:web：只构建预览站
- pnpm test:core：运行 core 测试

## 一键发布 packages

当前 workspace 已提供统一发布入口，会按依赖顺序发布：

1. @fluent-emoji-ms/core
2. @fluent-emoji-ms/vue
3. @fluent-emoji-ms/react
4. @fluent-emoji-ms/svelte

常用命令：

```bash
pnpm publish:packages
pnpm release:packages -- --bump patch --yes
pnpm publish:packages -- --version 0.2.0 --tag next
pnpm publish:packages -- --dry-run --skip-login --skip-git-check
```

说明：

- pnpm publish:packages：执行统一多包发布脚本
- pnpm release:packages：先运行 pnpm generate-emoji-list，再走发布流程
- --bump patch|minor|major：统一提升 root 和四个 packages 的版本号
- --version x.y.z：直接指定要发布的版本号
- --yes：跳过交互确认，适合 CI 或真正的一键执行
- --tag next：发布到指定 npm tag
- --dry-run：只打印将要执行的命令，不真正发包
- --skip-test、--skip-build、--skip-login、--skip-git-check：按需跳过对应步骤

## License

MIT