import { ComponentPropsWithoutRef, forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'

interface TabProps extends ComponentPropsWithoutRef<'a'> {
  active?: boolean
}

const Tab = forwardRef<HTMLAnchorElement, TabProps>(
  ({ className, active = false, ...props }, ref) => {
    return (
      <a
        ref={ref}
        className={twMerge(
          'tab',
          active && 'tab-active',
          className
        )}
        {...props}
      />
    )
  }
)

Tab.displayName = 'Tab'

export default Tab