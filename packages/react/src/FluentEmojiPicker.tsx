import {
  DEFAULT_BASE_URL,
  DEFAULT_RENDER_BATCH_SIZE,
  buildEmojiImageUrl,
  defaultCategories,
  defaultEmojiLocale,
  filterCategories,
  getEmojiMessages,
  getEmojiStyles,
  getStyleName,
  type EmojiLocale,
  type EmojiPresetKey,
  type EmojiItem,
  type EmojiItemWithStyle
} from '@igeekfan/fluent-emoji-ms-core'
import {
  startTransition,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties
} from 'react'
import './styles.css'
import { EmojiPicker } from './EmojiPicker'

export interface FluentEmojiPickerProps {
  disabled?: boolean
  initialStyle?: string
  defaultCategory?: string
  buttonText?: string
  baseUrl?: string
  locale?: EmojiLocale
  width?: number | string
  categories?: string[]
  preset?: EmojiPresetKey
  emojiNames?: string[]
  showSearch?: boolean
  closeOnSelect?: boolean
  showSelectedEmoji?: boolean
  emojiSize?: number
  columns?: number
  autoFill?: boolean
  renderBatchSize?: number
  onSelect?: (emoji: EmojiItemWithStyle) => void
  onClear?: () => void
}

export function FluentEmojiPicker({
  disabled = false,
  initialStyle = 'modern',
  defaultCategory = 'all',
  buttonText,
  baseUrl = DEFAULT_BASE_URL,
  locale = defaultEmojiLocale,
  width = 320,
  categories,
  preset,
  emojiNames,
  showSearch = true,
  closeOnSelect = true,
  showSelectedEmoji = false,
  emojiSize = 28,
  columns = 6,
  autoFill = true,
  renderBatchSize = DEFAULT_RENDER_BATCH_SIZE,
  onSelect,
  onClear
}: FluentEmojiPickerProps) {
  const hostRef = useRef<HTMLDivElement | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStyle, setSelectedStyle] = useState(initialStyle)
  const [selectedEmojiCategory, setSelectedEmojiCategory] = useState(defaultCategory)
  const [selectedEmoji, setSelectedEmoji] = useState<EmojiItem | null>(null)
  const [renderLimit, setRenderLimit] = useState(renderBatchSize)

  const messages = useMemo(() => getEmojiMessages(locale), [locale])
  const localizedStyles = useMemo(() => getEmojiStyles(locale), [locale])
  const emojiNamesKey = useMemo(() => (emojiNames ?? []).join('|'), [emojiNames])
  const effectiveCategories = useMemo(() => {
    if (categories?.length) {
      return categories
    }

    if (preset || emojiNames?.length) {
      return ['all']
    }

    return defaultCategories
  }, [categories, preset, emojiNames])
  const effectiveSearchQuery = useDeferredValue(showSearch ? searchQuery : '')
  const availableCategories = useMemo(
    () => filterCategories({ categories: effectiveCategories, preset, emojiNames }, locale),
    [effectiveCategories, preset, emojiNames, locale]
  )
  const showCategories = availableCategories.length > 2
  const resolvedButtonText = buttonText ?? messages.ui.pickerButton

  useEffect(() => {
    setSelectedStyle(initialStyle)
  }, [initialStyle])

  useEffect(() => {
    setSelectedEmojiCategory(defaultCategory)
  }, [defaultCategory, preset, emojiNamesKey, effectiveCategories])

  useEffect(() => {
    if (!showSearch && searchQuery) {
      setSearchQuery('')
    }
  }, [showSearch, searchQuery])

  useEffect(() => {
    setRenderLimit(renderBatchSize)
  }, [renderBatchSize, selectedEmojiCategory, effectiveSearchQuery, preset, emojiNamesKey])

  useEffect(() => {
    const onMouseDown = (event: MouseEvent) => {
      if (hostRef.current && !hostRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', onMouseDown)
    return () => document.removeEventListener('mousedown', onMouseDown)
  }, [])

  const panelStyle: CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width
  }

  function handleEmojiSelect(emoji: EmojiItem) {
    const nextEmoji: EmojiItemWithStyle = {
      ...emoji,
      style: selectedStyle
    }

    setSelectedEmoji(emoji)
    onSelect?.(nextEmoji)

    if (closeOnSelect) {
      setIsOpen(false)
    }
  }

  function handleClear() {
    setSelectedEmoji(null)
    onClear?.()
  }

  return (
    <div ref={hostRef} className="fem-picker">
      <button
        type="button"
        className="fem-trigger"
        disabled={disabled}
        onClick={() => setIsOpen((open) => !open)}
      >
        <span>{resolvedButtonText}</span>
        {selectedEmoji ? (
          <img
            src={buildEmojiImageUrl(baseUrl, selectedStyle, selectedEmoji.path)}
            alt={selectedEmoji.name}
            width={20}
            height={20}
          />
        ) : null}
      </button>

      {isOpen ? (
        <div className="fem-panel" style={panelStyle}>
          <div className="fem-toolbar">
            {showSearch ? (
              <input
                type="search"
                className="fem-search"
                placeholder={messages.ui.searchPlaceholder}
                value={searchQuery}
                onChange={(event) => {
                  startTransition(() => {
                    setSearchQuery(event.target.value)
                  })
                }}
              />
            ) : null}

            <select
              className="fem-style"
              value={selectedStyle}
              onChange={(event) => setSelectedStyle(event.target.value)}
            >
              {localizedStyles.map((style) => (
                <option key={style.value} value={style.value}>
                  {style.name}
                </option>
              ))}
            </select>
          </div>

          {showCategories ? (
            <div className="fem-categories">
              {availableCategories.map((category) => (
                <button
                  key={category.value}
                  type="button"
                  className={`fem-chip ${selectedEmojiCategory === category.value ? 'is-active' : ''}`}
                  onClick={() => {
                    startTransition(() => {
                      setSelectedEmojiCategory(category.value)
                    })
                  }}
                >
                  {category.icon} {category.name}
                </button>
              ))}
            </div>
          ) : null}

          <EmojiPicker
            baseUrl={baseUrl}
            selectedStyle={selectedStyle}
            locale={locale}
            categories={effectiveCategories}
            preset={preset}
            emojiNames={emojiNames}
            selectedCategory={selectedEmojiCategory}
            searchQuery={effectiveSearchQuery}
            emojiSize={emojiSize}
            columns={columns}
            autoFill={autoFill}
            renderLimit={renderLimit}
            renderBatchSize={renderBatchSize}
            onSelect={handleEmojiSelect}
            onLoadMore={() => setRenderLimit((limit) => limit + renderBatchSize)}
          />
        </div>
      ) : null}

      {showSelectedEmoji && selectedEmoji ? (
        <div className="fem-summary">
          <img
            src={buildEmojiImageUrl(baseUrl, selectedStyle, selectedEmoji.path)}
            alt={selectedEmoji.name}
            width={32}
            height={32}
          />

          <div>
            <div>{selectedEmoji.name}</div>
            <div className="fem-summary-style">{messages.ui.style}: {getStyleName(selectedStyle, locale)}</div>
          </div>

          <button type="button" className="fem-clear" onClick={handleClear}>
            {messages.ui.clear}
          </button>
        </div>
      ) : null}
    </div>
  )
}

export default FluentEmojiPicker
