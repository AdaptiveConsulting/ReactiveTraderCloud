import blotterAPI, { TradesUpdate } from '../blotterAPI'
import { serviceClient } from 'apps/MainRoute/store/singleServices'
import { shareReplay, scan, map } from 'rxjs/operators'
import { Trades, Trade } from 'rt-types'
import { keyBy } from 'lodash'

export const newTrades$ = blotterAPI(serviceClient).pipe(shareReplay(1))

const inital: Trades = {}
export const rows$ = newTrades$.pipe(
  scan<TradesUpdate, Trades>((acc, trades) => {
    const newTradesById = keyBy(trades.trades, `tradeId`)
    return { ...acc, ...newTradesById }
  }, inital),
  map<Trades, Trade[]>(trades => Object.values(trades).reverse()),
  shareReplay(1)
)
