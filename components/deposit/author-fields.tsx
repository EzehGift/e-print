'use client'

import { useFieldArray } from 'react-hook-form'

interface AuthorFieldsProps {
  control: any // react-hook-form requires any here for dynamic field names
  errors: any
  name?: string
}

export function AuthorFields({ control, errors, name = 'authors' }: AuthorFieldsProps) {
  const { fields, append, remove } = useFieldArray({ control, name })

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="label">Authors <span className="text-red-500">*</span></label>
        <button
          type="button"
          onClick={() => append({ firstName: '', lastName: '', email: '', orcid: '' })}
          className="text-xs text-accent hover:underline"
          aria-label="Add author"
        >
          + Add author
        </button>
      </div>

      {fields.length === 0 && (
        <button
          type="button"
          onClick={() => append({ firstName: '', lastName: '', email: '', orcid: '' })}
          className="w-full border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg p-4 text-sm text-muted hover:border-accent hover:text-accent transition-colors"
        >
          + Add first author
        </button>
      )}

      <div className="space-y-3">
        {fields.map((field, index) => (
          <div key={field.id} className="card relative">
            <div className="absolute top-3 right-3">
              <button
                type="button"
                onClick={() => remove(index)}
                className="text-xs text-red-500 hover:underline"
                aria-label={`Remove author ${index + 1}`}
              >
                Remove
              </button>
            </div>
            <div className="text-xs font-semibold text-muted mb-3">Author {index + 1}</div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label text-xs">Last name *</label>
                <input type="text" className="input text-sm" {...control.register(`${name}.${index}.lastName`)} />
              </div>
              <div>
                <label className="label text-xs">First name *</label>
                <input type="text" className="input text-sm" {...control.register(`${name}.${index}.firstName`)} />
              </div>
              <div>
                <label className="label text-xs">Email (optional)</label>
                <input type="email" className="input text-sm" {...control.register(`${name}.${index}.email`)} />
              </div>
              <div>
                <label className="label text-xs">ORCID (optional)</label>
                <input
                  type="text"
                  placeholder="0000-0000-0000-0000"
                  className="input text-sm"
                  {...control.register(`${name}.${index}.orcid`)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      {errors[name] && (
        <p className="field-error mt-1">
          {typeof errors[name]?.message === 'string' ? errors[name]?.message : 'Author information is incomplete'}
        </p>
      )}
    </div>
  )
}
