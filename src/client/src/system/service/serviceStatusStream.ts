import { throwError as observableThrowError } from 'rxjs'
import {
  distinctUntilChanged,
  filter,
  groupBy,
  map,
  merge,
  mergeAll,
  mergeMapTo,
  take
} from 'rxjs/operators'
import { ServiceInstanceStatus } from '../../types/'
import { RawServiceStatus } from '../../types/serviceInstanceStatus'
import { Connection } from './connection'
import { ConnectionClosedEvent, ConnectionEventType } from './ConnectionFactory'
import { debounceWithSelector } from './debounceOnMissedHeartbeat'

export function serviceInstanceDictionaryStream$(
  connection$: Connection,
  heartBeatTimeout: number
) {
  const errorOnDisconnect$ = connection$.connectionStream.pipe(
    filter(
      (connection): connection is ConnectionClosedEvent =>
        connection.type === ConnectionEventType.DISCONNECTED
    ),
    take(1),
    mergeMapTo(observableThrowError('Underlying connection disconnected'))
  )

  return connection$.subscribeToTopic<RawServiceStatus>('status').pipe(
    map(convertServiceMesage),
    merge<ServiceInstanceStatus>(errorOnDisconnect$),
    // If the underlying connection goes down we error the stream.
    // Do this before the grouping so all grouped streams error.
    groupBy(serviceStatus => serviceStatus.serviceId),
    map(service$ =>
      service$.pipe(
        debounceWithSelector<ServiceInstanceStatus>(
          heartBeatTimeout,
          lastValue =>
            createServiceInstanceForDisconnected(
              lastValue.serviceType,
              lastValue.serviceId
            )
        ),
        distinctUntilChanged<ServiceInstanceStatus>(
          (status, statusNew) =>
            status.isConnected === statusNew.isConnected &&
            status.serviceLoad === statusNew.serviceLoad
        )
      )
    ),
    mergeAll()
  )
}

function convertServiceMesage(
  serviceStatus: RawServiceStatus
): ServiceInstanceStatus {
  return {
    serviceType: serviceStatus.Type,
    serviceId: serviceStatus.Instance,
    timestamp: serviceStatus.TimeStamp,
    serviceLoad: serviceStatus.Load,
    isConnected: true
  }
}

function createServiceInstanceForDisconnected(
  serviceType: string,
  serviceId: string
): ServiceInstanceStatus {
  return {
    serviceType,
    serviceId,
    timestamp: NaN,
    serviceLoad: NaN,
    isConnected: false
  }
}
