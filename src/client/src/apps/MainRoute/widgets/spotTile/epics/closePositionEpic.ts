import { applicationConnected } from 'rt-actions'
import { Direction } from 'rt-types'
import { CurrencyPair } from 'rt-types'
import { filter, map, switchMapTo, withLatestFrom } from 'rxjs/operators'
import { ApplicationEpic, GlobalState } from 'StoreTypes'
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

function getSpotTilesDataFromMessage(message: Message, state: GlobalState) {
  const [msg] = message as Message
  return state.spotTilesData[msg.symbol]
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
    filter(([message, state]) => !!getSpotTilesDataFromMessage(message, state)),
    map(([message, state]) => {
      const [msg, uuid] = message
      const trade = createTrade(
        msg,
        getSpotTilesDataFromMessage(message, state)!, // we know that spot tile data exists as we have filtered it out above
        state.currencyPairs[msg.symbol],
      )
      return SpotTileActions.executeTrade(trade, {
        uuid,
        correlationId: msg.correlationId,
      })
    })
  )
}
