import { Observable } from 'rxjs'
import {
  groupBy,
  map,
  mergeAll,
  publishReplay,
  refCount,
  scan
} from 'rxjs/operators'
import { Connection } from '../system/service/connection'
import { ServiceInstanceStatus } from '../types'

interface ServiceConnectionInfo {
  [key: string]: {
    serviceType: string
    connectedInstanceCount: number
    isConnected: boolean
  }
}

export default class CompositeStatusService {
  private readonly serviceStatusStream$: Observable<ServiceConnectionInfo>
  constructor(
    private readonly connection: Connection,
    private readonly serviceInstanceDictionaryStream: Observable<
      ServiceInstanceStatus
    >
  ) {
    this.serviceStatusStream$ = serviceInstanceDictionaryStream.pipe(
      groupBy(serviceStatus => serviceStatus.serviceType),
      map(status =>
        status.pipe(
          scan<
            ServiceInstanceStatus,
            [string, Map<string, ServiceInstanceStatus>]
          >(
            (statusLookup, serviceStatus) => {
              const [key, lookup] = statusLookup
              lookup.set(serviceStatus.serviceId, serviceStatus)
              return [key, lookup]
            },
            [status.key, new Map()]
          )
        )
      ),
      mergeAll(),
      scan<[string, Map<string, ServiceInstanceStatus>], ServiceConnectionInfo>(
        (acc, next) => {
          const [key, lookup] = next
          const vals = Array.from(lookup.values())
          const isConnected = vals.some(x => x.isConnected)
          const connectedInstanceCount = vals.length
          return {
            ...acc,
            [key]: {
              serviceType: key,
              connectedInstanceCount,
              isConnected
            }
          }
        },
        {}
      ),
      publishReplay(1),
      refCount()
    )
  }

  get connectionStatusStream() {
    return this.connection.connectionStatusStream
  }

  get isConnected() {
    return this.connection.connected
  }

  get connectionUrl() {
    return this.connection.url
  }

  get connectionType() {
    return this.connection.type
  }

  get serviceStatusStream() {
    return this.serviceStatusStream$
  }
}
