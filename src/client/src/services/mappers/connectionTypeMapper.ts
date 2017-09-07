import { ConnectionType } from '../../types'

export default class ConnectionTypeMapper {
  lookup: Object

  constructor() {
    this.lookup = {
      websocket: ConnectionType.WebSocket,
      longpoll: ConnectionType.LongPolling,
    }
  }

  map(type: string) {
    return this.lookup[type]
  }
}
