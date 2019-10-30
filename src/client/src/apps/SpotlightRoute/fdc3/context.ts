import React, { useContext } from 'react'
import { SpotlightFdc3 } from './fdc3'

const Fdc3Context = React.createContext<SpotlightFdc3>(null)
export const { Provider: Fdc3Provider } = Fdc3Context

export function useFdc3() {
  return useContext(Fdc3Context)
}
