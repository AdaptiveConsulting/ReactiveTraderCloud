import * as React from 'react'
import { PlatformAdapter } from './'
import { useContext } from 'react'
import platform from './platform'
import { getPlatform } from 'rt-util'

const PlatformContext = React.createContext<PlatformAdapter>(getPlatform(platform))
export const { Provider: PlatformProvider } = PlatformContext

export function usePlatform() {
  return useContext(PlatformContext)
}
