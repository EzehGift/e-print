'use client'

import { useState, useRef } from 'react'
import { formatFileSize } from '@/lib/utils'

interface UploadedFile {
  id: string
  originalName: string
  size: number
  mimeType: string
  url: string
  isPublic: boolean
}

interface StepFilesProps {
  itemId: string
  onBack: () => void
  onSubmit: () => Promise<void>
}

export function StepFiles({ itemId, onBack, onSubmit }: StepFilesProps) {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function uploadFile(file: File, isPublic = true) {
    const fd = new FormData()
    fd.append('file', file)
    fd.append('itemId', itemId)
    fd.append('isPublic', String(isPublic))

    const res = await fetch('/api/upload', { method: 'POST', body: fd })
    if (!res.ok) {
      let msg = 'Upload failed'
      try { const e = await res.json(); msg = e.error ?? msg } catch {}
      throw new Error(msg)
    }
    return res.json() as Promise<UploadedFile>
  }

  async function handleFiles(fileList: FileList) {
    const file = fileList[0]
    if (!file) return
    setUploading(true)
    setError(null)
    try {
      const uploaded = await uploadFile(file)
      setFiles([uploaded])
    } catch (e) {
      setError((e as Error).message)
    }
    setUploading(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function togglePublic(id: string) {
    setFiles(prev => prev.map(f => f.id === id ? { ...f, isPublic: !f.isPublic } : f))
  }

  function removeFile(id: string) {
    setFiles(prev => prev.filter(f => f.id !== id))
  }

  async function handleSubmit() {
    setSubmitting(true)
    await onSubmit()
    setSubmitting(false)
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Upload document</h2>
      <p className="text-sm text-muted mb-6">One PDF or Word document per submission. Max 50MB.</p>

      {/* Drop zone — hidden once a file is uploaded */}
      {files.length === 0 && (
        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files) }}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors mb-4 ${
            dragOver
              ? 'border-accent bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-300 dark:border-slate-600 hover:border-accent dark:hover:border-accent'
          }`}
          role="button"
          tabIndex={0}
          aria-label="Upload document by clicking or dragging"
          onKeyDown={e => e.key === 'Enter' && fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".pdf,.doc,.docx"
            onChange={e => e.target.files && handleFiles(e.target.files)}
          />
          {uploading ? (
            <p className="text-sm text-muted">Uploading…</p>
          ) : (
            <>
              <p className="font-medium">Drop file here or click to browse</p>
              <p className="text-xs text-muted mt-1">PDF or Word (.pdf, .doc, .docx) · max 50MB</p>
            </>
          )}
        </div>
      )}

      {/* Uploading indicator when file already exists but we're still processing */}
      {files.length > 0 && uploading && (
        <p className="text-sm text-muted mb-4">Uploading…</p>
      )}

      {/* Error banner */}
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20 px-4 py-3 text-sm text-red-700 dark:text-red-400 flex items-start gap-2">
          <span className="mt-0.5 shrink-0">⚠</span>
          <span>{error}</span>
          <button type="button" onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-600" aria-label="Dismiss error">✕</button>
        </div>
      )}

      {/* Uploaded file */}
      {files.length > 0 && (
        <div className="card flex items-center gap-4 mb-6">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-accent">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm truncate text-ink dark:text-slate-100">{files[0].originalName}</div>
            <div className="text-xs text-muted mt-0.5">{formatFileSize(files[0].size)}</div>
          </div>
          <label className="flex items-center gap-1.5 text-xs cursor-pointer text-slate-600 dark:text-slate-300 shrink-0">
            <input
              type="checkbox"
              checked={files[0].isPublic}
              onChange={() => togglePublic(files[0].id)}
              aria-label="Toggle public access"
            />
            Public
          </label>
          <button
            type="button"
            onClick={() => removeFile(files[0].id)}
            className="shrink-0 text-xs text-red-500 hover:text-red-700 hover:underline"
            aria-label="Remove file"
          >
            Remove
          </button>
        </div>
      )}

      <div className="flex gap-3">
        <button type="button" onClick={onBack} className="btn-ghost">← Back</button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          className="btn-primary flex-1"
        >
          {submitting ? 'Submitting…' : 'Submit for review'}
        </button>
      </div>
    </div>
  )
}
