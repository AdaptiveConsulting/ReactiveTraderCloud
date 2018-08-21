import { applicationConnected, applicationDisconnected } from 'rt-actions'
import { map, switchMapTo, takeUntil } from 'rxjs/operators'
import { ApplicationEpic } from 'StoreTypes'
import { ConnectionStatusActions } from '../connectionStatusActions'
import { ConnectionStatusService } from '../connectionStatusService'

type CreateConnectionAction = ReturnType<typeof ConnectionStatusActions.createConnectionStatusUpdateAction>

export const connectionStatusEpic: ApplicationEpic = (action$, state$, { connection$ }) => {
  const connectionStatusService = new ConnectionStatusService(connection$)
  return action$.pipe(
    applicationConnected,
    switchMapTo<CreateConnectionAction>(
      connectionStatusService.connectionStatus$.pipe(
        map(ConnectionStatusActions.createConnectionStatusUpdateAction),
        takeUntil(action$.pipe(applicationDisconnected))
      )
    )
  )
}
