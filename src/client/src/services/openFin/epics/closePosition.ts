import { Action } from 'redux'
import { ofType } from 'redux-observable'
import { bindCallback } from 'rxjs'
import { map, mergeMapTo, withLatestFrom } from 'rxjs/operators'
import { ApplicationEpic } from '../../../ApplicationEpic'
import { ACTION_TYPES as CONNECTION_ACTION_TYPES, ConnectAction } from '../../../operations/connectionStatus'
import { Direction } from '../../../types'
import { SpotTileActions } from '../../../ui/spotTile'

function createTrade(msg, price) {
  const direction = msg.amount > 0 ? Direction.Sell : Direction.Buy
  const notional = Math.abs(msg.amount)

  const spotRate = direction === Direction.Buy ? price.ask : price.bid

  return {
    CurrencyPair: price.symbol,
    SpotRate: spotRate,
    Direction: direction,
    Notional: notional,
    DealtCurrency: price.currencyPair.base
  }
}

export const closePositionEpic: ApplicationEpic = (action$, state$, { openFin }) =>
  action$.pipe(
    ofType<Action, ConnectAction>(CONNECTION_ACTION_TYPES.CONNECT_SERVICES),
    mergeMapTo(bindCallback(openFin.addSubscription).bind(openFin)('close-position')),
    withLatestFrom(state$),
    map<any, any>(([[msg, uuid], state]) => {
      const trade = createTrade(msg, state.pricingService[msg.symbol])
      return SpotTileActions.executeTrade(trade, {
        uuid,
        correlationId: msg.correlationId
      })
    })
  )
