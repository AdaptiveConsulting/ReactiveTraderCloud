import { ConnectionType } from '../model/index'

export default class ConnectionTypeMapper {
  _lookup: Object

  constructor() {
    this._lookup = {
      websocket: ConnectionType.WebSocket,
      longpoll: ConnectionType.LongPolling,
    }
  }

  map(type: string) {
    return this._lookup[type]
  }
}
