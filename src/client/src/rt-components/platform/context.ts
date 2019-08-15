import * as React from 'react'
import { PlatformAdapter } from './adapters'
import { useContext } from 'react'
import platform from './platform'

const PlatformContext = React.createContext<PlatformAdapter>(platform)
export const { Provider: PlatformProvider } = PlatformContext

export function usePlatform() {
  return useContext(PlatformContext)
}
