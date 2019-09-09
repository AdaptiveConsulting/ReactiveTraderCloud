import { ReferenceActions } from 'rt-actions'
import { applicationConnected, applicationDisconnected } from 'rt-actions'
import { map, switchMapTo, takeUntil } from 'rxjs/operators'
import { ApplicationEpic } from 'StoreTypes'
import { Observable } from 'rxjs'
import { CurrencyPairMap } from 'rt-types'

const { createReferenceServiceAction } = ReferenceActions
type ReferenceServiceAction = ReturnType<typeof createReferenceServiceAction>

export const referenceServiceEpic: ApplicationEpic<{ referenceDataService$: Observable<CurrencyPairMap> }> = (
  action$,
  _,
  { referenceDataService$ },
) =>
  action$.pipe(
    applicationConnected,
    switchMapTo<ReferenceServiceAction>(
      referenceDataService$.pipe(
        map(createReferenceServiceAction),
        takeUntil(action$.pipe(applicationDisconnected)),
      ),
    ),
  )
