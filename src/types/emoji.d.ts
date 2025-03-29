// 基础表情项接口
export interface EmojiItem {
  name: string;
  path: string;
  category: string;
}

// 带样式的表情项接口
export interface EmojiItemWithStyle extends EmojiItem {
  style: string;
}

// 表情分类接口
export interface EmojiCategory {
  name: string;
  value: string;
  icon?: string;
}

// 表情风格选项接口
export interface StyleOption {
  name: string;
  value: string;
}
