# Fluent Emoji MS

<div align="right">
  <strong>Language:</strong>
  <a href="./README.md">简体中文</a>
  <span> | </span>
  <a href="./README.en.md">English</a>
</div>

Fluent Emoji MS is a Fluent UI Emoji component workspace for Vue, React, and Svelte. The repository is organized as a pnpm workspace, with shared emoji data, presets, query logic, filtering, and image URL helpers living in the core package.

The demo site under src/examples consumes the workspace packages directly. It is the current source of truth for the examples documented here.

## Feature Overview

- Shared core data layer for emoji metadata, presets, filtering, search, and render batching
- Matching component names across frameworks: FluentEmojiPicker and EmojiPicker
- Three built-in presets: basic, reactions, workflow
- Three collection-scope strategies: categories, preset, and emojiNames
- High-level picker with popup, search, style switcher, category switcher, and selected summary
- Low-level picker for custom business toolbars and custom layouts
- Vue-specific trigger slot and Vue-specific config helpers through FluentEmojiPlugin / useEmojiConfig

## Workspace Packages

| Path | Package | Purpose |
| --- | --- | --- |
| packages/core | @igeekfan/fluent-emoji-ms-core | Shared data, types, presets, filtering, and state logic |
| packages/vue | @igeekfan/fluent-emoji-ms-vue | Vue 3 components |
| packages/react | @igeekfan/fluent-emoji-ms-react | React components |
| packages/svelte | @igeekfan/fluent-emoji-ms-svelte | Svelte components |
| src/examples | - | Demo site examples |

## Installation

### Develop inside the repository

```bash
pnpm install
pnpm dev
```

### Vue package

```bash
pnpm add @igeekfan/fluent-emoji-ms-vue
```

```ts
import '@igeekfan/fluent-emoji-ms-vue/style.css'
```

### React package

```bash
pnpm add @igeekfan/fluent-emoji-ms-react
```

```ts
import '@igeekfan/fluent-emoji-ms-react/style.css'
```

### Svelte package

```bash
pnpm add @igeekfan/fluent-emoji-ms-svelte
```

```ts
import '@igeekfan/fluent-emoji-ms-svelte/style.css'
```

### Core only

```bash
pnpm add @igeekfan/fluent-emoji-ms-core
```

## Quick Start

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
    button-text="Emoji Pack"
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

## Built-in Presets

| Preset | Best for | Description |
| --- | --- | --- |
| basic | Default everyday reactions | A broader starter set for likes, thanks, celebration, common moods, and frequent chat reactions |
| reactions | Comments and chat | Quick feedback for comment bars, IM threads, and support messages |
| workflow | Productive status flows | Approvals, release updates, task transitions, and status dashboards |

Collection priority:

1. emojiNames
2. preset
3. categories
4. defaultCategories

Current defaultCategories values are: smileys, animals, food, symbols.

## FluentEmojiPicker

The high-level picker handles the trigger button, popup, search, style switcher, category switcher, selected summary, and progressive rendering.

### Shared props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| disabled | boolean | false | Disable the picker |
| initialStyle | string | modern | Initial emoji style |
| defaultCategory | string | all | Default active category |
| buttonText | string | localized “Pick Emoji” | Default trigger text |
| baseUrl | string | jsdelivr fluentui-emoji CDN | Emoji asset base URL |
| width | number \| string | 320 | Popup panel width only; it does not stretch the trigger button |
| categories | string[] | defaultCategories | Visible category scope |
| preset | basic \| reactions \| workflow | - | Built-in preset |
| emojiNames | string[] | - | Explicit emoji names, higher priority than preset |
| showSearch | boolean | true | Show search input |
| closeOnSelect | boolean | true | Close popup after selection |
| showSelectedEmoji | boolean | false | Show selected summary |
| emojiSize | number | 28 | Emoji icon size |
| columns | number | 6 | Fixed column count when autoFill is false |
| autoFill | boolean | true | Auto-fill the grid based on popup width |
| renderBatchSize | number | 240 | Progressive render batch size |

### Events

| Framework | Events |
| --- | --- |
| Vue | @select, @clear |
| React | onSelect, onClear |
| Svelte | on:select, on:clear |

### Vue-only slot

The Vue package additionally exposes a trigger slot, which is useful for replacing the default trigger with an emoji-pack button, toolbar action, or composer entry point.

| Slot | Parameters |
| --- | --- |
| trigger | toggleOpen, isOpen, selectedEmoji, disabled |

Example:

```vue
<FluentEmojiPicker :width="320" button-text="Emoji Pack">
  <template #trigger="{ toggleOpen, disabled }">
    <button type="button" :disabled="disabled" @click="toggleOpen">
      😀 Emoji Pack
    </button>
  </template>
</FluentEmojiPicker>
```

### Vue-only config helpers

The Vue package also exports:

- FluentEmojiPlugin
- useEmojiConfig
- config
- updateConfig

These helpers are used by the demo to manage the shared CDN setting.

## EmojiPicker

The low-level picker only renders the results grid and the load-more action. It does not render a trigger, search field, or category toolbar.

### Shared props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| baseUrl | string | jsdelivr fluentui-emoji CDN | Emoji asset base URL |
| width | number \| string | - | Caps the low-level grid width |
| selectedStyle | string | modern | Current style |
| categories | string[] | ['all'] | Visible category scope |
| preset | basic \| reactions \| workflow | - | Built-in preset |
| emojiNames | string[] | - | Explicit emoji names |
| selectedCategory | string | all | Current active category |
| searchQuery | string | '' | Search text |
| emojiSize | number | 28 | Emoji size |
| columns | number | 6 | Fixed column count when autoFill is false |
| autoFill | boolean | true | Auto-fill the grid |
| renderLimit | number | 240 | Current render limit |
| renderBatchSize | number | 240 | Suggested load-more step |

### Events

| Framework | Events |
| --- | --- |
| Vue | @select, @load-more |
| React | onSelect, onLoadMore |
| Svelte | on:select, on:loadMore |

## Core Exports

@igeekfan/fluent-emoji-ms-core currently exports:

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

This package is useful when you want to:

- Build your own business layout while reusing the emoji query layer
- Generate image URLs without importing UI components
- Reuse shared presets, filtering logic, and types in tests or server-side utilities

## Search and Scope Guidance

Recommended decision flow:

1. Start with basic, reactions, or workflow if one already matches your use case.
2. Expand to categories when presets are too narrow.
3. Only turn on showSearch or pass searchQuery once the visible collection becomes large enough.

## Demo and Example Sources

Current demo examples:

- src/examples/SimpleEmojiPickerExample.vue
- src/examples/EmojiPickerExample.vue
- src/examples/FluentEmojiPickerExample.vue
- src/examples/SlotCustomizationExample.vue
- src/examples/EmojiMessengerApp.vue

These files stay aligned with the live demo and this documentation.

## Development Commands

```bash
pnpm install
pnpm dev
pnpm build
pnpm build:packages
pnpm build:web
pnpm test:core
pnpm generate-emoji-list
```

Notes:

- pnpm build builds all packages and the demo site
- pnpm build:packages only builds core, vue, react, and svelte
- pnpm build:web only builds the demo site
- pnpm test:core runs the core package tests

## GitHub Actions Release and Deployment

This repository no longer uses local publish scripts or local gh-pages push scripts. Package publishing and demo deployment are now handled by GitHub Actions.

### Demo site deployment

- Workflow: [.github/workflows/deploy-pages.yml](.github/workflows/deploy-pages.yml)
- Trigger: pushes to the repository default branch, plus manual workflow_dispatch from the default branch
- Deployment mode: official GitHub Pages Actions, publishing the `dist/web` artifact
- Workflow environment: `pages-production`

Required repository settings:

1. Set GitHub Pages source to GitHub Actions
2. If you add protection rules to the `pages-production` environment, allow the repository default branch; in this repository the current default branch is `master`
3. Keep Actions permissions enabled for Pages deployment

### npm publishing

- Workflow: [.github/workflows/publish-packages.yml](.github/workflows/publish-packages.yml)
- Trigger: manual workflow_dispatch from the repository default branch
- Publish order: @igeekfan/fluent-emoji-ms-core -> @igeekfan/fluent-emoji-ms-vue -> @igeekfan/fluent-emoji-ms-react -> @igeekfan/fluent-emoji-ms-svelte

First-release limitation:

- npm Trusted Publishing currently cannot reliably bootstrap a package that has never existed on npm before
- If these four packages do not have any published versions yet, run [.github/workflows/bootstrap-publish-packages.yml](.github/workflows/bootstrap-publish-packages.yml) once first
- After at least one version exists for each package, switch back to [.github/workflows/publish-packages.yml](.github/workflows/publish-packages.yml) for normal OIDC trusted publishing

Bootstrap workflow details:

- Workflow: [.github/workflows/bootstrap-publish-packages.yml](.github/workflows/bootstrap-publish-packages.yml)
- Purpose: publish only the current versions that do not exist on npm yet, without bumping versions or pushing git tags
- Required GitHub secret: `NPM_PUBLISH_TOKEN`
- Token type: npm granular access token
- Token capability: allow publishing the target packages and enable bypass 2FA
- Recommendation: treat this token as a temporary bootstrap-only credential and delete the secret after the first successful release of all four packages

Package-name and account prerequisite:

- All four packages now publish under the `@igeekfan` scope
- The package names are `@igeekfan/fluent-emoji-ms-core`, `@igeekfan/fluent-emoji-ms-vue`, `@igeekfan/fluent-emoji-ms-react`, and `@igeekfan/fluent-emoji-ms-svelte`
- The publishing account must be the actual npm owner of that scope; for this repository that account is `igeekfan`
- If npm returns `Scope not found`, the `@igeekfan` scope is not available for publishing yet, or the token belongs to a different npm account

Required repository configuration:

1. Configure npm Trusted Publisher for each of these four packages:
2. `@igeekfan/fluent-emoji-ms-core`
3. `@igeekfan/fluent-emoji-ms-vue`
4. `@igeekfan/fluent-emoji-ms-react`
5. `@igeekfan/fluent-emoji-ms-svelte`
6. If branch protection is strict, allow the GitHub Actions bot to push version commits and tags

npm Trusted Publisher values:

- Provider: GitHub Actions
- Organization or user: `igeekfan`
- Repository: `fluent-emoji-ms`
- Workflow filename: `publish-packages.yml`
- Environment name: leave it blank; the publish workflow does not use a GitHub environment

Notes:

- A GitHub Actions `NPM_TOKEN` secret is no longer required for publishing
- The trusted publishing workflow now fails fast when a package does not exist on npm yet and tells you to run the bootstrap workflow first
- The workflow now relies on GitHub OIDC, which requires a GitHub-hosted runner, `id-token: write`, Node 24, and npm 11
- The publishable package manifests now include `repository.url` and `repository.directory`, which npm uses to validate trusted publishing

Workflow inputs:

- `version`: exact release version such as `0.2.0`
- `bump`: when `version` is empty, compute the next version with `patch`, `minor`, `major`, or `keep`
- `npm_tag`: npm dist-tag, default `latest`
- `generate_emoji_list`: whether to run `pnpm generate-emoji-list` before publishing

Workflow behavior:

1. Optionally run `pnpm generate-emoji-list`
2. Update the root version and all workspace package versions together
3. Run `pnpm test:core`
4. Run `pnpm build:packages`
5. Publish all four npm packages in order
6. Push the release commit and create a `vX.Y.Z` tag

Note: after the publish workflow pushes its release commit, the Pages workflow will run automatically, so the demo site stays aligned with the latest released commit.

Recommended sequence:

1. Configure npm Trusted Publisher for all four packages
2. Add the temporary repository secret `NPM_PUBLISH_TOKEN`
3. Run [.github/workflows/bootstrap-publish-packages.yml](.github/workflows/bootstrap-publish-packages.yml) once to create the first npm releases
4. Delete `NPM_PUBLISH_TOKEN` after the bootstrap release succeeds
5. Use [.github/workflows/publish-packages.yml](.github/workflows/publish-packages.yml) for all future releases

If npm logs show errors like:

- `Two-factor authentication or granular access token with bypass 2fa enabled is required`
- `For automation or CI/CD uses, please use Trusted Publishing instead`

then the package has not been linked to npm Trusted Publisher yet, or the configured workflow filename does not exactly match `publish-packages.yml`.

If [.github/workflows/publish-packages.yml](.github/workflows/publish-packages.yml) fails with:

- `Trusted publishing cannot bootstrap brand-new npm packages that do not exist yet`

then the packages do not have any published npm history yet. Run [.github/workflows/bootstrap-publish-packages.yml](.github/workflows/bootstrap-publish-packages.yml) once first.

If npm fails with permission-related errors, first verify that both `NPM_PUBLISH_TOKEN` and the Trusted Publisher connection are using the `igeekfan` npm account, and that this account has publish access to the `@igeekfan` scope.

## License

MIT