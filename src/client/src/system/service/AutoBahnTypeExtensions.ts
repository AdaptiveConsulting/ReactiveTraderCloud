import { Connection, Session } from 'autobahn'
import { ConnectionType } from '../../types/connectionType'

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
    session: Session
  }
}
