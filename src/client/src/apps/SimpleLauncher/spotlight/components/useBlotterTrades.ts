import { useContext, useEffect, useState } from 'react'
import { map, scan } from 'rxjs/operators'
import { Trade } from 'rt-types'
import { TradesUpdate, BlotterFilters, filterBlotterTrades } from 'apps/MainRoute'
import { TradeUpdatesContext } from '../context'

type TradeLookup = Map<number, Trade>

const MAX_TRADES = 20

const isArrayFilterEmpty = (arr?: any) => arr?.length === 1 && arr[0] === ''

export const useBlotterTrades = (filters?: BlotterFilters) => {
  const [trades, setTrades] = useState<Trade[]>([])
  const trades$ = useContext(TradeUpdatesContext)

  useEffect(() => {
    if (!trades$) {
      console.error(`tradesStream was not provided`)
      return
    }

    const subscription = trades$
      .pipe(
        map((tradeUpdate: TradesUpdate) =>
          filterBlotterTrades(tradeUpdate.trades, {
            ...filters,
            // get all trades and then limit in the end (so that we can show user how many filtered out)
            count: undefined,
          })
        ),
        scan<ReadonlyArray<Trade>, Map<number, Trade>>((acc, trades) => {
          trades.forEach(trade => acc.set(trade.tradeId, trade))
          return acc
        }, new Map<number, Trade>()),
        map((trades: TradeLookup) => Array.from(trades.values()).reverse())
      )
      .subscribe(
        result => {
          const newTradeCount = result.length
          let newTrades = result.slice(
            0,
            filters && typeof filters.count !== 'undefined' ? filters.count : MAX_TRADES
          )

          if (!isArrayFilterEmpty(filters?.dealtCurrency) || !isArrayFilterEmpty(filters?.symbol)) {
            newTrades = newTrades.filter(
              t =>
                filters?.dealtCurrency?.includes(t.dealtCurrency) ||
                filters?.symbol?.includes(t.symbol) ||
                filters?.symbol?.some(value => t.dealtCurrency.includes(value))
            )
          }

          setTrades(newTrades)

          console.info(`Showing ${newTrades.length} of ${newTradeCount} trades.`)
        },
        error => {
          console.error(`Error subscribing to inline blotter service: ${error}`)
        }
      )

    return () => {
      if (subscription) {
        subscription.unsubscribe()
      }
    }
  }, [filters, trades$])

  return trades
}
