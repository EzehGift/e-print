import { ItemType } from '@prisma/client'
import { ITEM_TYPE_LABELS } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface StepTypeProps {
  selectedType: ItemType | null
  onNext: (type: ItemType) => void
}

const TYPE_DESCRIPTIONS: Partial<Record<ItemType, string>> = {
  THESIS:           "Doctoral or master's dissertation",
  ARTICLE:          'Peer-reviewed journal article',
  BOOK:             'Authored monograph',
  BOOK_CHAPTER:     'Chapter within an edited volume',
  CONFERENCE_PAPER: 'Conference paper or proceedings',
  REPORT:           'Technical or research report',
  OTHER:            'Any other scholarly output',
}

export function StepType({ selectedType, onNext }: StepTypeProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-1.5">Select item type</h2>
      <p className="text-sm text-muted mb-7">Choose the type that best describes your work.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {Object.values(ItemType).map(type => (
          <button
            key={type}
            onClick={() => onNext(type)}
            className={cn(
              'text-left card hover:shadow-md transition-all cursor-pointer',
              selectedType === type
                ? 'ring-2 ring-accent border-accent bg-blue-50/50 dark:bg-blue-900/20'
                : 'hover:border-slate-300 dark:hover:border-slate-500'
            )}
            aria-pressed={selectedType === type}
          >
            <div className="font-semibold text-[15px] mb-1">{ITEM_TYPE_LABELS[type]}</div>
            <div className="text-xs text-muted leading-snug">{TYPE_DESCRIPTIONS[type] ?? ''}</div>
          </button>
        ))}
      </div>
    </div>
  )
}
