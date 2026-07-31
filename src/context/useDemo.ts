import { useContext } from 'react'
import { DemoContext } from './demo-context'

export function useDemo() {
  const ctx = useContext(DemoContext)
  if (!ctx) throw new Error('useDemo must be used within DemoProvider')
  return ctx
}
