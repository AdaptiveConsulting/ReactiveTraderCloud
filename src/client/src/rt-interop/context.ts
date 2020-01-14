import React, { useContext } from 'react'
import { InteropProvider } from './types'

const IntentsContext = React.createContext<InteropProvider | null>(null)

export const { Provider } = IntentsContext

export function useInterop() {
  return useContext(IntentsContext)
}
