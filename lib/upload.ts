import { v4 as uuidv4 } from 'uuid'
import path from 'path'
import fs from 'fs/promises'

const EXT_MIME_MAP: Record<string, string> = {
  '.pdf':  'application/pdf',
  '.doc':  'application/msword',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
}

export interface StorageAdapter {
  save(buffer: Buffer, itemId: string, originalName: string): Promise<string>
  delete(url: string): Promise<void>
}

export class LocalStorageAdapter implements StorageAdapter {
  private baseDir: string

  constructor(baseDir?: string) {
    this.baseDir = baseDir ?? path.join(process.cwd(), 'public', 'uploads')
  }

  async save(buffer: Buffer, itemId: string, originalName: string): Promise<string> {
    const ext = path.extname(originalName)
    const filename = `${uuidv4()}${ext}`
    const dir = path.join(this.baseDir, itemId)
    await fs.mkdir(dir, { recursive: true })
    await fs.writeFile(path.join(dir, filename), buffer)
    return `/uploads/${itemId}/${filename}`
  }

  async delete(url: string): Promise<void> {
    const relative = url.replace('/uploads/', '')
    const filePath = path.join(this.baseDir, relative)
    await fs.unlink(filePath).catch(() => { /* ignore if not found */ })
  }
}

export class PrivateStorageAdapter implements StorageAdapter {
  private baseDir: string

  constructor() {
    this.baseDir = path.join(process.cwd(), 'private-uploads')
  }

  async save(buffer: Buffer, itemId: string, originalName: string): Promise<string> {
    const ext = path.extname(originalName)
    const filename = `${uuidv4()}${ext}`
    const dir = path.join(this.baseDir, itemId)
    await fs.mkdir(dir, { recursive: true })
    await fs.writeFile(path.join(dir, filename), buffer)
    return `/private-uploads/${itemId}/${filename}`
  }

  async delete(url: string): Promise<void> {
    const relative = url.replace('/private-uploads/', '')
    const filePath = path.join(this.baseDir, relative)
    await fs.unlink(filePath).catch(() => { /* ignore */ })
  }

  async getFilePath(url: string): Promise<string> {
    const relative = url.replace('/private-uploads/', '')
    return path.join(this.baseDir, relative)
  }
}

export const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]

export const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB

export function validateFile(file: File): { valid: boolean; error?: string } {
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: 'File size exceeds 50MB limit' }
  }
  const effectiveType = file.type || EXT_MIME_MAP[path.extname(file.name).toLowerCase()] || ''
  if (!ALLOWED_MIME_TYPES.includes(effectiveType)) {
    return { valid: false, error: `File type "${path.extname(file.name) || file.type}" is not allowed. Only PDF and Word documents (.pdf, .doc, .docx) are accepted.` }
  }
  return { valid: true }
}

export const publicStorage = new LocalStorageAdapter()
export const privateStorage = new PrivateStorageAdapter()
