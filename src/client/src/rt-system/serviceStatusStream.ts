import { Observable, GroupedObservable } from 'rxjs'
import { distinctUntilChanged, groupBy, map, mergeMap, scan } from 'rxjs/operators'
import { debounceWithSelector } from './debounceOnMissedHeartbeat'
import { ServiceCollectionMap, ServiceInstanceCollection } from './ServiceInstanceCollection'
import { RawServiceStatus, ServiceInstanceStatus } from './serviceInstanceStatus'

function addHeartBeatToServiceInstanceStatus(
  heartBeatTimeout: number,
): (source: Observable<ServiceInstanceStatus>) => Observable<ServiceInstanceStatus> {
  return source =>
    source.pipe(
      groupBy(serviceStatus => serviceStatus.serviceId),
      mergeMap(service$ =>
        service$.pipe(
          debounceWithSelector<ServiceInstanceStatus>(heartBeatTimeout, lastValue =>
            createServiceInstanceForDisconnected(lastValue.serviceType, lastValue.serviceId),
          ),
          distinctUntilChanged<ServiceInstanceStatus>(
            (status, statusNew) =>
              status.isConnected === statusNew.isConnected && status.serviceLoad === statusNew.serviceLoad,
          ),
        ),
      ),
    )
}

export function mapToServiceInstanceCollection$(
  source$: Observable<GroupedObservable<string, ServiceInstanceStatus>>,
  heartBeatTimeout: number,
): Observable<ServiceInstanceCollection> {
  return source$.pipe(
    mergeMap(serviceInstanceStatus =>
      serviceInstanceStatus.pipe(
        addHeartBeatToServiceInstanceStatus(heartBeatTimeout),
        scan<ServiceInstanceStatus, ServiceInstanceCollection>(
          (serviceInstanceCollection, next) => serviceInstanceCollection.update(next),
          new ServiceInstanceCollection(serviceInstanceStatus.key),
        ),
      ),
    ),
  )
}
export function mapToServiceCollectionMap$(source$: Observable<ServiceInstanceCollection>) {
  return source$.pipe(
    scan<ServiceInstanceCollection, ServiceCollectionMap>((serviceCollectionMap, serviceInstanceCollection) => {
      return serviceCollectionMap.add(serviceInstanceCollection.serviceType, serviceInstanceCollection)
    }, new ServiceCollectionMap()),
  )
}

export function serviceStatusStream$(statusUpdate$: Observable<RawServiceStatus>, heartBeatTimeout: number) {
  return statusUpdate$.pipe(
    map(convertFromRawMessage),
    groupBy(serviceInstanceStatus => serviceInstanceStatus.serviceType),
    mergeMap(serviceInstanceStatus =>
      serviceInstanceStatus.pipe(
        addHeartBeatToServiceInstanceStatus(heartBeatTimeout),
        scan<ServiceInstanceStatus, ServiceInstanceCollection>(
          (serviceInstanceCollection, next) => serviceInstanceCollection.update(next),
          new ServiceInstanceCollection(serviceInstanceStatus.key),
        ),
      ),
    ),
    scan<ServiceInstanceCollection, ServiceCollectionMap>((serviceCollectionMap, serviceInstanceCollection) => {
      return serviceCollectionMap.add(serviceInstanceCollection.serviceType, serviceInstanceCollection)
    }, new ServiceCollectionMap()),
  )
}

function convertFromRawMessage(serviceStatus: RawServiceStatus): ServiceInstanceStatus {
  return {
    serviceType: serviceStatus.Type,
    serviceId: serviceStatus.Instance,
    timestamp: serviceStatus.TimeStamp,
    serviceLoad: serviceStatus.Load,
    isConnected: true,
  }
}

function createServiceInstanceForDisconnected(serviceType: string, serviceId: string): ServiceInstanceStatus {
  return {
    serviceType,
    serviceId,
    timestamp: NaN,
    serviceLoad: NaN,
    isConnected: false,
  }
}
