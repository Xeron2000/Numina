import { ComponentPropsWithoutRef, forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'

interface ToggleProps extends Omit<ComponentPropsWithoutRef<'input'>, 'size'> {
  variant?: 'primary' | 'secondary' | 'accent'
  size?: 'xs' | 'sm' | 'md' | 'lg'
}

const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const variantClasses = {
      primary: 'toggle-primary',
      secondary: 'toggle-secondary',
      accent: 'toggle-accent',
    }

    const sizeClasses = {
      xs: 'toggle-xs',
      sm: 'toggle-sm',
      md: 'toggle-md',
      lg: 'toggle-lg',
    }

    return (
      <input
        ref={ref}
        type="checkbox"
        className={twMerge(
          'toggle',
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      />
    )
  }
)

Toggle.displayName = 'Toggle'

export default Toggle