import type { ReactNode } from 'react'

import { twMerge } from 'tailwind-merge'

const NoBreak = ({ children, className = '' }: { children: ReactNode; className?: string }) => {
  return <span className={twMerge('break-keep whitespace-nowrap', className)}>{children}</span>
}

export default NoBreak
