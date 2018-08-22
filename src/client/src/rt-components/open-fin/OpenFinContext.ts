import React from 'react'

export interface OpenFinContextValue {
  maximize: () => void
  minimize: () => void
  close: () => void
}

export const OpenFinContext: React.Context<OpenFinContextValue | null> = React.createContext(null)

export const { Provider, Consumer } = OpenFinContext

export default OpenFinContext
