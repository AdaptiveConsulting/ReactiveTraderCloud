import {
  AutobahnConnection,
  ServiceStub, ServiceStubWithLoadBalancer
} from 'rt-system'

export function createServiceStub(autobahn: AutobahnConnection) {
/*  
  const connection$ = createConnection$(autobahn).pipe(
    retryWhen(retryWithBackOff()),
    shareReplay(1)
  )
*/
  const serviceStub = new ServiceStub('Spotlight', autobahn)

  return new ServiceStubWithLoadBalancer(serviceStub)
}
