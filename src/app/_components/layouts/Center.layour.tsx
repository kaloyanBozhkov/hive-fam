import type { ReactNode } from 'react'

import { twMerge } from 'tailwind-merge'

import Stack from './Stack.layout'

const Center = ({ children, className = '' }: { children: ReactNode; className?: string }) => {
  return <Stack className={twMerge('items-center justify-center', className)}>{children}</Stack>
}

export default Center
