import { Connection, Session } from 'autobahn'

interface TransportDefinition {
  info: {
    url: string
    protocols?: string[]
    type: 'websocket' | 'longpoll'
  }
}

declare module 'autobahn' {
  interface Connection {
    transport: TransportDefinition
    session: Session
  }
}
