import { PlatformAdapter } from 'rt-components'
import {
  AutobahnConnection,
  ConnectionEvent,
  createConnection$,
  ServiceClient,
  ServiceCollectionMap,
  serviceStatusStream$,
  ServiceStub,
} from 'rt-system'
import { User } from 'rt-types'
import { ReplaySubject } from 'rxjs'
import { multicast, refCount } from 'rxjs/operators'
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
    multicast(() => {
      return new ReplaySubject<ConnectionEvent>(1)
    }),
    refCount(),
  )

  const serviceStub = new ServiceStub(user.code, connection$)

  const serviceStatus$ = serviceStatusStream$(serviceStub, HEARTBEAT_TIMEOUT).pipe(
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
