import { applicationConnected } from 'rt-actions'
import { Direction } from 'rt-types'
import { CurrencyPair } from 'rt-types'
import { bindCallback, Observable } from 'rxjs'
import { ignoreElements, map, switchMapTo, withLatestFrom } from 'rxjs/operators'
import { ApplicationEpic } from 'StoreTypes'
import { SpotTileActions } from '../actions'
import { SpotTileData } from '../model/spotTileData'

interface Msg {
  amount: number
  ccy: string
  symbol: string
  correlationId: string
}

type Message = [Msg, string]

export function createTrade(msg: Msg, priceData: SpotTileData, currencyPair: CurrencyPair) {
  const direction = msg.amount > 0 ? Direction.Sell : Direction.Buy
  const notional = Math.abs(msg.amount)

  const spotRate = direction === Direction.Buy ? priceData.price.ask : priceData.price.bid

  return {
    CurrencyPair: priceData.price.symbol,
    SpotRate: spotRate,
    Direction: direction,
    Notional: notional,
    DealtCurrency: currencyPair.base,
  }
}

export const closePositionEpic: ApplicationEpic = (action$, state$, { platform }) => {
  const interopSubscribe$: Observable<unknown> = bindCallback(platform.interop.subscribe)('*', 'close-position')

  return action$.pipe(
    applicationConnected,
    switchMapTo(interopSubscribe$),
    withLatestFrom(state$),
    map(([message, state]) => {
      const [msg, uuid] = message as Message
      const trade = createTrade(msg, state.spotTilesData[msg.symbol], state.currencyPairs[msg.symbol])
      return SpotTileActions.executeTrade(trade, {
        uuid,
        correlationId: msg.correlationId,
      })
    }),

    ignoreElements(),
  )
}
