import { emojiCategories } from './emoji-categories';
import { emojiList } from './emoji-list';
import type { EmojiItem, EmojiCategory } from '../types/emoji.d.ts';

// 默认显示的分类
export const defaultCategories: string[] = ['smileys', 'animals', 'food', 'symbols'];

/**
 * 校验表情分类是否有效
 * 如果不存在于emojiCategories中，则修正为默认分类
 */
function validateEmojiCategory(category: string | undefined): string {
  if (!category) return 'objects'; // 默认分类
  
  // 检查分类是否存在于定义的分类中
  const validCategory = emojiCategories.find(cat => cat.value === category);
  return validCategory ? category : 'objects';
}

/**
 * 过滤表情列表，只返回指定分类的表情
 * @param categories 要显示的分类数组，如果包含'all'则显示所有表情
 * @returns 过滤后的表情列表
 */
export function filterEmojisByCategories(categories: string[] = defaultCategories): EmojiItem[] {
  try {
    // 确保表情列表中的分类都是有效的
    const validatedList = emojiList.map(emoji => ({
      ...emoji,
      category: validateEmojiCategory(emoji.category)
    }));
    
    // 如果包含'all'或为空数组，则返回所有表情
    if (categories.includes('all') || categories.length === 0) {
      return validatedList;
    }

    // 否则过滤指定分类的表情
    const filtered = validatedList.filter(emoji => {
      const category = emoji.category || 'objects'; // 默认为objects分类
      return categories.includes(category);
    });
    
    console.log(`分类 [${categories.join(', ')}] 过滤后有 ${filtered.length} 个表情`);
    return filtered;
  } catch (error) {
    console.error('过滤表情列表时出错:', error);
    return [];
  }
}

/**
 * 过滤分类列表，只显示有对应表情的分类
 */
export function filterCategories(categories: string[] = defaultCategories): EmojiCategory[] {
  try {
    if (!Array.isArray(categories) || !Array.isArray(emojiCategories)) {
      console.error('分类数据无效:', { categories, emojiCategories });
      return [{ value: 'all', name: '全部', icon: '🌟' }];
    }
    
    // 确保"all"分类存在
    const allCategory: EmojiCategory = { value: 'all', name: '全部', icon: '🌟' };
    
    // 获取当前表情列表中使用的所有分类
    const usedCategories = new Set(
      emojiList
        .filter(emoji => emoji && typeof emoji.category === 'string')
        .map(emoji => emoji.category)
    );
    
    // 添加默认分类，确保页面上至少有一些分类可选
    defaultCategories.forEach(cat => usedCategories.add(cat));
    
    // 返回所有指定的分类，如果包含'all'则返回所有使用过的分类
    if (categories.includes('all') || categories.length === 0) {
      // 获取有效的分类
      return [
        allCategory,
        ...emojiCategories.filter(cat => 
          cat.value !== 'all' && 
          usedCategories.has(cat.value)
        )
      ];
    } else {
      // 只返回指定的分类且这些分类在表情中实际使用过
      return [
        allCategory,
        ...emojiCategories.filter(cat => 
          cat && 
          categories.includes(cat.value) && 
          (usedCategories.has(cat.value) || defaultCategories.includes(cat.value))
        )
      ];
    }
  } catch (error) {
    console.error('过滤分类列表时出错:', error);
    return [{ value: 'all', name: '全部', icon: '🌟' }];
  }
}

// 导出分类数据
export { emojiCategories };
export const commonEmojis = emojiList;
export const categories = emojiCategories;

