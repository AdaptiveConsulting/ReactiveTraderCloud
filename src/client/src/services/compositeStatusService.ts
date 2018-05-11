import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { Connection } from '../system/service/connection'
import {
  ServiceCollectionMap,
  ServiceConnectionInfo
} from '../system/service/ServiceInstanceCollection'

export default class CompositeStatusService {
  private readonly serviceStatusStream$: Observable<ServiceConnectionInfo>
  constructor(
    private readonly connection: Connection,
    serviceInstanceDictionaryStream: Observable<ServiceCollectionMap>
  ) {
    this.serviceStatusStream$ = serviceInstanceDictionaryStream.pipe(
      map(serviceCollectionMap => serviceCollectionMap.getStatusOfServices())
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
