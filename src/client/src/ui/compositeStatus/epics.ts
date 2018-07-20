import { map, switchMapTo, takeUntil } from 'rxjs/operators'
import { ApplicationEpic } from '../../ApplicationEpic'
import { applicationConnected, applicationDisconnected } from '../../operations/connectionStatus'
import { CompositeStatusServiceActions } from './actions'

const { createCompositeStatusServiceAction } = CompositeStatusServiceActions
type CreateStatusServiceAction = ReturnType<typeof createCompositeStatusServiceAction>

export const compositeStatusServiceEpic: ApplicationEpic = (action$, state$, { compositeStatusService }) =>
  action$.pipe(
    applicationConnected,
    switchMapTo<CreateStatusServiceAction>(
      compositeStatusService.serviceStatusStream.pipe(
        map(createCompositeStatusServiceAction),
        takeUntil(action$.pipe(applicationDisconnected))
      )
    )
  )
