import { ofType, StateObservable } from 'redux-observable'
import { map, switchMapTo, takeUntil, tap } from 'rxjs/operators'
import { ApplicationEpic } from '../../ApplicationEpic'
import { GlobalState } from '../../combineReducers'
import { CONNECT_SERVICES, DISCONNECT_SERVICES } from '../../connectionActions'
import { CurrencyPairReducerState } from '../../currencyPairsOperations'
import { OpenFin } from '../../services/openFin'
import { BlotterActions } from './actions'
import { Trades } from './reducer'

const subscribeOpenFinToBlotterData = (openFin: OpenFin, state$: StateObservable<GlobalState>) => () => {
  const trades: Trades = state$.value.blotterService.trades
  const currencyPairs: CurrencyPairReducerState = state$.value.currencyPairs
  const cb = (msg: any, uuid: string) => openFin.sendAllBlotterData(uuid, trades, currencyPairs)
  openFin.addSubscription('fetch-blotter', cb)
}

export const blotterServiceEpic: ApplicationEpic = (action$, state$, { blotterService, openFin }) =>
  action$.pipe(
    ofType(CONNECT_SERVICES),
    switchMapTo(
      blotterService.getTradesStream().pipe(
        map(BlotterActions.createNewTradesAction),
        tap(subscribeOpenFinToBlotterData(openFin, state$)),
        takeUntil(action$.pipe(ofType(DISCONNECT_SERVICES)))
      )
    )
  )

export default blotterServiceEpic
