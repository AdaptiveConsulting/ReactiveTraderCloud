import { Observable } from 'rxjs'
import {
  distinctUntilChanged,
  groupBy,
  map,
  mergeMap,
  scan
} from 'rxjs/operators'
import { ServiceInstanceStatus } from '../../types/'
import { RawServiceStatus } from '../../types/serviceInstanceStatus'
import { Connection } from './connection'
import { debounceWithSelector } from './debounceOnMissedHeartbeat'
import {
  ServiceCollectionMap,
  ServiceInstanceCollection
} from './ServiceInstanceCollection'

export function addHeartBeatToServiceInstanceStatus(
  heartBeatTimeout: number
): (
  source: Observable<ServiceInstanceStatus>
) => Observable<ServiceInstanceStatus> {
  return source =>
    source.pipe(
      groupBy(serviceStatus => serviceStatus.serviceId),
      mergeMap(service$ =>
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
      )
    )
}

export function serviceInstanceDictionaryStream$(
  connection$: Connection,
  heartBeatTimeout: number
) {
  return connection$.subscribeToTopic<RawServiceStatus>('status').pipe(
    map(convertFromRawMessage),
    groupBy(serviceInstanceStatus => serviceInstanceStatus.serviceType),
    mergeMap(serviceInstanceStatus =>
      serviceInstanceStatus.pipe(
        addHeartBeatToServiceInstanceStatus(heartBeatTimeout),
        scan<ServiceInstanceStatus, ServiceInstanceCollection>(
          (serviceInstanceCollection, next) =>
            serviceInstanceCollection.update(next),
          new ServiceInstanceCollection(serviceInstanceStatus.key)
        )
      )
    ),
    scan<ServiceInstanceCollection, ServiceCollectionMap>(
      (serviceCollectionMap, serviceInstanceCollection) => {
        return serviceCollectionMap.add(
          serviceInstanceCollection.serviceType,
          serviceInstanceCollection
        )
      },
      new ServiceCollectionMap()
    )
  )
}

function convertFromRawMessage(
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
