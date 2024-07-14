import type { ReactNode } from 'react'

import { twMerge } from 'tailwind-merge'

const CardGrid = ({
  children,
  className = '',
  ...props
}: {
  children: ReactNode
  className?: string
}) => {
  return (
    <div
      className={twMerge(
        'grid gap-[14px] grid-cols-[repeat(auto-fit,minmax(200px,1fr))]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export default CardGrid
