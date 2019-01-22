import { applicationConnected } from 'rt-actions'
import { fromEventPattern } from 'rxjs'
import { map, switchMapTo, withLatestFrom, delay } from 'rxjs/operators'
import { ApplicationEpic } from 'StoreTypes'
import { BLOTTER_ACTION_TYPES, BlotterActions } from '../actions'
import { combineEpics, ofType } from 'redux-observable'
import { Action } from 'redux'
import { Trade } from 'rt-types'

const { highlightTradeAction, removeHighlightTradeAction } = BlotterActions
const TRADE_HIGHLIGHT_TIME_IN_MS = 3000

type HighlightTradeAction = ReturnType<typeof highlightTradeAction>

const switchHighlight = (trade: Trade) => ({
  ...trade,
  highlight: !trade.highlight,
})

const highlightTradeEpic: ApplicationEpic = (action$, state$, { platform }) => {
  const interopObservable$ = fromEventPattern(
    (handler: Function) => platform.interop!.subscribe('*', 'highlight-blotter', handler as () => void),
    (handler: Function) => platform.interop!.unsubscribe('*', 'highlight-blotter', handler as () => void),
  )

  return action$.pipe(
    applicationConnected,
    switchMapTo(interopObservable$),
    withLatestFrom(state$),
    map(([message, state]) => {
      const tradeNotification = message[0].tradeNotification
      const trade = switchHighlight(state.blotterService.trades[tradeNotification.tradeId])
      return highlightTradeAction({ trades: [trade] })
    }),
  )
}

const removeHighlightTradeEpic: ApplicationEpic = (action$, state$, { platform }) => {
  return action$.pipe(
    ofType<Action, HighlightTradeAction>(BLOTTER_ACTION_TYPES.BLOTTER_SERVICE_HIGHLIGHT_TRADE),
    delay(TRADE_HIGHLIGHT_TIME_IN_MS),
    map(({ payload }) => {
      const trade = switchHighlight(payload.trades[0])
      return removeHighlightTradeAction({ trades: [trade] })
    }),
  )
}

export const blotterHighlightEpic = combineEpics(highlightTradeEpic, removeHighlightTradeEpic)
