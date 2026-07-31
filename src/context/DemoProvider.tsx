import { useMemo, useState, type ReactNode } from 'react'
import { DemoContext } from './demo-context'
import { buildInitialDemoState } from './demo-seed'

export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(buildInitialDemoState)
  const usingDemo =
    !import.meta.env.VITE_FIREBASE_API_KEY ||
    import.meta.env.VITE_FIREBASE_API_KEY === '' ||
    import.meta.env.VITE_USE_DEMO === 'true'

  const value = useMemo(
    () => ({ state, setState, usingDemo }),
    [state, usingDemo],
  )

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>
}
