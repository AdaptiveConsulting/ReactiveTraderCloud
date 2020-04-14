import { WsConnection, ServiceClient } from 'rt-system'

export function createServiceStub(broker: WsConnection) {
  return new ServiceClient('Spotlight', broker)
}
