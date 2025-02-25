import { ComponentPropsWithoutRef, forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'

interface SelectProps extends Omit<ComponentPropsWithoutRef<'select'>, 'size'> {
  variant?: 'primary' | 'secondary' | 'accent'
  size?: 'xs' | 'sm' | 'md' | 'lg'
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const variantClasses = {
      primary: 'select-primary',
      secondary: 'select-secondary',
      accent: 'select-accent',
    }

    const sizeClasses = {
      xs: 'select-xs',
      sm: 'select-sm',
      md: 'select-md',
      lg: 'select-lg',
    }

    return (
      <select
        ref={ref}
        className={twMerge(
          'select',
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      />
    )
  }
)

Select.displayName = 'Select'

export default Select