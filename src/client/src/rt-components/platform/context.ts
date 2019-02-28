import * as React from 'react'
import { PlatformAdapter } from './adapters'
import { useContext } from 'react'
import { platform } from './index'

export const PlatformContext = React.createContext<PlatformAdapter>(platform)
export const { Provider: PlatformProvider, Consumer: PlatformConsumer } = PlatformContext

export function usePlatform() {
  return useContext(PlatformContext)
}
