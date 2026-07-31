import { createContext } from 'react'
import type { DemoContextValue } from './demo-types'

export const DemoContext = createContext<DemoContextValue | null>(null)
