/**
 * 这个脚本用于从 fluentui-emoji 包生成完整的表情列表
 * 使用方法: node generate-emoji-list.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// 在 ES 模块中创建 __dirname 等效变量
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 简化的表情分类映射表，只使用一级分类
const CATEGORY_MAP = {
  // 表情与情感
  'face': 'smileys',
  'smiling': 'smileys',
  'grinning': 'smileys',
  'heart-eyes': 'smileys',
  'laughing': 'smileys',
  'tears': 'smileys',
  'joy': 'smileys',
  'winking': 'smileys',
  'kissing': 'smileys',
  'thinking': 'smileys',
  'neutral': 'smileys',
  'expressionless': 'smileys',
  'sad': 'smileys',
  'crying': 'smileys',
  'angry': 'smileys',
  'rage': 'smileys',
  'mask': 'smileys',
  'medical-mask': 'smileys',
  'sunglasses': 'smileys',
  'nerd': 'smileys',
  'crazy': 'smileys',
  'dizzy': 'smileys',
  'emoji': 'smileys',
  'emotion': 'smileys',
  
  // 人物
  'person': 'people',
  "breast": 'people',
  "pregnant": 'people',
  'man': 'people',
  "medium": 'people',
  "light": 'people',
  "astronaut": 'people',
  "dark": 'people',
  'woman': 'people',
  'boy': 'people',
  'girl': 'people',
  'child': 'people',
  'baby': 'people',
  'adult': 'people',
  'princess': 'people',
  'prince': 'people',
  'fairy': 'people',
  'elf': 'people',
  'mermaid': 'people',
  'merman': 'people',
  'zombie': 'people',
  'ghost': 'people',
  'human': 'people',
  
  // 手势和身体部位
  'hand': 'gestures',
  'hands': 'gestures',
  'finger': 'gestures',
  'pinch': 'gestures',
  'fist': 'gestures',
  'palm': 'gestures',
  'clap': 'gestures',
  'shake': 'gestures',
  'thumbs': 'gestures',
  'pointing': 'gestures',
  'ear': 'gestures',
  'eye': 'gestures',
  'eyes': 'gestures',
  'nose': 'gestures',
  'mouth': 'gestures',
  'tongue': 'gestures',
  'tooth': 'gestures',
  'bone': 'gestures',
  'foot': 'gestures',
  'leg': 'gestures',
  'arm': 'gestures',
  'gesture': 'gestures',
  
  // 动物
  'animal': 'animals',
  'cat': 'animals',
  'dog': 'animals',
  'lion': 'animals',
  'tiger': 'animals',
  'leopard': 'animals',
  'puppy': 'animals',
  'wolf': 'animals',
  'fox': 'animals',
  'bird': 'animals',
  'duck': 'animals',
  'swan': 'animals',
  'owl': 'animals',
  'eagle': 'animals',
  'penguin': 'animals',
  'chicken': 'animals',
  'fish': 'animals',
  'dolphin': 'animals',
  'whale': 'animals',
  'shark': 'animals',
  'octopus': 'animals',
  'shell': 'animals',
  'crab': 'animals',
  'snake': 'animals',
  'lizard': 'animals',
  'turtle': 'animals',
  'dragon': 'animals',
  'bear': 'animals',
  'panda': 'animals',
  'koala': 'animals',
  'rabbit': 'animals',
  'mouse': 'animals',
  'hamster': 'animals',
  'monkey': 'animals',
  'gorilla': 'animals',
  'orangutan': 'animals',
  'horse': 'animals',
  'unicorn': 'animals',
  'zebra': 'animals',
  'deer': 'animals',
  'cow': 'animals',
  'pig': 'animals',
  'goat': 'animals',
  'sheep': 'animals',
  'elephant': 'animals',
  'mammoth': 'animals',
  'rhino': 'animals',
  'hippo': 'animals',
  'bat': 'animals',
  'sloth': 'animals',
  'otter': 'animals',
  'skunk': 'animals',
  'camel': 'animals',
  'llama': 'animals',
  'giraffe': 'animals',
  'kangaroo': 'animals',
  'frog': 'animals',
  'bug': 'animals',
  'ant': 'animals',
  'spider': 'animals',
  'scorpion': 'animals',
  'mosquito': 'animals',
  'fly': 'animals',
  'worm': 'animals',
  'beetle': 'animals',
  'butterfly': 'animals',
  'ladybug': 'animals',
  'bee': 'animals',
  'insect': 'animals',
  
  // 食物
  'food': 'food',
  'fruit': 'food',
  'berry': 'food',
  'apple': 'food',
  'pear': 'food',
  'orange': 'food',
  'lemon': 'food',
  'banana': 'food',
  'watermelon': 'food',
  'grapes': 'food',
  'melon': 'food',
  'pineapple': 'food',
  'coconut': 'food',
  'peach': 'food',
  'cherry': 'food',
  'strawberry': 'food',
  'vegetable': 'food',
  'potato': 'food',
  'carrot': 'food',
  'corn': 'food',
  'garlic': 'food',
  'onion': 'food',
  'pepper': 'food',
  'cucumber': 'food',
  'broccoli': 'food',
  'pumpkin': 'food',
  'tomato': 'food',
  'mushroom': 'food',
  'peanut': 'food',
  'chestnut': 'food',
  'bread': 'food',
  'croissant': 'food',
  'sandwich': 'food',
  'pancake': 'food',
  'waffle': 'food',
  'egg': 'food',
  'dish': 'food',
  'salad': 'food',
  'popcorn': 'food',
  'bacon': 'food',
  'taco': 'food',
  'burrito': 'food',
  'rice': 'food',
  'curry': 'food',
  'ramen': 'food',
  'spaghetti': 'food',
  'stew': 'food',
  'fondue': 'food',
  'pizza': 'food',
  'soup': 'food',
  'bento': 'food',
  'burger': 'food',
  'cheese': 'food',
  'cream': 'food',
  'milk': 'food',
  
  // 甜品 (也归类为食物)
  'ice-cream': 'food',
  'cupcake': 'food',
  'pie': 'food',
  'cake': 'food',
  'cookie': 'food',
  'chocolate': 'food',
  'candy': 'food',
  'lollipop': 'food',
  'custard': 'food',
  'honey': 'food',
  'doughnut': 'food',
  'sweet': 'food',
  
  // 饮料
  'beverage': 'drinks',
  'drink': 'drinks',
  'cocktail': 'drinks',
  'wine': 'drinks',
  'beer': 'drinks',
  'whisky': 'drinks',
  'champagne': 'drinks',
  'tea': 'drinks',
  'coffee': 'drinks',
  'mate': 'drinks',
  'bubble-tea': 'drinks',
  'juice': 'drinks',
  'water': 'drinks',
  
  // 旅行和地点
  'travel': 'travel',
  'mountain': 'travel',
  'beach': 'travel',
  'camping': 'travel',
  'tent': 'travel',
  'map': 'travel',
  'compass': 'travel',
  'desert': 'travel',
  'island': 'travel',
  'forest': 'travel',
  'globe': 'travel',
  'world': 'travel',

  // 建筑和地点
  'building': 'places',
  'house': 'places',
  'office': 'places',
  'home': 'places',
  'school': 'places',
  'post': 'places',
  'hospital': 'places',
  'bank': 'places',
  'hotel': 'places',
  'castle': 'places',
  'stadium': 'places', 
  'tower': 'places',
  'city': 'places',
  'town': 'places',
  'village': 'places',
  
  // 交通工具
  'car': 'transportation',
  'automobile': 'transportation',
  'taxi': 'transportation',
  'bus': 'transportation',
  'trolley': 'transportation',
  'truck': 'transportation',
  'bike': 'transportation',
  'bicycle': 'transportation',
  'kick-scooter': 'transportation',
  'motorcycle': 'transportation',
  'auto-rickshaw': 'transportation',
  'train': 'transportation',
  'tram': 'transportation',
  'railway': 'transportation',
  'subway': 'transportation',
  'airplane': 'transportation',
  'parachute': 'transportation',
  'helicopter': 'transportation',
  'rocket': 'transportation',
  'satellite': 'transportation',
  'flying-saucer': 'transportation',
  'ship': 'transportation',
  'boat': 'transportation',
  'canoe': 'transportation',
  'sailboat': 'transportation',
  'ferry': 'transportation',
  'anchor': 'transportation',
  'vehicle': 'transportation',
  
  // 活动、游戏和运动
  'activities': 'activities',
  'sport': 'activities',
  'ball': 'activities',
  'soccer': 'activities',
  'baseball': 'activities',
  'softball': 'activities',
  'basketball': 'activities',
  'volleyball': 'activities',
  'football': 'activities',
  'rugby': 'activities',
  'tennis': 'activities',
  'badminton': 'activities',
  'boxing': 'activities',
  'wrestling': 'activities',
  'hockey': 'activities',
  'fishing': 'activities',
  'running': 'activities',
  'skier': 'activities',
  'snowboard': 'activities',
  'kite': 'activities',
  'sled': 'activities',
  'bullseye': 'activities',
  'yo-yo': 'activities',
  'game': 'activities',
  'chess': 'activities',
  'dice': 'activities',
  'joker': 'activities',
  'trophy': 'activities',
  'medal': 'activities',
  'award': 'activities',
  'ribbon': 'activities',
  'music': 'activities',
  'musical': 'activities',
  'guitar': 'activities',
  'violin': 'activities',
  'trumpet': 'activities',
  'saxophone': 'activities',
  'accordion': 'activities',
  'drum': 'activities',
  'microphone': 'activities',
  'headphone': 'activities',
  'art': 'activities',
  'paintbrush': 'activities',
  'artist': 'activities',
  
  // 物品和科技
  'objects': 'objects',
  'phone': 'objects',
  'telephone': 'objects',
  'computer': 'objects',
  'laptop': 'objects',
  'keyboard': 'objects',
  'mouse': 'objects',
  'disc': 'objects',
  'joystick': 'objects',
  'videogame': 'objects',
  'speaker': 'objects',
  'camera': 'objects',
  'film': 'objects',
  'movie': 'objects',
  'radio': 'objects',
  'television': 'objects',
  'projector': 'objects',
  'battery': 'objects',
  'light': 'objects',
  'lamp': 'objects',
  'bulb': 'objects',
  'candle': 'objects',
  'fire': 'objects',
  'toilet': 'objects',
  'lotion': 'objects',
  'soap': 'objects',
  'sponge': 'objects',
  'shower': 'objects',
  'bath': 'objects',
  'razor': 'objects',
  'toothbrush': 'objects',
  'comb': 'objects',
  'tool': 'objects',
  'hammer': 'objects',
  'axe': 'objects',
  'wrench': 'objects',
  'screwdriver': 'objects',
  'pencil': 'objects',
  'pen': 'objects',
  'marker': 'objects',
  'file': 'objects',
  'folder': 'objects',
  'clipboard': 'objects',
  'notepad': 'objects',
  'envelope': 'objects',
  'mailbox': 'objects',
  'package': 'objects',
  'calendar': 'objects',
  'card': 'objects',
  'scissors': 'objects',
  'book': 'objects',
  'newspaper': 'objects',
  'money': 'objects',
  'currency': 'objects',
  'coin': 'objects',
  'credit-card': 'objects',
  'receipt': 'objects',
  'shopping': 'objects',
  'cart': 'objects',
  'luggage': 'objects',
  'backpack': 'objects',
  'clothing': 'objects',
  'dress': 'objects',
  'shirt': 'objects',
  'tie': 'objects',
  'jeans': 'objects',
  'coat': 'objects',
  'sock': 'objects',
  'glove': 'objects',
  'shoe': 'objects',
  'boot': 'objects',
  'hat': 'objects',
  'glasses': 'objects',
  'umbrella': 'objects',
  'gift': 'objects',
  'balloon': 'objects',
  'party': 'objects',
  'popper': 'objects',
  'puzzle': 'objects',
  'toy': 'objects',
  'device': 'objects',
  'gadget': 'objects',
  
  // 自然和植物
  'plant': 'nature',
  'flower': 'nature',
  'sakura': 'nature',
  'tulip': 'nature',
  'rose': 'nature',
  'bouquet': 'nature',
  'tree': 'nature',
  'cactus': 'nature',
  'herb': 'nature',
  'shamrock': 'nature',
  'leaf': 'nature',
  'seedling': 'nature',
  'sun': 'nature',
  'moon': 'nature',
  'star': 'nature',
  'cloud': 'nature',
  'weather': 'nature',
  'snow': 'nature',
  'rain': 'nature',
  'lightning': 'nature',
  'rainbow': 'nature',
  
  // 符号与标志
  'symbols': 'symbols',
  'heart': 'symbols',
  'broken-heart': 'symbols',
  'love': 'symbols',
  'sparkles': 'symbols',
  'bang': 'symbols',
  'zap': 'symbols',
  'wave': 'symbols',
  'collision': 'symbols',
  'sweat': 'symbols',
  'dash': 'symbols',
  'bomb': 'symbols',
  'hole': 'symbols',
  'speech': 'symbols',
  'thought': 'symbols',
  'bubble': 'symbols',
  'zzz': 'symbols',
  'memo': 'symbols',
  'number': 'symbols',
  'keycap': 'symbols',
  'digit': 'symbols',
  'arrow': 'symbols',
  'plus': 'symbols',
  'minus': 'symbols',
  'multiply': 'symbols',
  'divide': 'symbols',
  'infinity': 'symbols',
  'equal': 'symbols',
  'percent': 'symbols',
  'sign': 'symbols',
  'icon': 'symbols',
  
  // 国旗和标识
  'flag': 'flags',
  'country': 'flags',
  'nation': 'flags',
  
  // 默认分类（如果没有匹配到其他分类）
  'default': 'objects'
};

/**
 * 根据文件名猜测表情类别
 * @param {string} name 表情名称
 * @returns {string} 猜测的类别
 */
function guessCategory(name) {
  const nameLower = name.toLowerCase();
  
  // 首先尝试检查全名匹配
  for (const [keyword, category] of Object.entries(CATEGORY_MAP)) {
    if (nameLower === keyword) {
      return category;
    }
  }
  
  // 然后检查部分匹配
  for (const [keyword, category] of Object.entries(CATEGORY_MAP)) {
    if (nameLower.includes(keyword)) {
      return category;
    }
  }
  
  // 默认为"其他"类别
  return 'objects';
}

/**
 * 从文件路径格式化名称
 * @param {string} path 文件路径
 * @returns {string} 格式化后的名称
 */
function formatNameFromPath(filepath) {
  // 获取文件名（不包含路径）
  const filename = path.basename(filepath);
  
  // 移除 .svg 后缀
  const nameWithoutExt = filename.replace('.svg', '');
  
  // 将连字符转换为空格，并使每个单词首字母大写
  return nameWithoutExt
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * 主函数 - 生成表情列表
 */
async function generateEmojiList() {
  try {
    // 获取 fluentui-emoji 包的路径
    const emojiPkgPath = path.resolve(__dirname, '../node_modules/fluentui-emoji');
    const modernIconsPath = path.join(emojiPkgPath, 'icons/modern');
    
    // 检查目录是否存在
    if (!fs.existsSync(modernIconsPath)) {
      console.error(`目录不存在: ${modernIconsPath}`);
      console.error('请确保已安装 fluentui-emoji 包');
      return;
    }
    
    // 读取目录中的所有文件
    const files = fs.readdirSync(modernIconsPath);
    
    // 过滤出 SVG 文件并创建表情列表
    const emojiList = files
      .filter(file => file.endsWith('.svg'))
      .map(file => {
        const name = formatNameFromPath(file);
        const category = guessCategory(name.toLowerCase());
        
        return {
          name,
          path: file,
          category
        };
      });
    
    console.log(`找到 ${emojiList.length} 个表情图标`);
    
    // 生成 TypeScript 代码
    const tsCode = `// This file is auto-generated by scripts/generate-emoji-list.js
  import type { EmojiItem } from '../types'

export const emojiList: EmojiItem[] = ${JSON.stringify(emojiList, null, 2)}

export function getFullEmojiList(): EmojiItem[] {
  return emojiList
}
`;

    // 将结果写入文件
    const outputPath = path.resolve(__dirname, '../packages/core/src/data/emoji-list.ts');
    fs.writeFileSync(outputPath, tsCode);
    
    console.log(`表情列表已生成并保存到: ${outputPath}`);
    
    // 生成分类数据
    generateCategoriesFile();
    
  } catch (error) {
    console.error('生成表情列表时出错:', error);
  }
}

/**
 * 生成分类数据文件
 */
function generateCategoriesFile() {
  // 简化的一级分类列表
  const categories = [
    { value: 'all', name: '全部', icon: '🌟' },
    { value: 'smileys', name: '表情', icon: '😊' },
    { value: 'people', name: '人物', icon: '👨‍👩‍👧' },
    { value: 'gestures', name: '手势', icon: '👋' },
    { value: 'animals', name: '动物', icon: '🐱' },
    { value: 'food', name: '食物', icon: '🍔' },
    { value: 'drinks', name: '饮品', icon: '🍹' },
    { value: 'travel', name: '旅行', icon: '🏖️' },
    { value: 'places', name: '地点', icon: '🏢' },
    { value: 'transportation', name: '交通', icon: '🚗' },
    { value: 'activities', name: '活动', icon: '⚽' },
    { value: 'objects', name: '物品', icon: '💡' },
    { value: 'nature', name: '自然', icon: '🌿' },
    { value: 'symbols', name: '符号', icon: '♥️' },
    { value: 'flags', name: '旗帜', icon: '🏁' },
  ];
  
  // 生成分类数据文件
  const categoryCode = `export interface EmojiCategory {
  value: string;
  name: string;
  icon: string;
}

// 优化的表情分类（仅一级分类）
export const emojiCategories: EmojiCategory[] = ${JSON.stringify(categories, null, 2)}

// 为向后兼容性提供空的详细分类数组和函数
export const detailedEmojiCategories = []
export function getSubcategories() { return [] }
export function getMainCategory(category: string) { return category }
`;

  // 将分类数据写入文件
  const categoriesPath = path.resolve(__dirname, '../packages/core/src/data/emoji-categories.ts');
  fs.writeFileSync(categoriesPath, categoryCode);
  
  console.log(`分类数据已生成并保存到: ${categoriesPath}`);
}

// 执行主函数
generateEmojiList();
