import { applicationConnected, applicationDisconnected } from 'rt-actions'
import { map, switchMapTo, takeUntil } from 'rxjs/operators'
import { ApplicationEpic } from 'StoreTypes'
import { CompositeStatusServiceActions } from '../actions'
import { compositeStatusService } from 'apps/MainRoute/store/singleServices'

const { createCompositeStatusServiceAction } = CompositeStatusServiceActions
type CreateStatusServiceAction = ReturnType<typeof createCompositeStatusServiceAction>

export const compositeStatusServiceEpic: ApplicationEpic = (action$, state$) => {
  return action$.pipe(
    applicationConnected,
    switchMapTo<CreateStatusServiceAction>(
      compositeStatusService.serviceStatusStream.pipe(
        map(createCompositeStatusServiceAction),
        takeUntil(action$.pipe(applicationDisconnected))
      )
    )
  )
}
