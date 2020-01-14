import React, { useContext } from 'react'
import { IntentsProvider } from './types'
import { NoopProvider } from './noop'

const IntentsContext = React.createContext<IntentsProvider>(new NoopProvider())

export const { Provider } = IntentsContext

export function useIntents() {
  return useContext(IntentsContext)
}
