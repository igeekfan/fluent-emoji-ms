import type { StyleOption } from '../types/emoji.d.ts';

/**
 * 可用的表情风格
 */
export const emojiStyles: StyleOption[] = [
  { name: "现代", value: "modern" },
  { name: "扁平", value: "flat" },
  { name: "高对比", value: "high-contrast" }
];

/**
 * 获取风格显示名称
 * @param styleValue 风格值
 * @returns 显示名称
 */
export function getStyleName(styleValue: string): string {
  const style = emojiStyles.find(s => s.value === styleValue);
  return style ? style.name : styleValue;
}
