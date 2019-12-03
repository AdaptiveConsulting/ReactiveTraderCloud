import { useContext, useEffect, useState } from 'react'
import { map, scan } from 'rxjs/operators'
import { Trade } from 'rt-types'
import { TradesUpdate } from '../../../MainRoute/widgets/blotter/blotterService'
import { BlotterFilters, filterBlotterTrades } from '../../../MainRoute/widgets/blotter'
import { TradeUpdatesContext } from '../context';

type TradeLookup = Map<number, Trade>

const MAX_TRADES = 20

export const useBlotterTrades = (filters?: BlotterFilters) => {
  const [trades, setTrades] = useState<Trade[]>([])
  const trades$ = useContext(TradeUpdatesContext)

  useEffect(() => {
      if (!trades$) {
        console.error(`tradesStream was not provided`)
        return;
      }

      const subscription = trades$
        .pipe(
          map((tradeUpdate: TradesUpdate) =>
            filterBlotterTrades(tradeUpdate.trades, {
              ...filters,
              // get all trades and then limit in the end (so that we can show user how many filtered out)
              count: undefined,
            }),
          ),
          scan<ReadonlyArray<Trade>, Map<number, Trade>>((acc, trades) => {
            trades.forEach(trade => acc.set(trade.tradeId, trade))
            return acc
          }, new Map<number, Trade>()),
          map((trades: TradeLookup) => Array.from(trades.values()).reverse()),
        )
        .subscribe(result => {
          const newTradeCount = result.length;
          const newTrades = result.slice(0, filters && typeof filters.count !== 'undefined' ? filters.count : MAX_TRADES,);

          setTrades(newTrades)

          console.info(`Showing ${newTrades.length} of ${newTradeCount} trades.`)
        }, (error) => {
          console.error(`Error subscribing to inline blotter service: ${error}`)
        })

      return () => {
        if (subscription) {
          subscription.unsubscribe()
        }
      }
    },
    [filters, trades$]
  )

  return trades;
}
