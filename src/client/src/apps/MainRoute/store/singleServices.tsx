import {
  WsConnection,
  connectionStream$,
  serviceStatusStream$,
  ConnectionInfo,
  ServiceCollectionMap,
  retryWithBackOff,
  RawServiceStatus,
  ServiceClient,
} from 'rt-system'
import FakeUserRepository from '../fakeUserRepository'

import { ReplaySubject } from 'rxjs'
import { retryWhen, multicast, refCount } from 'rxjs/operators'
import { referenceDataService } from '../data/referenceData'
import { getPlatformAsync, createExcelApp, Platform } from 'rt-platforms'
import CompositeStatusService from '../data/compositeStatus/compositeStatusService'
const HEARTBEAT_TIMEOUT = 3000

export const broker = new WsConnection(
  process.env.REACT_APP_BROKER_HOST || location.hostname,
  +(process.env.REACT_APP_BROKER_PORT || location.port)
)

export const connection$ = connectionStream$(broker).pipe(
  retryWhen(retryWithBackOff()),
  multicast(() => {
    return new ReplaySubject<ConnectionInfo>(1)
  }),
  refCount()
)
export const selectedUser = FakeUserRepository.currentUser

export const serviceClient = new ServiceClient(selectedUser.code, broker)

export const statusUpdates$ = serviceClient.subscribeToTopic<RawServiceStatus>('status')
export const serviceStatus$ = serviceStatusStream$(statusUpdates$, HEARTBEAT_TIMEOUT).pipe(
  multicast(() => {
    return new ReplaySubject<ServiceCollectionMap>(1)
  }),
  refCount()
)
export const referenceDataService$ = referenceDataService(serviceClient)

export const runningPlatform = getPlatformAsync() as Promise<Platform>

export const excelApp = getPlatformAsync().then(runningPlatform =>
  createExcelApp(runningPlatform.name)
)

export const compositeStatusService = new CompositeStatusService(serviceStatus$)
