'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export function LiveSearchBar({ defaultValue = '' }: { defaultValue?: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [value, setValue] = useState(defaultValue)
  const [isPending, startTransition] = useTransition()
  const debounceRef = useRef<ReturnType<typeof setTimeout>>()
  const isFirst = useRef(true)

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false
      return
    }
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      if (value.trim()) {
        params.set('q', value.trim())
      } else {
        params.delete('q')
      }
      params.delete('page')
      startTransition(() => {
        router.replace(`/search?${params.toString()}`, { scroll: false })
      })
    }, 350)
    return () => clearTimeout(debounceRef.current)
  }, [value])

  return (
    <div className="relative mb-7">
      <input
        type="search"
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder="Search by title, author, or keyword…"
        className="input w-full h-12 text-base pr-10"
        aria-label="Search the repository"
      />
      {isPending && (
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
          <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  )
}
