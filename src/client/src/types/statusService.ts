import { Observable } from 'rxjs'
import { ServiceStatus } from '.'

export interface StatusService {
  serviceStatusStream: Observable<ServiceStatus>
}
