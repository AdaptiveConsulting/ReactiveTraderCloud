import { ofType } from 'redux-observable'
import { map, switchMapTo, takeUntil, tap } from 'rxjs/operators'
import { CONNECT_SERVICES, DISCONNECT_SERVICES } from '../../connectionActions'
import { BlotterService } from '../../services'
import { OpenFin } from '../../services/openFin'
import { CurrencyPair, Trade } from '../../types'
import { createNewTradesAction } from './actions'

const subscribeOpenFinToBlotterData = (openFin, store) => () => {
  const trades: Trade[] = store.getState().blotterService.trades
  const currencyPairs: CurrencyPair[] = store.getState().blotterService
    .currencyPairs
  const cb = (msg, uuid) =>
    openFin.sendAllBlotterData(uuid, trades, currencyPairs)
  openFin.addSubscription('fetch-blotter', cb)
}

export const blotterServiceEpic = (
  blotterService$: BlotterService,
  openFin: OpenFin
) => (action$, store) =>
  action$.pipe(
    ofType(CONNECT_SERVICES),
    switchMapTo(
      blotterService$
        .getTradesStream()
        .pipe(
          map(createNewTradesAction),
          tap(subscribeOpenFinToBlotterData(openFin, store)),
          takeUntil(action$.pipe(ofType(DISCONNECT_SERVICES)))
        )
    )
  )

export default blotterServiceEpic
