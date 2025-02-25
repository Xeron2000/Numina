import { ComponentPropsWithoutRef, forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'

interface CardProps extends ComponentPropsWithoutRef<'div'> {
  variant?: 'default' | 'bordered' | 'ghost'
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const baseClasses = 'rounded-box bg-base-100 shadow'
    const variantClasses = {
      default: '',
      bordered: 'border border-base-200',
      ghost: 'bg-opacity-50',
    }

    return (
      <div
        ref={ref}
        className={twMerge(baseClasses, variantClasses[variant], className)}
        {...props}
      />
    )
  }
)

Card.displayName = 'Card'

export default Card