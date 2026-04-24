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
| packages/core | @igeekfan/fluent-emoji-ms-core | 共享数据、查询、preset、类型与状态逻辑 |
| packages/vue | @igeekfan/fluent-emoji-ms-vue | Vue 3 组件封装 |
| packages/react | @igeekfan/fluent-emoji-ms-react | React 组件封装 |
| packages/svelte | @igeekfan/fluent-emoji-ms-svelte | Svelte 组件封装 |
| src/examples | - | 预览站示例与文档对照来源 |

## 安装

### 使用仓库进行开发

```bash
pnpm install
pnpm dev
```

### 安装 Vue 包

```bash
pnpm add @igeekfan/fluent-emoji-ms-vue
```

```ts
import '@igeekfan/fluent-emoji-ms-vue/style.css'
```

### 安装 React 包

```bash
pnpm add @igeekfan/fluent-emoji-ms-react
```

```ts
import '@igeekfan/fluent-emoji-ms-react/style.css'
```

### 安装 Svelte 包

```bash
pnpm add @igeekfan/fluent-emoji-ms-svelte
```

```ts
import '@igeekfan/fluent-emoji-ms-svelte/style.css'
```

### 只使用 core 能力

```bash
pnpm add @igeekfan/fluent-emoji-ms-core
```

## 快速开始

### Vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { FluentEmojiPicker, type EmojiItemWithStyle } from '@igeekfan/fluent-emoji-ms-vue'
import '@igeekfan/fluent-emoji-ms-vue/style.css'

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
import { FluentEmojiPicker, type EmojiItemWithStyle } from '@igeekfan/fluent-emoji-ms-react'
import '@igeekfan/fluent-emoji-ms-react/style.css'

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
	import { FluentEmojiPicker } from '@igeekfan/fluent-emoji-ms-svelte'
	import '@igeekfan/fluent-emoji-ms-svelte/style.css'

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

@igeekfan/fluent-emoji-ms-core 当前暴露：

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
```

说明：

- pnpm build：构建全部包和预览站
- pnpm build:packages：只构建 core / vue / react / svelte
- pnpm build:web：只构建预览站
- pnpm test:core：运行 core 测试

## GitHub Actions 发布与部署

本仓库已经移除本地发包和本地 gh-pages 推送脚本，统一改为 GitHub Actions。

### Demo 站点部署

- 工作流文件：[.github/workflows/deploy-pages.yml](.github/workflows/deploy-pages.yml)
- 触发方式：推送到仓库默认分支，或从默认分支手动执行 workflow_dispatch
- 部署方式：使用 GitHub 官方 Pages Actions，从 `dist/web` 上传产物并发布
- 工作流环境：`pages-production`

仓库需要的设置：

1. 在 GitHub Pages 设置中把 Source 改为 GitHub Actions
2. 如果你给 `pages-production` 环境加了保护规则，放行仓库默认分支；当前仓库默认分支是 `master`
3. 保持仓库 Actions 权限允许 workflow 写入 Pages

### npm 发包

- 工作流文件：[.github/workflows/publish-packages.yml](.github/workflows/publish-packages.yml)
- 触发方式：从仓库默认分支手动执行 workflow_dispatch
- 发布顺序：@igeekfan/fluent-emoji-ms-core -> @igeekfan/fluent-emoji-ms-vue -> @igeekfan/fluent-emoji-ms-react -> @igeekfan/fluent-emoji-ms-svelte

首发限制：

- npm 目前不能稳定地用 Trusted Publishing 直接首发“从未存在过”的新包
- 如果这 4 个包在 npm 还没有任何历史版本，请先执行一次 [.github/workflows/bootstrap-publish-packages.yml](.github/workflows/bootstrap-publish-packages.yml)
- 当至少发布过一个版本后，再切回 [.github/workflows/publish-packages.yml](.github/workflows/publish-packages.yml) 走 OIDC Trusted Publishing

首发 bootstrap 工作流：

- 工作流文件：[.github/workflows/bootstrap-publish-packages.yml](.github/workflows/bootstrap-publish-packages.yml)
- 作用：只发布 npm 上还不存在的当前版本，不改版本号，不推 git tag
- 需要的 GitHub Secret：`NPM_PUBLISH_TOKEN`
- token 类型：npm granular access token
- token 权限：允许发布目标包，并开启 bypass 2FA
- 建议：只把这个 token 当作一次性首发引导使用；4 个包首发成功后删除该 secret

包名与账号前置条件：

- 当前 4 个包统一发布到 `@igeekfan` scope 下
- 包名分别是 `@igeekfan/fluent-emoji-ms-core`、`@igeekfan/fluent-emoji-ms-vue`、`@igeekfan/fluent-emoji-ms-react`、`@igeekfan/fluent-emoji-ms-svelte`
- 发布账号应为这些包在 npm 上的实际拥有者；按当前仓库配置，就是 `igeekfan`
- 如果 npm 返回 `Scope not found`，说明 npm 账号 `igeekfan` 侧的 scope 还不可用，或者当前 token 不是该账号创建的

仓库需要的配置：

1. 在 npmjs.com 为下面 4 个包分别配置 Trusted Publisher：
2. `@igeekfan/fluent-emoji-ms-core`
3. `@igeekfan/fluent-emoji-ms-vue`
4. `@igeekfan/fluent-emoji-ms-react`
5. `@igeekfan/fluent-emoji-ms-svelte`
6. 如果仓库有严格的分支保护，允许 GitHub Actions bot 推送版本提交和 tag

npm Trusted Publisher 配置值：

- Provider：GitHub Actions
- Organization or user：`igeekfan`
- Repository：`fluent-emoji-ms`
- Workflow filename：`publish-packages.yml`
- Environment name：留空；当前 workflow 没有使用 npm 发布环境

说明：

- 不再需要 GitHub Actions Secret：`NPM_TOKEN`
- Trusted Publishing 工作流现在会在发布前检查包是否已经存在于 npm；如果还是首发阶段，它会直接提示你先跑 bootstrap workflow
- workflow 现在依赖 GitHub OIDC，要求 GitHub-hosted runner、`id-token: write` 权限、Node 24 和 npm 11
- 四个包的 `package.json` 已补齐 `repository.url` / `repository.directory`，满足 npm Trusted Publishing 的仓库校验要求

发布工作流支持这些输入：

- `version`：直接指定目标版本，例如 `0.2.0`
- `bump`：当 `version` 为空时，按 `patch` / `minor` / `major` / `keep` 计算版本
- `npm_tag`：发布到 npm 的 dist-tag，默认 `latest`
- `generate_emoji_list`：是否先运行 `pnpm generate-emoji-list`

工作流执行内容：

1. 可选运行 `pnpm generate-emoji-list`
2. 同步更新根包和四个 workspace package 的版本号
3. 运行 `pnpm test:core`
4. 运行 `pnpm build:packages`
5. 顺序发布四个 npm 包
6. 推送版本提交并创建 `vX.Y.Z` tag

提示：发布工作流推送版本提交后，会自动触发 Pages 工作流，因此 demo 站点会跟随最新发布提交一起更新。

推荐顺序：

1. 在 npm 网站为 4 个包都配置 Trusted Publisher
2. 新增仓库 Secret：`NPM_PUBLISH_TOKEN`
3. 先运行一次 [.github/workflows/bootstrap-publish-packages.yml](.github/workflows/bootstrap-publish-packages.yml)，把 4 个包的首个版本发到 npm
4. 确认首发成功后删除 `NPM_PUBLISH_TOKEN`
5. 后续版本统一使用 [.github/workflows/publish-packages.yml](.github/workflows/publish-packages.yml)

如果你在 npm 发布日志里看到下面这类错误：

- `Two-factor authentication or granular access token with bypass 2fa enabled is required`
- `For automation or CI/CD uses, please use Trusted Publishing instead`

说明 npm 侧还没把这个包绑定到 Trusted Publisher，或者绑定的 workflow 文件名与 `publish-packages.yml` 不一致。

如果你在 [.github/workflows/publish-packages.yml](.github/workflows/publish-packages.yml) 里看到这类错误：

- `Trusted publishing cannot bootstrap brand-new npm packages that do not exist yet`

说明这些包还没有任何 npm 历史版本。先跑一次 [.github/workflows/bootstrap-publish-packages.yml](.github/workflows/bootstrap-publish-packages.yml) 即可。

如果你看到 “You do not have permission to publish” 之类的错误，先确认当前 `NPM_PUBLISH_TOKEN` 或 Trusted Publisher 绑定的 npm 账号就是 `igeekfan`，并且对 `@igeekfan` scope 具有发布权限。

## License

MIT