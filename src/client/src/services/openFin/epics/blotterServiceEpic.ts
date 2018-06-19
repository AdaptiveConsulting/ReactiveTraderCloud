import { Action } from 'redux'
import { ofType } from 'redux-observable'
import { debounceTime, ignoreElements, tap } from 'rxjs/operators'
import { ApplicationEpic } from '../../../ApplicationEpic'
import { ACTION_TYPES as BLOTTER_ACTION_TYPES, BlotterActions } from '../../../ui/blotter'

const { createNewTradesAction } = BlotterActions
type NewTradesAction = ReturnType<typeof createNewTradesAction>

/* export const subscribeOpenFinToBlotterData = (openFin: OpenFin, state$: StateObservable<GlobalState>) => () => {
  const trades: Trades = state$.value.blotterService.trades
  const currencyPairs: CurrencyPairState = state$.value.currencyPairs
  const cb = (msg: any, uuid: string) => openFin.sendAllBlotterData(trades, currencyPairs)
  openFin.addSubscription('fetch-blotter', cb)
} */

export const connectBlotterServiceToOpenFinEpic: ApplicationEpic = (action$, state$, { openFin }) =>
  action$.pipe(
    ofType<Action, NewTradesAction>(BLOTTER_ACTION_TYPES.BLOTTER_SERVICE_NEW_TRADES),
    debounceTime(2000),
    tap(() => openFin.sendAllBlotterData(state$.value.blotterService.trades, state$.value.currencyPairs)),
    ignoreElements()
  )
