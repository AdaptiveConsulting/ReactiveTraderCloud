import { compositeStatusService } from 'apps/MainRoute/store/singleServices'
import { map } from 'rxjs/operators'
export const allServiceStatus$ = compositeStatusService.serviceStatusStream.pipe(
  map(status => Object.values(status))
)
