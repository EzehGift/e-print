import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { ItemType } from '@prisma/client'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export const ITEM_TYPE_LABELS: Record<ItemType, string> = {
  THESIS: 'Thesis',
  ARTICLE: 'Journal Article',
  BOOK: 'Book',
  BOOK_CHAPTER: 'Book Chapter',
  CONFERENCE_PAPER: 'Conference Paper',
  REPORT: 'Report',
  OTHER: 'Other',
}

export const ITEM_TYPE_COLORS: Record<ItemType, { bg: string; text: string }> = {
  THESIS:           { bg: 'bg-blue-100 dark:bg-blue-900/40',     text: 'text-blue-800 dark:text-blue-300' },
  ARTICLE:          { bg: 'bg-green-100 dark:bg-green-900/40',   text: 'text-green-800 dark:text-green-300' },
  BOOK:             { bg: 'bg-yellow-100 dark:bg-yellow-900/40', text: 'text-yellow-800 dark:text-yellow-300' },
  BOOK_CHAPTER:     { bg: 'bg-amber-100 dark:bg-amber-900/40',   text: 'text-amber-800 dark:text-amber-300' },
  CONFERENCE_PAPER: { bg: 'bg-purple-100 dark:bg-purple-900/40', text: 'text-purple-800 dark:text-purple-300' },
  REPORT:           { bg: 'bg-orange-100 dark:bg-orange-900/40', text: 'text-orange-800 dark:text-orange-300' },
  OTHER:            { bg: 'bg-gray-100 dark:bg-gray-700',        text: 'text-gray-700 dark:text-gray-300' },
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trimEnd() + '…'
}

export function generateItemUri(year: number, count: number): string {
  return `gouni-eprint-${year}-${String(count).padStart(4, '0')}`
}
