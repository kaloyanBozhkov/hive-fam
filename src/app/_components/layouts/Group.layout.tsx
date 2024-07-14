import type { ReactNode } from 'react'

import { twMerge } from 'tailwind-merge'

const Group = ({ children, className = '' }: { children: ReactNode; className?: string }) => {
  return <div className={twMerge('flex flex-row', className)}>{children}</div>
}

export default Group
