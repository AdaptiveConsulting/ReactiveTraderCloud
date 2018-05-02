import { ACTION_TYPES as REF_ACTION_TYPES } from '../../referenceDataOperations'
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

export const blotterServiceEpic = (blotterService$, openFin) => (
  action$,
  store
) => {
  return action$
    .ofType(REF_ACTION_TYPES.REFERENCE_SERVICE)
    .do(subscribeOpenFinToBlotterData(openFin, store))
    .flatMapTo(blotterService$.getTradesStream())
    .map(createNewTradesAction)
}

export default blotterServiceEpic
