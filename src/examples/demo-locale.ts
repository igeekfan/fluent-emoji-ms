import type { EmojiLocale } from '@igeekfan/fluent-emoji-ms-vue'

const demoMessages = {
  'zh-CN': {
    app: {
      eyebrow: 'Preview Demo',
      title: 'Fluent Emoji 多示例预览',
      heroCopy: '预览页直接消费 workspace 包本身，集中展示默认用法、低阶能力、完整配置、插槽自定义和聊天集成，同时保留预设场景与多语言支持。',
      metrics: {
        scenes: '完整功能示例',
        sharedCore: '共享同一套 core 能力',
        assetSource: '当前资源来源',
        customSource: '自定义 CDN'
      },
      actions: {
        cdn: 'CDN 设置',
        github: 'GitHub',
        language: '语言',
        chinese: '中文',
        english: 'English'
      },
      cdn: {
        title: '全局 CDN',
        description: '当前预览中的所有示例都会共享这个 CDN 地址。',
        close: '关闭'
      },
      examples: {
        simple: {
          name: '基础示例',
          description: '展示最基本的表情选择器用法和选中结果反馈。'
        },
        lowLevel: {
          name: 'EmojiPicker组件',
          description: '展示基础 EmojiPicker 组件的分类、搜索和风格切换能力。'
        },
        advanced: {
          name: '高级配置示例',
          description: '展示表情选择器的完整配置能力、预览反馈和代码示例。'
        },
        slot: {
          name: '插槽自定义',
          description: '通过插槽自定义表情选择器按钮和交互样式。'
        },
        messenger: {
          name: '聊天应用示例',
          description: '在实际聊天应用场景中使用表情选择器和消息输入区。'
        }
      }
    },
    codeBlock: {
      viewSource: '查看源码',
      hideCode: '收起代码',
      copy: '复制',
      copied: '已复制!',
      copyFailed: '复制失败'
    },
    cdnSelector: {
      jsDelivr: {
        name: 'JSDelivr',
        description: '性能优秀的全球 CDN'
      },
      unpkg: {
        name: 'UNPKG',
        description: '由 Cloudflare 提供的 CDN'
      },
      custom: {
        name: '自定义 CDN',
        description: '输入你自己的资源地址'
      },
      customPlaceholder: '输入自定义 CDN URL',
      testIdle: '测试连接',
      testing: '测试中...',
      success: '成功 ✓',
      error: '失败 ✗',
      successMessage: 'CDN 连接正常',
      errorMessage: '无法加载表情图片，请检查 URL 或网络连接',
      currentUrl: '当前 URL:'
    },
    simple: {
      sectionLabel: 'Preset First',
      title: '先给用户一组能直接点的表情，而不是先打开搜索',
      copy: '默认体验更偏向真实业务入口：评论反馈、聊天互动、工作流状态，都先从小而确定的选择集开始。',
      buttonText: '添加反馈',
      strategyTitle: '当前策略',
      strategyRange: '预设范围',
      strategyInteraction: '交互方式',
      strategyRecommended: '推荐场景',
      strategyInteractionValue: '直接点击，不默认展示搜索',
      hint: '推荐默认关闭搜索，只有当你切到更大的分类范围时再开启搜索输入。',
      empty: '先在左侧试一下精选预设，感受更适合业务首屏的默认交互。',
      codeTitle: '场景化基础示例'
    },
    lowLevel: {
      sectionLabel: 'Low-Level Rail',
      title: '低阶组件更适合做固定反应条，不一定要带搜索',
      copy: '这里模拟一个发布状态栏。外层自己决定布局和分类切换，EmojiPicker 只负责渲染结果网格。',
      hint: '固定精选状态表情，适合审核、发布、运营值班等操作区。',
      whyTitle: '为什么这样更合适',
      interactionGoal: '交互目标',
      interactionGoalValue: '快速点选状态，而不是找长尾表情',
      dataScope: '数据范围',
      useCases: '适用场景',
      empty: '选择一个状态型表情，看看低阶组件如何承接固定场景。',
      codeTitle: '低阶组件固定反应条'
    },
    advanced: {
      sectionLabel: 'Advanced Controls',
      title: '把高阶组件的范围、预览和源码一起调清楚',
      copy: '这里把预设、自定义分类、批量渲染、搜索开关和按钮文案都暴露出来，同时保持预览更克制、源码常驻可见。',
      scopeTitle: '选择范围',
      presetMode: '场景预设',
      customMode: '自定义分类',
      appearanceTitle: '外观',
      interactionTitle: '交互策略',
      width: '整体宽度',
      emojiSize: '表情尺寸',
      buttonLabel: '按钮文案',
      initialStyle: '初始风格',
      defaultCategory: '初始分类',
      renderBatchSize: '批量渲染',
      showSearch: '显示搜索框',
      showSummary: '显示选中摘要',
      closeOnSelect: '选择后关闭',
      tip: '推荐做法：只有当你切到较大的分类范围时再打开搜索。',
      previewTitle: '实时预览',
      previewCopy: '这里展示当前所有配置组合后的真实结果。',
      stateTitle: '当前状态',
      scopeLabel: '选择范围',
      searchState: '搜索框',
      buttonTextLabel: '按钮文案',
      batchLabel: '批量渲染',
      selectedPrefix: '最近选中',
      searchOn: '开启',
      searchOff: '关闭',
      codeTitle: '高阶组件完整示例',
      defaultButtonText: '反馈表情'
    },
    anchored: {
      sectionLabel: 'Toolbar Binding',
      title: '把选择器绑定到业务按钮下方',
      copy: '通过 trigger 插槽，面板会挂在你自己的按钮下方，适合评论工具栏、编辑器工具条或输入框操作区。这里也只放工作流状态型表情。',
      mention: '@ 提及',
      upload: '上传图片',
      insert: '插入状态',
      collapse: '收起状态',
      preview: '发送预览',
      currentScene: '当前场景',
      currentCopy: '这是一个典型的业务工具栏布局，面板始终从按钮正下方弹出，同时限定为状态型表情，避免把完整表情库塞进工具栏。',
      tipsTitle: '适合的接入方式',
      tips: ['评论输入框工具栏', '聊天发送区按钮', '富文本编辑器操作区'],
      codeTitle: '锚定按钮示例'
    },
    messenger: {
      title: '聊天输入区里的表情包按钮',
      copy: '这个示例只保留一个表情包入口。点击后悬浮出精选反馈，选中后直接插入到文本框当前位置。',
      packButton: '表情包',
      textareaPlaceholder: '输入消息，或点击右侧表情包把反馈插入到当前光标位置。',
      send: '发送消息',
      insertHint: '选中的反馈会直接写入文本框，而不是立刻发送。',
      emptyDraft: '还没有输入内容，试试先点一下表情包按钮。',
      tipsTitle: '适合的接入方式',
      tips: ['聊天输入框', '评论回复框', '工单备注区'],
      codeTitle: '聊天输入区插入示例',
      seedMessages: [
        '这次发布需要一个更贴近业务场景的输入区。',
        '收到，我先在文本框里插入一枚反馈表情看看。'
      ]
    }
  },
  'en-US': {
    app: {
      eyebrow: 'Preview Demo',
      title: 'Fluent Emoji Scenario Gallery',
      heroCopy: 'The demo consumes the workspace packages directly and showcases the default picker, low-level controls, full configuration, slot customization, chat integration, presets, and bilingual support in one place.',
      metrics: {
        scenes: 'complete feature demos',
        sharedCore: 'shared core across frameworks',
        assetSource: 'current asset source',
        customSource: 'Custom CDN'
      },
      actions: {
        cdn: 'CDN Settings',
        github: 'GitHub',
        language: 'Language',
        chinese: '中文',
        english: 'English'
      },
      cdn: {
        title: 'Global CDN',
        description: 'Every demo on this page shares the same emoji asset source.',
        close: 'Close'
      },
      examples: {
        simple: {
          name: 'Basic Example',
          description: 'Show the default picker usage and the selected emoji result state.'
        },
        lowLevel: {
          name: 'EmojiPicker Component',
          description: 'Show category switching, search, and style controls with the low-level grid.'
        },
        advanced: {
          name: 'Advanced Config',
          description: 'Show the full picker configuration surface, live preview feedback, and the source code.'
        },
        slot: {
          name: 'Slot Customization',
          description: 'Customize the trigger button and interaction style through slots.'
        },
        messenger: {
          name: 'Chat App Example',
          description: 'Use the picker inside a chat UI with a richer composer and message flow.'
        }
      }
    },
    codeBlock: {
      viewSource: 'View Source',
      hideCode: 'Hide Code',
      copy: 'Copy',
      copied: 'Copied!',
      copyFailed: 'Copy Failed'
    },
    cdnSelector: {
      jsDelivr: {
        name: 'JSDelivr',
        description: 'High-performance global CDN'
      },
      unpkg: {
        name: 'UNPKG',
        description: 'Cloudflare-backed CDN'
      },
      custom: {
        name: 'Custom CDN',
        description: 'Use your own asset host'
      },
      customPlaceholder: 'Enter a custom CDN URL',
      testIdle: 'Test Connection',
      testing: 'Testing...',
      success: 'Success ✓',
      error: 'Failed ✗',
      successMessage: 'Emoji assets are reachable',
      errorMessage: 'Failed to load emoji assets. Check the URL or your network connection.',
      currentUrl: 'Current URL:'
    },
    simple: {
      sectionLabel: 'Preset First',
      title: 'Give people a tappable set before you open search',
      copy: 'The default flow now mirrors real product entry points: comment feedback, chat reactions, and workflow signals start from a small curated set.',
      buttonText: 'Add feedback',
      strategyTitle: 'Current Strategy',
      strategyRange: 'Preset scope',
      strategyInteraction: 'Interaction',
      strategyRecommended: 'Best for',
      strategyInteractionValue: 'Direct tap, with search hidden by default',
      hint: 'Keep search off until the collection becomes large enough to justify it.',
      empty: 'Try the curated presets on the left to feel the tighter default interaction.',
      codeTitle: 'Preset-first starter example'
    },
    lowLevel: {
      sectionLabel: 'Low-Level Rail',
      title: 'The low-level grid works best as a fixed reaction rail',
      copy: 'This scene mimics a release status rail. Layout and category switching stay outside, while EmojiPicker only renders the result grid.',
      hint: 'A fixed set of status emoji works well for reviews, launches, and ops handoffs.',
      whyTitle: 'Why this fits better',
      interactionGoal: 'Interaction goal',
      interactionGoalValue: 'Tap a state quickly instead of searching a long-tail library',
      dataScope: 'Data scope',
      useCases: 'Best for',
      empty: 'Pick a status emoji to see how the low-level grid supports focused workflows.',
      codeTitle: 'Low-level reaction rail'
    },
    advanced: {
      sectionLabel: 'Advanced Controls',
      title: 'Tune scope, preview size, and source code together',
      copy: 'This demo exposes presets, custom categories, batching, search, and button copy while keeping the preview smaller and the source code always on screen.',
      scopeTitle: 'Collection Scope',
      presetMode: 'Preset Mode',
      customMode: 'Custom Categories',
      appearanceTitle: 'Appearance',
      interactionTitle: 'Interaction Strategy',
      width: 'Picker width',
      emojiSize: 'Emoji size',
      buttonLabel: 'Button label',
      initialStyle: 'Initial style',
      defaultCategory: 'Default category',
      renderBatchSize: 'Render batch',
      showSearch: 'Show search input',
      showSummary: 'Show selected summary',
      closeOnSelect: 'Close after select',
      tip: 'Recommended: only turn search on when the visible scope becomes meaningfully larger.',
      previewTitle: 'Live Preview',
      previewCopy: 'This is the actual high-level picker rendered with the current settings.',
      stateTitle: 'Current State',
      scopeLabel: 'Collection scope',
      searchState: 'Search',
      buttonTextLabel: 'Button label',
      batchLabel: 'Render batch',
      selectedPrefix: 'Most recent selection',
      searchOn: 'On',
      searchOff: 'Off',
      codeTitle: 'Complete high-level example',
      defaultButtonText: 'Feedback'
    },
    anchored: {
      sectionLabel: 'Toolbar Binding',
      title: 'Anchor the picker under a business button',
      copy: 'Using the trigger slot keeps the panel attached to your own button, which fits comment toolbars, editor actions, and composer controls. The scope stays workflow-focused.',
      mention: '@ Mention',
      upload: 'Upload Image',
      insert: 'Insert Status',
      collapse: 'Hide Status',
      preview: 'Preview Send',
      currentScene: 'Current Scene',
      currentCopy: 'This is a standard business toolbar layout. The panel always opens from the button itself and stays constrained to workflow-style emoji.',
      tipsTitle: 'Best fit',
      tips: ['Comment toolbars', 'Chat composer actions', 'Rich-text editor controls'],
      codeTitle: 'Anchored trigger example'
    },
    messenger: {
      title: 'An emoji pack button inside the chat composer',
      copy: 'This scene keeps a single emoji pack entry. Clicking it floats a curated reaction set, and picking one inserts it at the current cursor position in the textarea.',
      packButton: 'Emoji Pack',
      textareaPlaceholder: 'Write a message, or use the emoji pack to insert feedback at the current cursor position.',
      send: 'Send Message',
      insertHint: 'Picking an emoji writes it into the text box instead of sending immediately.',
      emptyDraft: 'The composer is empty. Try opening the emoji pack first.',
      tipsTitle: 'Best fit',
      tips: ['Chat composers', 'Comment reply boxes', 'Ticket notes'],
      codeTitle: 'Composer insertion example',
      seedMessages: [
        'This release needs a composer that feels closer to real product usage.',
        'Got it. I will insert a quick reaction into the text box first.'
      ]
    }
  }
} as const

export function getDemoMessages(locale: EmojiLocale = 'zh-CN') {
  return demoMessages[locale] ?? demoMessages['zh-CN']
}