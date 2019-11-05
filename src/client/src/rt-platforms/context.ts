import * as React from 'react'
import { useContext } from 'react'
import { PlatformAdapter } from './'
import NoopPlatformAdapter from './noopAdapter'

const PlatformContext = React.createContext<PlatformAdapter>(new NoopPlatformAdapter())

export const { Provider: PlatformProvider } = PlatformContext

export function usePlatform() {
  return useContext(PlatformContext)
}
