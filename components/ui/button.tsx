import { cn } from '@/lib/utils'
import { ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger'
  size?: 'sm' | 'md'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-semibold rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
          variant === 'primary' && 'bg-accent text-white hover:bg-blue-700',
          variant === 'ghost' && 'bg-white text-ink border border-border hover:bg-gray-50',
          variant === 'danger' && 'bg-red-600 text-white hover:bg-red-700',
          size === 'md' && 'px-6 py-2.5 text-sm',
          size === 'sm' && 'px-3 py-1.5 text-xs',
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'
