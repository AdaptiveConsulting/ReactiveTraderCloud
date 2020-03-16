import { WsConnection, ServiceStub } from 'rt-system'

export function createServiceStub(broker: WsConnection) {
  return new ServiceStub('Spotlight', broker)
}
