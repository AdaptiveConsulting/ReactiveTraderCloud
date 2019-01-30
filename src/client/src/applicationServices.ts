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
} from 'rt-system'
import { User } from 'rt-types'
import { ConnectableObservable } from 'rxjs'
import { publishReplay, retryWhen } from 'rxjs/operators'
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
  const connection$ = publishReplay(1)(
    createConnection$(autobahn).pipe(retryWhen(retryWithBackOff())),
  ) as ConnectableObservable<ConnectionEvent>

  const serviceStub = new ServiceStub(user.code, connection$)

  const serviceStatus$ = publishReplay(1)(
    serviceStatusStream$(serviceStub, HEARTBEAT_TIMEOUT),
  ) as ConnectableObservable<ServiceCollectionMap>

  const loadBalancedServiceStub = new ServiceClient(serviceStub, serviceStatus$)

  const referenceDataService = new ReferenceDataService(loadBalancedServiceStub)

  connection$.connect()
  serviceStatus$.connect()

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
