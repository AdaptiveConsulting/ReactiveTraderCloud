import { applicationConnected, applicationDisconnected } from 'rt-actions'
import { map, switchMapTo, takeUntil } from 'rxjs/operators'
import { ApplicationEpic } from 'StoreTypes'
import { ConnectionStatusActions } from '../connectionStatusActions'

type CreateConnectionAction = ReturnType<
  typeof ConnectionStatusActions.createConnectionStatusUpdateAction
>

export const connectionStatusEpic: ApplicationEpic = (action$, state$, { connection$ }) => {
  return action$.pipe(
    applicationConnected,
    switchMapTo<CreateConnectionAction>(
      connection$.pipe(
        map(ConnectionStatusActions.createConnectionStatusUpdateAction),
        takeUntil(action$.pipe(applicationDisconnected))
      )
    )
  )
}
