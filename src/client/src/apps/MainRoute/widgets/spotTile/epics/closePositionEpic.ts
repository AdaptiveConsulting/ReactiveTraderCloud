import { applicationConnected } from 'rt-actions'
import { Direction } from 'rt-types'
import { CurrencyPair } from 'rt-types'
import { filter, map, switchMapTo, withLatestFrom } from 'rxjs/operators'
import { ApplicationEpic } from 'StoreTypes'
import { SpotTileActions } from '../actions'
import { SpotTileData } from '../model/spotTileData'
import { InteropTopics, platformHasFeature } from 'rt-platforms'
import { EMPTY } from 'rxjs'

interface Msg {
  amount: number
  ccy: string
  symbol: string
  correlationId: string
}

type Message = [Msg, string]

function createTrade(msg: Msg, priceData: SpotTileData, currencyPair: CurrencyPair) {
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

export const closePositionEpic: ApplicationEpic = (action$, state$, {platform}) => {
  if (!platformHasFeature(platform, 'interop')) {
    return EMPTY
  }

  const interopSubscribe$ = platform.interop.subscribe$(InteropTopics.ClosePosition)

  return action$.pipe(
    applicationConnected,
    switchMapTo(interopSubscribe$),
    withLatestFrom(state$),
    filter(([message, state]) => {
      const [msg] = message as Message
      return state.spotTilesData.hasOwnProperty(msg.symbol)
    }),
    map(([message, state]) => {
      const [msg, uuid] = message as Message
      const trade = createTrade(
        msg,
        state.spotTilesData[msg.symbol]!, // we know that spot tile data exists as we have filtered it out above
        state.currencyPairs[msg.symbol],
      )
      return SpotTileActions.executeTrade(trade, {
        uuid,
        correlationId: msg.correlationId,
      })
    })
  )
}
