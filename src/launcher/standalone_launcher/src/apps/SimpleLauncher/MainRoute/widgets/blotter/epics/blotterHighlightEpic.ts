import { applicationConnected, applicationDisconnected } from 'rt-actions'
import { map, switchMapTo, withLatestFrom, delay, filter, takeUntil } from 'rxjs/operators'
import { ApplicationEpic } from 'StoreTypes'
import { BLOTTER_ACTION_TYPES, BlotterActions } from '../actions'
import { combineEpics, ofType } from 'redux-observable'
import { Action } from 'redux'
import { Trade } from 'rt-types'
import { EMPTY } from 'rxjs'
import { InteropTopics, platformHasFeature } from 'rt-platforms'

const { highlightTradeAction, removeHighlightTradeAction } = BlotterActions
const TRADE_HIGHLIGHT_TIME_IN_MS = 3000

type HighlightTradeAction = ReturnType<typeof highlightTradeAction>

const switchHighlight = (trade: Trade, on: boolean) => ({
  ...trade,
  highlight: on,
})

const highlightTradeEpic: ApplicationEpic = (action$, state$, { platform }) => {
  if (!platformHasFeature(platform, 'interop')) {
    return EMPTY
  }

  const interopObservable$ = platform.interop.subscribe$(InteropTopics.HighlightBlotter)
  return action$.pipe(
    applicationConnected,
    switchMapTo(interopObservable$),
    withLatestFrom(state$),
    map(([message, state]) => {
      const tradeNotification = message[0].tradeNotification
      return state.blotterService.trades[tradeNotification.tradeId]
    }),
    filter(Boolean),
    map(trade => {
      return highlightTradeAction({ trades: [switchHighlight(trade as Trade, true)] })
    }),
    takeUntil(action$.pipe(applicationDisconnected))
  )
}

const removeHighlightTradeEpic: ApplicationEpic = (action$, state$, { platform }) => {
  return action$.pipe(
    ofType<Action, HighlightTradeAction>(BLOTTER_ACTION_TYPES.BLOTTER_SERVICE_HIGHLIGHT_TRADE),
    delay(TRADE_HIGHLIGHT_TIME_IN_MS),
    map(({ payload }) => {
      const trade = switchHighlight(payload.trades[0], false)
      return removeHighlightTradeAction({ trades: [trade] })
    }),
    takeUntil(action$.pipe(applicationDisconnected))
  )
}

export const blotterHighlightEpic = combineEpics(highlightTradeEpic, removeHighlightTradeEpic)
