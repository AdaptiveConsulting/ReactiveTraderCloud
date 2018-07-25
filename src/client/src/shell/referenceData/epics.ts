import { ReferenceActions } from 'rt-actions'
import { map, switchMapTo, takeUntil } from 'rxjs/operators'
import { ApplicationEpic } from '../../ApplicationEpic'
import { applicationConnected, applicationDisconnected } from '../../ui/connectionStatus'

const { createReferenceServiceAction } = ReferenceActions
type ReferenceServiceAction = ReturnType<typeof createReferenceServiceAction>

export const referenceServiceEpic: ApplicationEpic = (action$, state$, { referenceDataService }) =>
  action$.pipe(
    applicationConnected,
    switchMapTo<ReferenceServiceAction>(
      referenceDataService.getCurrencyPairUpdates$().pipe(
        map(createReferenceServiceAction),
        takeUntil(action$.pipe(applicationDisconnected))
      )
    )
  )
