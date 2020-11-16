import React from 'react'
import { useContext } from 'react'
import NoopPlatformAdapter from './noopAdapter'
import { Platform } from './platform'

const PlatformContext = React.createContext<Platform>(new NoopPlatformAdapter())

export const { Provider: PlatformProvider } = PlatformContext

export function usePlatform() {
  return useContext(PlatformContext)
}
