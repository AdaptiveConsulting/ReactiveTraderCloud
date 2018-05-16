import { ConnectionType } from '../../system'

const lookup = {
  websocket: ConnectionType.WebSocket,
  longpoll: ConnectionType.LongPolling
}

export function connectionTypeMapper(type: keyof typeof lookup) {
  return lookup[type]
}
