'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createItemSchema, CreateItemInput } from '@/lib/validation'
import { ItemType } from '@prisma/client'
import { AuthorFields } from './author-fields'
import { DivisionSelect } from './division-select'

interface Subject { id: string; name: string }

interface StepMetadataProps {
  itemType: ItemType
  defaultValues?: Partial<CreateItemInput>
  onNext: (data: CreateItemInput) => Promise<void>
  onBack: () => void
  subjects: Subject[]
}

export function StepMetadata({ itemType, defaultValues, onNext, onBack, subjects }: StepMetadataProps) {
  const [keywordInput, setKeywordInput] = useState('')
  const [keywords, setKeywords] = useState<string[]>(defaultValues?.keywords ?? [])
  const [facultyId, setFacultyId] = useState(defaultValues?.divisionId ?? '')
  const [divisionId, setDivisionId] = useState(defaultValues?.divisionId ?? '')

  const currentYear = new Date().getFullYear()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<CreateItemInput>({
    resolver: zodResolver(createItemSchema),
    defaultValues: {
      type: itemType,
      language: 'English',
      year: currentYear,
      authors: [{ firstName: '', lastName: '', email: '', orcid: '' }],
      subjectIds: [],
      divisionId: defaultValues?.divisionId ?? '',
      ...defaultValues,
    },
  })

  function addKeyword(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault()
      const val = keywordInput.trim()
      if (val && !keywords.includes(val)) {
        const next = [...keywords, val]
        setKeywords(next)
        setValue('keywords', next)
      }
      setKeywordInput('')
    }
  }

  function removeKeyword(kw: string) {
    const next = keywords.filter(k => k !== kw)
    setKeywords(next)
    setValue('keywords', next)
  }

  async function onSubmit(data: CreateItemInput) {
    data.divisionId = divisionId || facultyId
    data.keywords = keywords
    await onNext(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <h2 className="text-xl font-bold mb-6">Item details</h2>

      {/* Title */}
      <div className="mb-4">
        <label htmlFor="title" className="label">Title <span className="text-red-500">*</span></label>
        <input id="title" type="text" className="input" {...register('title')} />
        {errors.title && <p className="field-error">{errors.title.message}</p>}
      </div>

      {/* Abstract */}
      <div className="mb-4">
        <label htmlFor="abstract" className="label">Abstract <span className="text-red-500">*</span></label>
        <textarea
          id="abstract"
          rows={6}
          className="input h-auto py-2"
          placeholder="Minimum 100 characters"
          {...register('abstract')}
        />
        {errors.abstract && <p className="field-error">{errors.abstract.message}</p>}
      </div>

      {/* Authors */}
      <div className="mb-4">
        <AuthorFields control={control} errors={errors} />
      </div>

      {/* Year & Language */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="year" className="label">Year <span className="text-red-500">*</span></label>
          <input
            id="year"
            type="number"
            min={1900}
            max={currentYear}
            className="input"
            {...register('year', { valueAsNumber: true })}
          />
          {errors.year && <p className="field-error">{errors.year.message}</p>}
        </div>
        <div>
          <label htmlFor="language" className="label">Language</label>
          <input id="language" type="text" className="input" defaultValue="English" {...register('language')} />
        </div>
      </div>

      {/* DOI */}
      <div className="mb-4">
        <label htmlFor="doi" className="label">DOI <span className="text-muted font-normal">(optional)</span></label>
        <input id="doi" type="text" className="input" placeholder="10.xxxx/xxxxx" {...register('doi')} />
      </div>

      {/* Faculty / Department */}
      <div className="mb-4">
        <DivisionSelect
          facultyValue={facultyId}
          departmentValue={divisionId}
          onFacultyChange={id => { setFacultyId(id); setDivisionId(id); setValue('divisionId', id, { shouldValidate: true }) }}
          onDepartmentChange={id => { setDivisionId(id); setValue('divisionId', id, { shouldValidate: true }) }}
          error={errors.divisionId?.message}
        />
      </div>

      {/* Subjects */}
      <div className="mb-4">
        <label className="label">Subjects</label>
        <div className="grid grid-cols-2 gap-1 max-h-40 overflow-y-auto border border-border dark:border-slate-700 rounded-md p-3">
          {subjects.map(s => (
            <label key={s.id} className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" value={s.id} {...register('subjectIds')} />
              {s.name}
            </label>
          ))}
        </div>
      </div>

      {/* Keywords */}
      <div className="mb-6">
        <label className="label">Keywords</label>
        <input
          type="text"
          className="input"
          placeholder="Type a keyword and press Enter"
          value={keywordInput}
          onChange={e => setKeywordInput(e.target.value)}
          onKeyDown={addKeyword}
        />
        {keywords.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {keywords.map(kw => (
              <span key={kw} className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 dark:bg-slate-700 text-sm text-ink dark:text-slate-200 rounded">
                {kw}
                <button type="button" onClick={() => removeKeyword(kw)} className="text-gray-400 dark:text-slate-400 hover:text-red-500" aria-label={`Remove keyword ${kw}`}>×</button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        <button type="button" onClick={onBack} className="btn-ghost">← Back</button>
        <button type="submit" disabled={isSubmitting} className="btn-primary flex-1">
          {isSubmitting ? 'Saving…' : 'Next: Upload files →'}
        </button>
      </div>
    </form>
  )
}
