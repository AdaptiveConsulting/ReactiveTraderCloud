import { AutobahnConnection, ServiceStub } from 'rt-system'

export function createServiceStub(autobahn: AutobahnConnection) {
  return new ServiceStub('Spotlight', autobahn)
}
