'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { ITEM_TYPE_LABELS } from '@/lib/utils'
import { ItemType } from '@prisma/client'

interface Suggestion {
  id: string
  title: string
  type: ItemType
  year: number
  authorName: string | null
}

interface SearchAutocompleteProps {
  defaultValue?: string
  inputClassName?: string
  buttonClassName?: string
  buttonText?: string
  wrapperClassName?: string
}

function HighlightMatch({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`(${escaped})`, 'gi')
  const parts = text.split(regex)
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="bg-blue-100 text-blue-800 rounded-sm not-italic font-semibold">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  )
}

export function SearchAutocomplete({
  defaultValue = '',
  inputClassName = 'input flex-1',
  buttonClassName = 'btn-primary',
  buttonText = 'Search',
  wrapperClassName = '',
}: SearchAutocompleteProps) {
  const router = useRouter()
  const [value, setValue] = useState(defaultValue)
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>()

  // Close dropdown when clicking outside
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  // Fetch suggestions with debounce
  useEffect(() => {
    clearTimeout(debounceRef.current)
    if (value.trim().length < 2) {
      setSuggestions([])
      setOpen(false)
      return
    }
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/search/suggestions?q=${encodeURIComponent(value.trim())}`
        )
        if (!res.ok) return
        const data = await res.json()
        setSuggestions(data.items ?? [])
        setOpen((data.items ?? []).length > 0)
        setActiveIndex(-1)
      } catch {
        setSuggestions([])
      }
    }, 250)
    return () => clearTimeout(debounceRef.current)
  }, [value])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (activeIndex >= 0 && suggestions[activeIndex]) {
      router.push(`/items/${suggestions[activeIndex].id}`)
    } else if (value.trim()) {
      router.push(`/search?q=${encodeURIComponent(value.trim())}`)
    }
    setOpen(false)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open || suggestions.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex(i => Math.min(i + 1, suggestions.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex(i => Math.max(i - 1, -1))
    } else if (e.key === 'Escape') {
      setOpen(false)
      setActiveIndex(-1)
    }
  }

  return (
    <div ref={wrapperRef} className={cn('relative', wrapperClassName)}>
      <form onSubmit={handleSubmit} className="flex gap-2.5">
        <input
          type="search"
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => { if (suggestions.length > 0) setOpen(true) }}
          placeholder="Search by title, author, or keyword…"
          className={inputClassName}
          autoComplete="off"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-label="Search the repository"
        />
        <button type="submit" className={buttonClassName}>
          {buttonText}
        </button>
      </form>

      {open && suggestions.length > 0 && (
        <div
          className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-xl z-50 overflow-hidden"
          style={{
            border: '1px solid #e2e8f0',
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.12), 0 4px 10px -5px rgba(0,0,0,0.08)',
          }}
          role="listbox"
          aria-label="Search suggestions"
        >
          {suggestions.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => { router.push(`/items/${s.id}`); setOpen(false) }}
              onMouseEnter={() => setActiveIndex(i)}
              className={cn(
                'w-full text-left px-4 py-3 flex items-start gap-3 transition-colors border-b border-slate-100 last:border-0',
                i === activeIndex ? 'bg-slate-50' : 'hover:bg-slate-50'
              )}
              role="option"
              aria-selected={i === activeIndex}
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-ink line-clamp-1">
                  <HighlightMatch text={s.title} query={value} />
                </p>
                {s.authorName && (
                  <p className="text-xs text-muted mt-0.5">{s.authorName}</p>
                )}
              </div>
              <div className="shrink-0 flex items-center gap-2 mt-0.5">
                <span className="text-[10px] font-semibold uppercase tracking-wide text-muted">
                  {ITEM_TYPE_LABELS[s.type]}
                </span>
                <span className="text-xs text-slate-300">·</span>
                <span className="text-xs text-muted tabular-nums">{s.year}</span>
              </div>
            </button>
          ))}

          <button
            type="button"
            onClick={() => { router.push(`/search?q=${encodeURIComponent(value.trim())}`); setOpen(false) }}
            className="w-full text-left px-4 py-2.5 bg-slate-50/80 hover:bg-slate-100 transition-colors"
          >
            <span className="text-sm text-accent font-medium">
              See all results for &ldquo;{value.trim()}&rdquo; →
            </span>
          </button>
        </div>
      )}
    </div>
  )
}
