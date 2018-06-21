import { map, switchMapTo, takeUntil } from 'rxjs/operators'
import { ApplicationEpic } from '../../ApplicationEpic'
import { ConnectionActions } from './actions'
import { applicationConnected, applicationDisconnected } from './operators'

const { createConnectionStatusUpdateAction } = ConnectionActions
type CreateConnectionAction = ReturnType<typeof createConnectionStatusUpdateAction>

export const connectionStatusEpic: ApplicationEpic = (action$, state$, { connectionStatusService }) =>
  action$.pipe(
    applicationConnected,
    switchMapTo<CreateConnectionAction>(
      connectionStatusService.connectionStatus$.pipe(
        map(createConnectionStatusUpdateAction),
        takeUntil(action$.pipe(applicationDisconnected))
      )
    )
  )
