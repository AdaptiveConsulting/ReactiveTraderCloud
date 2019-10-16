import {
  AutobahnConnection,
  ConnectionEvent,
  createConnection$,
  RawServiceStatus,
  retryWithBackOff, ServiceCollectionMap,
  serviceStatusStream$,
  ServiceStub, ServiceStubWithLoadBalancer
} from '../../rt-system'
import { multicast, refCount, retryWhen } from 'rxjs/operators'
import { ReplaySubject } from 'rxjs'

const HEARTBEAT_TIMEOUT = 3000;

export function createServiceStub(autobahn: AutobahnConnection) {
  const connection$ = createConnection$(autobahn).pipe(
    retryWhen(retryWithBackOff()),
    multicast(() => {
      return new ReplaySubject<ConnectionEvent>(1)
    }),
    refCount(),
  )

  const serviceStub = new ServiceStub('Spotlight', connection$)

  const statusUpdates$ = serviceStub.subscribeToTopic<RawServiceStatus>('status')
  const serviceStatus$ = serviceStatusStream$(statusUpdates$, HEARTBEAT_TIMEOUT).pipe(
    multicast(() => {
      return new ReplaySubject<ServiceCollectionMap>(1)
    }),
    refCount(),
  )

  return new ServiceStubWithLoadBalancer(serviceStub, serviceStatus$)
}
