import type { ReactNode } from 'react'

import { twMerge } from 'tailwind-merge'

const Stack = ({
  children,
  className = '',
  ...props
}: {
  children: ReactNode
  className?: string
}) => {
  return (
    <div className={twMerge('flex flex-col ', className)} {...props}>
      {children}
    </div>
  )
}

export default Stack
