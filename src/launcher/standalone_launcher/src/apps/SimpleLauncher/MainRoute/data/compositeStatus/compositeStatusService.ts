import { ServiceCollectionMap, ServiceConnectionInfo } from 'rt-system'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

export default class CompositeStatusService {
  private readonly serviceStatusStream$: Observable<ServiceConnectionInfo>

  constructor(serviceInstanceDictionaryStream: Observable<ServiceCollectionMap>) {
    this.serviceStatusStream$ = serviceInstanceDictionaryStream.pipe(
      map(serviceCollectionMap => serviceCollectionMap.getStatusOfServices())
    )
  }

  get serviceStatusStream() {
    return this.serviceStatusStream$
  }
}
