import {
  DEFAULT_BASE_URL,
  DEFAULT_RENDER_BATCH_SIZE,
  buildEmojiImageUrl,
  defaultCategories,
  defaultEmojiLocale,
  filterCategories,
  getEmojiMessages,
  getEmojiPreset,
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

type SearchMode = 'toggle' | 'inline' | 'hidden'
type CategoryTabKind = 'recent' | 'common' | 'category'

interface CategoryTab {
  value: string
  name: string
  icon?: string
  kind: CategoryTabKind
}

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
  searchMode?: SearchMode
  showStyleSelect?: boolean
  showCategoryTabs?: boolean
  showCommonCategory?: boolean
  commonEmojiNames?: string[]
  recentEmojiNames?: string[]
  recentLimit?: number
  persistRecent?: boolean
  storageKey?: string
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
  searchMode = 'toggle',
  showStyleSelect = true,
  showCategoryTabs = true,
  showCommonCategory = true,
  commonEmojiNames,
  recentEmojiNames,
  recentLimit = 12,
  persistRecent = true,
  storageKey = 'fluent-emoji-ms:recent',
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
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isOptionsOpen, setIsOptionsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStyle, setSelectedStyle] = useState(initialStyle)
  const [selectedEmojiCategory, setSelectedEmojiCategory] = useState(defaultCategory)
  const [selectedEmoji, setSelectedEmoji] = useState<EmojiItem | null>(null)
  const [renderLimit, setRenderLimit] = useState(renderBatchSize)
  const [storedRecentEmojiNames, setStoredRecentEmojiNames] = useState<string[]>([])

  const messages = useMemo(() => getEmojiMessages(locale), [locale])
  const localizedStyles = useMemo(() => getEmojiStyles(locale), [locale])
  const commonPreset = useMemo(() => getEmojiPreset('common', locale), [locale])
  const resolvedCommonEmojiNames = commonEmojiNames?.length ? commonEmojiNames : commonPreset.emojiNames
  const resolvedRecentEmojiNames = useMemo(() => {
    const sourceNames = recentEmojiNames?.length ? recentEmojiNames : storedRecentEmojiNames
    return sourceNames.filter(Boolean).slice(0, recentLimit)
  }, [recentEmojiNames, storedRecentEmojiNames, recentLimit])
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
  const effectiveSearchQuery = useDeferredValue(showSearch && searchMode !== 'hidden' ? searchQuery : '')
  const availableCategories = useMemo(
    () => filterCategories({ categories: effectiveCategories, preset, emojiNames }, locale),
    [effectiveCategories, preset, emojiNames, locale]
  )
  const resolvedButtonText = buttonText ?? messages.ui.pickerButton
  const searchButtonLabel = locale === 'en-US' ? 'Search' : '搜索'
  const optionsButtonLabel = locale === 'en-US' ? 'Options' : '更多'
  const recentTabName = locale === 'en-US' ? 'Recent' : '最近'
  const categoryTabs = useMemo<CategoryTab[]>(() => {
    const tabs: CategoryTab[] = []

    if (resolvedRecentEmojiNames.length) {
      tabs.push({
        value: 'recent',
        name: recentTabName,
        icon: '🕘',
        kind: 'recent'
      })
    }

    if (showCommonCategory && resolvedCommonEmojiNames.length) {
      tabs.push({
        value: 'common',
        name: commonPreset.label,
        icon: '⭐',
        kind: 'common'
      })
    }

    if (showCategoryTabs) {
      tabs.push(
        ...availableCategories
          .filter((category) => category.value !== 'all')
          .map((category) => ({
            value: category.value,
            name: category.name,
            icon: category.icon,
            kind: 'category' as const
          }))
      )
    }

    return tabs
  }, [
    availableCategories,
    commonPreset.label,
    recentTabName,
    resolvedCommonEmojiNames,
    resolvedRecentEmojiNames,
    showCategoryTabs,
    showCommonCategory
  ])
  const [activeTab, setActiveTab] = useState(() => resolvedRecentEmojiNames.length ? 'recent' : 'common')
  const activeCategoryTab = categoryTabs.find((tab) => tab.value === activeTab)
  const shouldShowInlineSearch = showSearch && (searchMode === 'inline' || (searchMode === 'toggle' && isSearchOpen))
  const shouldShowSearchToggle = showSearch && searchMode === 'toggle'
  const pickerEmojiNames = activeCategoryTab?.kind === 'recent'
    ? resolvedRecentEmojiNames
    : activeCategoryTab?.kind === 'common'
      ? resolvedCommonEmojiNames
      : emojiNames
  const pickerPreset = activeCategoryTab?.kind === 'category' || !activeCategoryTab ? preset : undefined
  const pickerCategories = activeCategoryTab?.kind === 'category' || !activeCategoryTab ? effectiveCategories : ['all']
  const pickerSelectedCategory = activeCategoryTab?.kind === 'category'
    ? activeTab
    : !activeCategoryTab
      ? selectedEmojiCategory
      : 'all'

  useEffect(() => {
    setSelectedStyle(initialStyle)
  }, [initialStyle])

  useEffect(() => {
    setSelectedEmojiCategory(defaultCategory)
    setActiveTab(defaultCategory)
  }, [defaultCategory, preset, emojiNamesKey, effectiveCategories])

  useEffect(() => {
    if (!showSearch && searchQuery) {
      setSearchQuery('')
    }
    if (!showSearch) {
      setIsSearchOpen(false)
    }
  }, [showSearch, searchQuery])

  useEffect(() => {
    if (searchMode === 'hidden' && searchQuery) {
      setSearchQuery('')
    }
    if (searchMode !== 'toggle') {
      setIsSearchOpen(false)
    }
  }, [searchMode, searchQuery])

  useEffect(() => {
    if (typeof window === 'undefined' || !persistRecent || recentEmojiNames?.length) {
      return
    }

    try {
      const storedValue = window.localStorage.getItem(storageKey)
      const parsedValue = storedValue ? JSON.parse(storedValue) : []
      if (Array.isArray(parsedValue)) {
        const nextNames = parsedValue.filter((item): item is string => typeof item === 'string')
        setStoredRecentEmojiNames(nextNames)
        if (nextNames.length) {
          setActiveTab('recent')
        }
      }
    } catch {
      setStoredRecentEmojiNames([])
    }
  }, [persistRecent, recentEmojiNames, storageKey])

  useEffect(() => {
    if (!categoryTabs.length) {
      return
    }

    if (!categoryTabs.some((tab) => tab.value === activeTab)) {
      setActiveTab(categoryTabs[0].value)
    }
  }, [activeTab, categoryTabs])

  useEffect(() => {
    setRenderLimit(renderBatchSize)
  }, [renderBatchSize, selectedEmojiCategory, effectiveSearchQuery, preset, emojiNamesKey, activeTab])

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
    rememberRecentEmoji(emoji.name)
    onSelect?.(nextEmoji)

    if (closeOnSelect) {
      setIsOpen(false)
    }
  }

  function rememberRecentEmoji(name: string) {
    if (!persistRecent || recentEmojiNames?.length) {
      return
    }

    setStoredRecentEmojiNames((currentNames) => {
      const nextNames = [name, ...currentNames.filter((item) => item !== name)].slice(0, recentLimit)

      if (typeof window !== 'undefined') {
        try {
          window.localStorage.setItem(storageKey, JSON.stringify(nextNames))
        } catch {
          // Storage is best-effort and should never block selection.
        }
      }

      return nextNames
    })
    setActiveTab('recent')
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
          <div className="fem-quick-toolbar">
            {categoryTabs.length ? (
              <div className="fem-category-tabs" role="tablist">
                {categoryTabs.map((tab) => (
                  <button
                    key={tab.value}
                    type="button"
                    className={`fem-category-tab ${activeTab === tab.value ? 'is-active' : ''}`}
                    title={tab.name}
                    role="tab"
                    aria-selected={activeTab === tab.value}
                    onClick={() => {
                      startTransition(() => {
                        setActiveTab(tab.value)
                        setSelectedEmojiCategory(tab.value)
                      })
                    }}
                  >
                    <span className="fem-category-tab-icon">{tab.icon}</span>
                    {activeTab === tab.value ? <span className="fem-category-tab-label">{tab.name}</span> : null}
                  </button>
                ))}
              </div>
            ) : null}

            <div className="fem-toolbar-actions">
              {shouldShowSearchToggle ? (
                <button
                  type="button"
                  className={`fem-icon-button ${isSearchOpen ? 'is-active' : ''}`}
                  title={searchButtonLabel}
                  aria-label={searchButtonLabel}
                  onClick={() => {
                    setIsSearchOpen((open) => {
                      if (open && searchQuery) {
                        setSearchQuery('')
                      }
                      return !open
                    })
                  }}
                >
                  ⌕
                </button>
              ) : null}
              {showStyleSelect ? (
                <button
                  type="button"
                  className={`fem-icon-button ${isOptionsOpen ? 'is-active' : ''}`}
                  title={optionsButtonLabel}
                  aria-label={optionsButtonLabel}
                  onClick={() => setIsOptionsOpen((open) => !open)}
                >
                  ⋯
                </button>
              ) : null}
            </div>
          </div>

          {shouldShowInlineSearch ? (
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

          {showStyleSelect && isOptionsOpen ? (
            <div className="fem-options-panel">
              <span className="fem-options-label">{messages.ui.style}</span>
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
          ) : null}

          <EmojiPicker
            baseUrl={baseUrl}
            selectedStyle={selectedStyle}
            locale={locale}
            categories={pickerCategories}
            preset={pickerPreset}
            emojiNames={pickerEmojiNames}
            selectedCategory={pickerSelectedCategory}
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
