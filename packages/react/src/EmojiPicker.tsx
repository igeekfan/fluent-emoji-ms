import {
  DEFAULT_BASE_URL,
  DEFAULT_RENDER_BATCH_SIZE,
  buildEmojiImageUrl,
  defaultEmojiLocale,
  getEmojiMessages,
  queryEmojis,
  type EmojiLocale,
  type EmojiPresetKey,
  type EmojiItem
} from '@igeekfan/fluent-emoji-ms-core'
import { useMemo, type CSSProperties } from 'react'
import './styles.css'

export interface EmojiPickerProps {
  baseUrl?: string
  width?: number | string
  selectedStyle?: string
  locale?: EmojiLocale
  categories?: string[]
  preset?: EmojiPresetKey
  emojiNames?: string[]
  selectedCategory?: string
  searchQuery?: string
  emojiSize?: number
  columns?: number
  autoFill?: boolean
  renderLimit?: number
  renderBatchSize?: number
  onSelect?: (emoji: EmojiItem) => void
  onLoadMore?: () => void
}

export function EmojiPicker({
  baseUrl = DEFAULT_BASE_URL,
  width,
  selectedStyle = 'modern',
  locale = defaultEmojiLocale,
  categories = ['all'],
  preset,
  emojiNames,
  selectedCategory = 'all',
  searchQuery = '',
  emojiSize = 28,
  columns = 6,
  autoFill = true,
  renderLimit = DEFAULT_RENDER_BATCH_SIZE,
  onSelect,
  onLoadMore
}: EmojiPickerProps) {
  const messages = useMemo(() => getEmojiMessages(locale), [locale])
  const emojiResult = useMemo(
    () => queryEmojis({ categories, preset, emojiNames, selectedCategory, search: searchQuery, limit: renderLimit }),
    [categories, preset, emojiNames, selectedCategory, searchQuery, renderLimit]
  )
  const cellSize = Math.max(emojiSize + 4, 32)
  const panelStyle: CSSProperties | undefined = width == null || width === ''
    ? undefined
    : {
        width: '100%',
        maxWidth: typeof width === 'number' ? `${width}px` : width,
        margin: '0 auto'
      }
  const gridStyle: CSSProperties = autoFill
    ? { gridTemplateColumns: `repeat(auto-fill, minmax(${cellSize}px, 1fr))` }
    : { gridTemplateColumns: `repeat(${columns}, ${cellSize}px)`, justifyContent: 'center' }
  const cellStyle: CSSProperties = { minHeight: `${cellSize}px` }

  return (
    <div className="fem-picker-panel" style={panelStyle}>
      <div className="fem-grid-wrap">
        {emojiResult.items.length ? (
          <div className="fem-grid" style={gridStyle}>
            {emojiResult.items.map((emoji) => (
              <button
                key={emoji.name}
                type="button"
                className="fem-cell"
                title={emoji.name}
                style={cellStyle}
                onClick={() => onSelect?.(emoji)}
              >
                <img
                  src={buildEmojiImageUrl(baseUrl, selectedStyle, emoji.path)}
                  alt={emoji.name}
                  width={emojiSize}
                  height={emojiSize}
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        ) : (
          <div className="fem-empty">{messages.ui.noResults}</div>
        )}
      </div>

      {emojiResult.hasMore ? (
        <button type="button" className="fem-load-more" onClick={onLoadMore}>
          {messages.ui.loadMore}
        </button>
      ) : null}
    </div>
  )
}

export default EmojiPicker
