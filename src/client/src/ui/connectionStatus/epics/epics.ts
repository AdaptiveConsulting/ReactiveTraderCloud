import { map, switchMapTo, takeUntil } from 'rxjs/operators'
import { ApplicationEpic } from '../../../ApplicationEpic'
import { ConnectionStatusActions } from '../connectionStatusActions'
import { ConnectionStatusService } from '../connectionStatusService'
import { applicationConnected, applicationDisconnected } from '../operators'

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
