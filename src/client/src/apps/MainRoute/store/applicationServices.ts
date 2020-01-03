import {
  AutobahnConnection,
  createConnection$,
  ServiceStubWithLoadBalancer,
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
import { referenceDataService } from '../data/referenceData'
import { LimitChecker, ExcelApp, Platform } from 'rt-platforms'
const HEARTBEAT_TIMEOUT = 3000

export interface ApplicationProps {
  autobahn: AutobahnConnection
  platform: Platform
  limitChecker: LimitChecker
  excelApp: ExcelApp
  user: User
}

export function createApplicationServices({
  autobahn,
  limitChecker,
  excelApp,
  user,
  platform,
}: ApplicationProps) {
  const connection$ = createConnection$(autobahn).pipe(
    retryWhen(retryWithBackOff()),
    multicast(() => {
      return new ReplaySubject<ConnectionEvent>(1)
    }),
    refCount(),
  )

  const serviceStub = new ServiceStub(user.code, autobahn)

  const statusUpdates$ = serviceStub.subscribeToTopic<RawServiceStatus>('status')
  const serviceStatus$ = serviceStatusStream$(statusUpdates$, HEARTBEAT_TIMEOUT).pipe(
    multicast(() => {
      return new ReplaySubject<ServiceCollectionMap>(1)
    }),
    refCount(),
  )

  const loadBalancedServiceStub = new ServiceStubWithLoadBalancer(serviceStub)

  const referenceDataService$ = referenceDataService(loadBalancedServiceStub)

  return {
    referenceDataService$,
    platform,
    limitChecker,
    excelApp,
    loadBalancedServiceStub,
    serviceStatus$,
    connection$,
  }
}

export type ApplicationDependencies = ReturnType<typeof createApplicationServices>
