import {
  AutobahnConnection,
  ConnectionEvent,
  createConnection$,
  RawServiceStatus,
  retryWithBackOff,
  ServiceCollectionMap,
  serviceStatusStream$,
  ServiceStub,
  ServiceStubWithLoadBalancer
} from 'rt-system'
import { multicast, refCount, retryWhen } from 'rxjs/operators'
import { ReplaySubject } from 'rxjs'
import { useEffect, useState } from 'react'

const HEARTBEAT_TIMEOUT = 3000;

export function useServiceStub(autobahn: AutobahnConnection) {
  const [serviceStub, setServiceStub] = useState(null)

  useEffect(() => {
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

    const loadBalancedServiceStub = new ServiceStubWithLoadBalancer(serviceStub, serviceStatus$)

    setServiceStub(loadBalancedServiceStub);
  }, [autobahn])


  return {
    serviceStub
  };
}
