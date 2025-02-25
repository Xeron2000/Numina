import { ComponentPropsWithoutRef, forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'

interface CardBodyProps extends ComponentPropsWithoutRef<'div'> {
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const CardBody = forwardRef<HTMLDivElement, CardBodyProps>(
  ({ className, padding = 'md', ...props }, ref) => {
    const paddingClasses = {
      none: 'p-0',
      sm: 'p-2',
      md: 'p-4',
      lg: 'p-6',
    }

    return (
      <div
        ref={ref}
        className={twMerge(paddingClasses[padding], className)}
        {...props}
      />
    )
  }
)

CardBody.displayName = 'CardBody'

export default CardBody