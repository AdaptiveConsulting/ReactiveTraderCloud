import {
  WsConnection,
  RawServiceStatus,
  ServiceCollectionMap,
  serviceStatusStream$,
  ServiceStub,
  ServiceClient,
} from 'rt-system'
import { multicast, refCount } from 'rxjs/operators'
import { ReplaySubject } from 'rxjs'

const HEARTBEAT_TIMEOUT = 3000

export function createServiceStub(broker: WsConnection) {
  const serviceStub = new ServiceStub('Spotlight', broker)

  const statusUpdates$ = serviceStub.subscribeToTopic<RawServiceStatus>('status')
  const serviceStatus$ = serviceStatusStream$(statusUpdates$, HEARTBEAT_TIMEOUT).pipe(
    multicast(() => {
      return new ReplaySubject<ServiceCollectionMap>(1)
    }),
    refCount(),
  )

  return new ServiceClient(serviceStub, serviceStatus$)
}
