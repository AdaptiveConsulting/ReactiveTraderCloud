import { applicationConnected, applicationDisconnected } from 'rt-actions'
import { map, switchMapTo, takeUntil } from 'rxjs/operators'
import { ApplicationEpic } from 'StoreTypes'
import { CompositeStatusServiceActions } from '../actions'
import CompositeStatusService from '../compositeStatusService'

const { createCompositeStatusServiceAction } = CompositeStatusServiceActions
type CreateStatusServiceAction = ReturnType<typeof createCompositeStatusServiceAction>

export const compositeStatusServiceEpic: ApplicationEpic = (
  action$,
  state$,
  { serviceStatus$ }
) => {
  const compositeStatusService = new CompositeStatusService(serviceStatus$)

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
