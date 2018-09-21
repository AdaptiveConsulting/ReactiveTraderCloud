import React from 'react'

export interface EnvironmentValue<Provider extends WindowProvider = WindowProvider> {
  provider: Provider
  openfin?: Provider | null
  [key: string]: Provider | null
}

export interface WindowProvider {
  type: string | 'desktop' | 'browser'
  platform: string | 'openfin' | 'browser'
  maximize: () => void
  minimize: () => void
  close: () => void
  open: (url: string) => void
  [key: string]: any
}

export function createEnvironment<Provider extends WindowProvider>(provider: any): EnvironmentValue<Provider> {
  return {
    provider,
    get [provider.platform]() {
      return provider && provider.isPresent ? provider : null
    },
  }
}

export const Environment = React.createContext<EnvironmentValue<WindowProvider>>(
  createEnvironment<WindowProvider>({
    type: 'browser',
    platform: 'browser',
    maximize: () => {},
    minimize: () => {},
    close: () => {},
    open: () => {},
  }),
)

export default Environment
