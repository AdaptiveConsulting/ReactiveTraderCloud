import { setupLayout, LayoutActions } from './layoutActions'
import { map, switchMapTo, takeUntil, switchMap } from 'rxjs/operators'
import { ApplicationEpic } from 'StoreTypes'
import { ConnectionStatusService } from '../layoutService'

type LayoutSetupAction = ReturnType<typeof LayoutActions.setup>

export const connectionStatusEpic: ApplicationEpic = (action$, state$) => {
  const layoutService = new ConnectionStatusService(connection$)
  return action$.pipe(
    setupLayout,
    switchMap(async ({ stuff }) => {}),
  )
}
