import { Observable } from 'rxjs'
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

export function serviceStatusStream$(statusUpdate$: Observable<RawServiceStatus>, heartBeatTimeout: number) {
  return statusUpdate$.pipe(
    map(convertFromRawMessage),
    groupBy(serviceInstanceStatus => serviceInstanceStatus.serviceType),
    //we have a list of observables that are grouped by their serviceInstanceStatus.serviceType
    mergeMap(serviceInstanceStatus =>
      serviceInstanceStatus.pipe(
        addHeartBeatToServiceInstanceStatus(heartBeatTimeout),
        scan<ServiceInstanceStatus, ServiceInstanceCollection>(
          (serviceInstanceCollection, next) => serviceInstanceCollection.update(next),
          new ServiceInstanceCollection(serviceInstanceStatus.key),
        ),
      ),
    ),
    //we have a collection of serviceInstanceStatus observables
    scan<ServiceInstanceCollection, ServiceCollectionMap>((serviceCollectionMap, serviceInstanceCollection) => {
      return serviceCollectionMap.add(serviceInstanceCollection.serviceType, serviceInstanceCollection)
    }, new ServiceCollectionMap()),
    //We have a collection of ServiceInstanceCollection, a map {service instance stuff}?
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
