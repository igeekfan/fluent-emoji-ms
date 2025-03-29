export interface EmojiCategory {
  value: string;
  name: string;
  icon: string;
}

// 优化的表情分类（仅一级分类）
export const emojiCategories: EmojiCategory[] = [
  {
    "value": "all",
    "name": "全部",
    "icon": "🌟"
  },
  {
    "value": "smileys",
    "name": "表情",
    "icon": "😊"
  },
  {
    "value": "people",
    "name": "人物",
    "icon": "👨‍👩‍👧"
  },
  {
    "value": "gestures",
    "name": "手势",
    "icon": "👋"
  },
  {
    "value": "animals",
    "name": "动物",
    "icon": "🐱"
  },
  {
    "value": "food",
    "name": "食物",
    "icon": "🍔"
  },
  {
    "value": "drinks",
    "name": "饮品",
    "icon": "🍹"
  },
  {
    "value": "travel",
    "name": "旅行",
    "icon": "🏖️"
  },
  {
    "value": "places",
    "name": "地点",
    "icon": "🏢"
  },
  {
    "value": "transportation",
    "name": "交通",
    "icon": "🚗"
  },
  {
    "value": "activities",
    "name": "活动",
    "icon": "⚽"
  },
  {
    "value": "objects",
    "name": "物品",
    "icon": "💡"
  },
  {
    "value": "nature",
    "name": "自然",
    "icon": "🌿"
  },
  {
    "value": "symbols",
    "name": "符号",
    "icon": "♥️"
  },
  {
    "value": "flags",
    "name": "旗帜",
    "icon": "🏁"
  }
]

// 为向后兼容性提供空的详细分类数组和函数
export const detailedEmojiCategories = []
export function getSubcategories() { return [] }
export function getMainCategory(category: string) { return category }
