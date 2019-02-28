import { PlatformAdapter } from 'rt-components'
import {
  AutobahnConnection,
  createConnection$,
  ServiceClient,
  serviceStatusStream$,
  ServiceStub,
  ConnectionEvent,
  ServiceCollectionMap,
  retryWithBackOff,
  RawServiceStatus,
} from 'rt-system'
import { User } from 'rt-types'
import { ReplaySubject } from 'rxjs'
import { retryWhen, multicast, refCount } from 'rxjs/operators'
import { OpenFinLimitChecker } from './shell/openFin'
import { ReferenceDataService } from './shell/referenceData'
const HEARTBEAT_TIMEOUT = 3000

export interface ApplicationProps {
  autobahn: AutobahnConnection
  platform: PlatformAdapter
  limitChecker: OpenFinLimitChecker
  user: User
}

export function createApplicationServices({ autobahn, limitChecker, user, platform }: ApplicationProps) {
  const connection$ = createConnection$(autobahn).pipe(
    retryWhen(retryWithBackOff()),
    multicast(() => {
      return new ReplaySubject<ConnectionEvent>(1)
    }),
    refCount(),
  )

  const serviceStub = new ServiceStub(user.code, connection$)
  serviceStub.requestResponse('getPriceHistory', 'EURUSD').subscribe(
    (x)=>{
      debugger
    },()=>{
      debugger
    }
  )
  const statusUpdates$ = serviceStub.subscribeToTopic<RawServiceStatus>('status')
  const serviceStatus$ = serviceStatusStream$(statusUpdates$, HEARTBEAT_TIMEOUT).pipe(
    multicast(() => {
      return new ReplaySubject<ServiceCollectionMap>(1)
    }),
    refCount(),
  )

  const loadBalancedServiceStub = new ServiceClient(serviceStub, serviceStatus$)

  const referenceDataService = new ReferenceDataService(loadBalancedServiceStub)

  return {
    referenceDataService,
    platform,
    limitChecker,
    loadBalancedServiceStub,
    serviceStatus$,
    connection$,
  }
}

export type ApplicationDependencies = ReturnType<typeof createApplicationServices>
