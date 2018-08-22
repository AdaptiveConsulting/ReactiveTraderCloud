import React from 'react'

export interface EnvironmentValue {
  isDesktop: Boolean
  openfin?: Window
}

export interface Window {
  maximize: () => void
  minimize: () => void
  close: () => void
  open: (url: string) => void
}

export const Environment = React.createContext<EnvironmentValue>({
  isDesktop: false
})

export default Environment
