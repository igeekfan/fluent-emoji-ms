export interface EmojiItem {
  name: string;
  path: string;
  category: string;
}

export interface EmojiItemWithStyle extends EmojiItem {
  style: string;
}

export interface EmojiCategory {
  name: string;
  value: string;
  icon?: string;
}

export interface StyleOption {
  name: string;
  value: string;
}
