import { ConnectionActions } from 'rt-actions'
import { map, switchMapTo, takeUntil } from 'rxjs/operators'
import { ApplicationEpic } from '../../../ApplicationEpic'
import { ConnectionStatusService } from '../connectionStatusService'
import { applicationConnected, applicationDisconnected } from '../operators'

const { createConnectionStatusUpdateAction } = ConnectionActions
type CreateConnectionAction = ReturnType<typeof createConnectionStatusUpdateAction>

export const connectionStatusEpic: ApplicationEpic = (action$, state$, { connection$ }) => {
  const connectionStatusService = new ConnectionStatusService(connection$)

  return action$.pipe(
    applicationConnected,
    switchMapTo<CreateConnectionAction>(
      connectionStatusService.connectionStatus$.pipe(
        map(createConnectionStatusUpdateAction),
        takeUntil(action$.pipe(applicationDisconnected))
      )
    )
  )
}
