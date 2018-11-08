import * as React from 'react'
import { PlatformAdapter } from './platformAdapter'

export const { Provider: PlatformProvider, Consumer: PlatformConsumer } = React.createContext<PlatformAdapter>(null)
