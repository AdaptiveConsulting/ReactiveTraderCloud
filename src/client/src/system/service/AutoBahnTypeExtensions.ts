import { Connection, Session } from 'autobahn'

interface TransportDefinition {
  info: {
    url: string
    protocols?: string[]
    type: string
  }
}

declare module 'autobahn' {
  interface Connection {
    transport: TransportDefinition
    session: Session
  }
}
