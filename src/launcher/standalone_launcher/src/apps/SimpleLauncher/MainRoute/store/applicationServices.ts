import {
  WsConnection,
  connectionStream$,
  serviceStatusStream$,
  ConnectionInfo,
  ServiceCollectionMap,
  retryWithBackOff,
  RawServiceStatus,
  ServiceClient
} from 'rt-system'
import { User } from 'rt-types'
import { ReplaySubject } from 'rxjs'
import { retryWhen, multicast, refCount } from 'rxjs/operators'
import { referenceDataService } from '../data/referenceData'
import { LimitChecker, ExcelApp, Platform } from 'rt-platforms'
const HEARTBEAT_TIMEOUT = 3000

export interface ApplicationProps {
  broker: WsConnection
  platform: Platform
  limitChecker: LimitChecker
  excelApp: ExcelApp
  user: User
}

export function createApplicationServices({
  broker,
  limitChecker,
  excelApp,
  user,
  platform
}: ApplicationProps) {
  const connection$ = connectionStream$(broker).pipe(
    retryWhen(retryWithBackOff()),
    multicast(() => {
      return new ReplaySubject<ConnectionInfo>(1)
    }),
    refCount()
  )

  const serviceClient = new ServiceClient(user.code, broker)

  const statusUpdates$ = serviceClient.subscribeToTopic<RawServiceStatus>('status')
  const serviceStatus$ = serviceStatusStream$(statusUpdates$, HEARTBEAT_TIMEOUT).pipe(
    multicast(() => {
      return new ReplaySubject<ServiceCollectionMap>(1)
    }),
    refCount()
  )

  const referenceDataService$ = referenceDataService(serviceClient)

  return {
    referenceDataService$,
    platform,
    limitChecker,
    excelApp,
    serviceClient,
    serviceStatus$,
    connection$
  }
}

export type ApplicationDependencies = ReturnType<typeof createApplicationServices>
