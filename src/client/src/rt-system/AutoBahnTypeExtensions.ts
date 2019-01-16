import { ConnectionType } from './connectionType'

interface TransportDefinition {
  info: {
    url: string
    protocols?: string[]
    type: ConnectionType
  }
}

declare module 'autobahn' {
  interface Connection {
    transport: TransportDefinition
  }
}
