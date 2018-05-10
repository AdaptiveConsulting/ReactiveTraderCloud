import { map, tap } from 'rxjs/operators'
import { BlotterService } from '../../services'
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
  openFin
) => (action$, store) => {
  return blotterService$
    .getTradesStream()
    .pipe(
      map(createNewTradesAction),
      tap(subscribeOpenFinToBlotterData(openFin, store))
    )
}

export default blotterServiceEpic
