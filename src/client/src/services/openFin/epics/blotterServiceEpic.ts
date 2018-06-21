import { Action } from 'redux'
import { ofType, StateObservable } from 'redux-observable'
import { ignoreElements, tap } from 'rxjs/operators'
import { ApplicationEpic } from '../../../ApplicationEpic'
import { GlobalState } from '../../../combineReducers'
import { CurrencyPairState } from '../../../operations/currencyPairs'
import { ACTION_TYPES as BLOTTER_ACTION_TYPES, BlotterActions, Trades } from '../../../ui/blotter'
import OpenFin from '../openFin'

const { createNewTradesAction } = BlotterActions
type NewTradesAction = ReturnType<typeof createNewTradesAction>

const subscribeOpenFinToBlotterData = (openFin: OpenFin, state$: StateObservable<GlobalState>) => () => {
  const trades: Trades = state$.value.blotterService.trades
  const currencyPairs: CurrencyPairState = state$.value.currencyPairs
  const cb = (msg: any, uuid: string) => openFin.sendAllBlotterData(uuid, trades, currencyPairs)
  openFin.addSubscription('fetch-blotter', cb)
}

export const connectBlotterServiceToOpenFinEpic: ApplicationEpic = (action$, state$, { openFin }) =>
  action$.pipe(
    ofType<Action, NewTradesAction>(BLOTTER_ACTION_TYPES.BLOTTER_SERVICE_NEW_TRADES),
    tap(subscribeOpenFinToBlotterData(openFin, state$)),
    ignoreElements()
  )
