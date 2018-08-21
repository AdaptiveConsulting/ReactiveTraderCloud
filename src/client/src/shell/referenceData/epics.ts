import { ReferenceActions } from 'rt-actions'
import { applicationConnected, applicationDisconnected } from 'rt-actions'
import { map, switchMapTo, takeUntil } from 'rxjs/operators'
import { ApplicationEpic } from 'StoreTypes'

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
