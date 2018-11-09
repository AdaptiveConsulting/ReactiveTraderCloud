import * as React from 'react'
import { PlatformAdapter } from './adapters'

export const { Provider: PlatformProvider, Consumer: PlatformConsumer } = React.createContext<PlatformAdapter>(null)
