import * as React from 'react'
import { PlatformAdapter } from './'
import { useContext } from 'react'

const PlatformContext = React.createContext<PlatformAdapter>(null)
export const { Provider: PlatformProvider } = PlatformContext

export function usePlatform() {
  return useContext(PlatformContext)
}
