import React from 'react'

export interface EnvironmentValue<Provider extends Window = Window> {
  provider: Provider
  openfin?: Provider | null
  [key: string]: Provider | null
}

export interface Window {
  type: string | 'desktop' | 'browser'
  platform: string | 'openfin' | 'browser'
  maximize: () => void
  minimize: () => void
  close: () => void
  open: (url: string) => void
  [key: string]: any
}

export function createEnvironment<Provider extends Window>(provider: any): EnvironmentValue<Provider> {
  return {
    provider,
    get [provider.platform]() {
      return provider && provider.isPresent ? provider : null
    },
  }
}

export const Environment = React.createContext<EnvironmentValue<Window>>(
  createEnvironment<Window>({
    type: 'browser',
    platform: 'browser',
    maximize: () => {},
    minimize: () => {},
    close: () => {},
    open: () => {},
  }),
)

export default Environment
