'use client'

import { useState, useEffect } from 'react'

interface Division {
  id: string
  name: string
  level: string
  children: Division[]
}

interface DivisionSelectProps {
  facultyValue: string
  departmentValue: string
  onFacultyChange: (id: string) => void
  onDepartmentChange: (id: string) => void
  error?: string
}

export function DivisionSelect({
  facultyValue,
  departmentValue,
  onFacultyChange,
  onDepartmentChange,
  error,
}: DivisionSelectProps) {
  const [tree, setTree] = useState<Division[]>([])
  const [faculties, setFaculties] = useState<Division[]>([])
  const [departments, setDepartments] = useState<Division[]>([])

  useEffect(() => {
    fetch('/api/divisions')
      .then(r => r.json())
      .then((nodes: Division[]) => {
        setTree(nodes)
        const facs = nodes.flatMap(n =>
          n.level === 'FACULTY'
            ? [n]
            : n.children?.filter(c => c.level === 'FACULTY') ?? []
        )
        setFaculties(facs)
      })
  }, [])

  useEffect(() => {
    if (!facultyValue) { setDepartments([]); return }
    const fac = faculties.find(f => f.id === facultyValue) ??
      tree.flatMap(n => n.children ?? []).find(c => c.id === facultyValue)
    setDepartments(fac?.children?.filter(c => c.level === 'DEPARTMENT') ?? [])
  }, [facultyValue, faculties, tree])

  return (
    <div className="space-y-3">
      <div>
        <label className="label">Faculty <span className="text-red-500">*</span></label>
        <select
          className="input"
          value={facultyValue}
          onChange={e => { onFacultyChange(e.target.value); onDepartmentChange('') }}
          aria-label="Select faculty"
        >
          <option value="">— Select faculty —</option>
          {faculties.map(f => (
            <option key={f.id} value={f.id}>{f.name}</option>
          ))}
        </select>
      </div>
      {departments.length > 0 && (
        <div>
          <label className="label">Department <span className="text-red-500">*</span></label>
          <select
            className="input"
            value={departmentValue}
            onChange={e => onDepartmentChange(e.target.value)}
            aria-label="Select department"
          >
            <option value="">— Select department —</option>
            {departments.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>
      )}
      {error && <p className="field-error">{error}</p>}
    </div>
  )
}
