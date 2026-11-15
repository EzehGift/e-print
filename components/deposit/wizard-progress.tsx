import { cn } from '@/lib/utils'

interface WizardProgressProps {
  currentStep: number
  steps: string[]
}

export function WizardProgress({ currentStep, steps }: WizardProgressProps) {
  return (
    <div className="flex items-center mb-10">
      {steps.map((label, i) => (
        <div key={label} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center">
            <div
              className={cn(
                'w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all',
                i < currentStep
                  ? 'bg-emerald-500 text-white'
                  : i === currentStep
                  ? 'bg-accent text-white ring-4 ring-blue-100 dark:ring-blue-900'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500'
              )}
              aria-current={i === currentStep ? 'step' : undefined}
            >
              {i < currentStep ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              ) : i + 1}
            </div>
            <span
              className={cn(
                'text-xs mt-1.5 whitespace-nowrap font-medium',
                i === currentStep
                  ? 'text-navy dark:text-blue-400'
                  : i < currentStep
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-muted dark:text-slate-500'
              )}
            >
              {label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={cn(
                'flex-1 h-0.5 mx-3 mb-5 rounded-full transition-colors',
                i < currentStep ? 'bg-emerald-400' : 'bg-slate-200 dark:bg-slate-700'
              )}
            />
          )}
        </div>
      ))}
    </div>
  )
}
