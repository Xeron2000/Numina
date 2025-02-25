import { ComponentPropsWithoutRef, forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'

interface TabsProps extends ComponentPropsWithoutRef<'div'> {
  variant?: 'boxed' | 'bordered' | 'lifted'
}

const Tabs = forwardRef<HTMLDivElement, TabsProps>(
  ({ className, variant = 'boxed', ...props }, ref) => {
    const baseClasses = 'tabs'
    const variantClasses = {
      boxed: 'tabs-boxed',
      bordered: 'tabs-bordered',
      lifted: 'tabs-lifted',
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

Tabs.displayName = 'Tabs'

export default Tabs