'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

interface CitationBoxProps {
  apa: string
  mla: string
  bibtex: string
}

type Tab = 'apa' | 'mla' | 'bibtex'

export function CitationBox({ apa, mla, bibtex }: CitationBoxProps) {
  const [tab, setTab] = useState<Tab>('apa')
  const [copied, setCopied] = useState(false)

  const texts: Record<Tab, string> = { apa, mla, bibtex }
  const current = texts[tab]

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(current)
    } catch {
      const el = document.createElement('textarea')
      el.value = current
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="card">
      <h3 className="text-sm font-semibold text-ink dark:text-slate-100 mb-3">Cite This Item</h3>
      <div className="flex gap-0 mb-3 border-b border-border dark:border-slate-700">
        {(['apa', 'mla', 'bibtex'] as Tab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              'px-3.5 py-2 text-xs font-semibold border-b-2 -mb-px transition-colors',
              tab === t
                ? 'border-accent text-accent'
                : 'border-transparent text-muted dark:text-slate-400 hover:text-ink dark:hover:text-slate-200'
            )}
            aria-selected={tab === t}
            role="tab"
          >
            {t.toUpperCase()}
          </button>
        ))}
      </div>
      <pre className="text-xs bg-slate-50 dark:bg-slate-700/60 rounded-lg p-3 whitespace-pre-wrap font-mono leading-relaxed text-slate-700 dark:text-slate-300 border border-border dark:border-slate-700">
        {current}
      </pre>
      <button
        onClick={handleCopy}
        className="mt-2.5 text-xs font-semibold text-accent hover:underline transition-colors"
        aria-label="Copy citation to clipboard"
      >
        {copied ? (
          <span className="inline-flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Copied!
          </span>
        ) : 'Copy to clipboard'}
      </button>
    </div>
  )
}
