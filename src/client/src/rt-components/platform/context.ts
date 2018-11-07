import * as React from 'react'
import { API } from './api'

export const { Provider: PlatformProvider, Consumer: PlatformConsumer } = React.createContext<API>(null)
