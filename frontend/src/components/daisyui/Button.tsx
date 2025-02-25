import { ComponentPropsWithoutRef, forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'

interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'link'
  size?: 'xs' | 'sm' | 'md' | 'lg'
  shape?: 'square' | 'circle'
  loading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className,
    variant = 'primary',
    size = 'md',
    shape,
    loading,
    ...props
  }, ref) => {
    const variantClasses = {
      primary: 'btn-primary',
      secondary: 'btn-secondary',
      accent: 'btn-accent',
      ghost: 'btn-ghost',
      link: 'btn-link',
    }

    const sizeClasses = {
      xs: 'btn-xs',
      sm: 'btn-sm',
      md: 'btn-md',
      lg: 'btn-lg',
    }

    const shapeClasses = {
      square: 'btn-square',
      circle: 'btn-circle',
    }

    return (
      <button
        ref={ref}
        className={twMerge(
          'btn',
          variantClasses[variant],
          sizeClasses[size],
          shape && shapeClasses[shape],
          loading && 'loading',
          className
        )}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'

export default Button