import { RawTradeUpdate, Direction } from 'rt-types'
import { Observable } from 'rxjs'
import { fromActionsToMarbles } from 'rt-testing'
import { Action, ActionWithPayload } from 'rt-util'
import { TradesUpdate } from './blotterService'

export function fromTradeActionsToMarbles(action$: Observable<ActionWithPayload<any, TradesUpdate> | Action<any>>) {
  return fromActionsToMarbles(action$, fromTradeActionToMarble)
}

export function fromTradeActionToMarble({ payload: { trades } }: ActionWithPayload<any, TradesUpdate>) {
  return trades[0].tradeId.toString()
}

export function toRawTradeUpdate(marble: string | number | {}): RawTradeUpdate {
  const tradeId = typeof marble === 'number' ? marble : parseInt(marble.toString())
  const snapshot = tradeId === 0
  return {
    IsStateOfTheWorld: snapshot,
    IsStale: false,
    Trades: snapshot
      ? Array.from(Array(10).keys()).map(i => ({
          TradeId: tradeId + i,
          CurrencyPair: 'USD/EUP',
          TraderName: 'bob',
          Notional: i * 100,
          DealtCurrency: 'USD',
          Direction: Direction.Buy,
          Status: 'PENDING',
          SpotRate: i * 100,
          TradeDate: new Date().toString(),
          ValueDate: new Date().toString(),
        }))
      : [
          {
            TradeId: tradeId,
            CurrencyPair: 'USD/EUP',
            TraderName: 'bob',
            Notional: Math.random() * 100,
            DealtCurrency: 'USD',
            Direction: Direction.Buy,
            Status: 'PENDING',
            SpotRate: Math.random() * 100,
            TradeDate: new Date().toString(),
            ValueDate: new Date().toString(),
          },
        ],
  }
}
