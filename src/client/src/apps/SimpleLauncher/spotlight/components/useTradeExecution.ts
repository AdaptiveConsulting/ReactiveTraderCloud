import { createTradeRequest, SpotPriceTick } from 'apps/MainRoute/widgets/spotTile/model'
import {
  ExecuteTradeRequest,
  ExecuteTradeResponse,
} from 'apps/MainRoute/widgets/spotTile/model/executeTradeRequest'
import { useContext, useState } from 'react'
import { CurrencyPair } from 'rt-types'
import { take } from 'rxjs/operators'
import { TradeExecutionContext } from '../context'

import { usePriceService } from './usePriceService'

export function useTradeExecution() {
  const [loading, setLoading] = useState<boolean>(false)
  const [tradeResponse, setTradeResponse] = useState<ExecuteTradeResponse>()
  const [error, setError] = useState<string>()
  const executionService = useContext(TradeExecutionContext)
  const priceService = usePriceService()

  const getSpotRate = (currencyPair: string): Promise<SpotPriceTick> | undefined => {
    return priceService?.getSpotPriceStream({ symbol: currencyPair }).pipe(take(1)).toPromise()
  }

  const executeTrade = async ({
    partialTradeRequest,
    currencyPairs,
  }: {
    partialTradeRequest: Partial<ExecuteTradeRequest>
    currencyPairs: CurrencyPair
  }) => {
    const { Direction, CurrencyPair, Notional } = partialTradeRequest

    if (!Direction || !CurrencyPair || !Notional) {
      return
    }

    setError(undefined)
    setLoading(true)

    try {
      const spotPrice = await getSpotRate(CurrencyPair)

      if (!spotPrice) {
        setError('Unable to get Spot Price.')
        return
      }

      const spotRate = Direction === 'Buy' ? spotPrice.ask : spotPrice.bid
      const completeCurrencyPair = currencyPairs?.[spotPrice.symbol]

      if (!completeCurrencyPair) {
        setError('Unable to get Currency Pair.')
        return
      }

      const tradeRequestObj = createTradeRequest({
        direction: Direction,
        currencyBase: completeCurrencyPair.base,
        symbol: spotPrice.symbol,
        notional: Notional,
        rawSpotRate: spotRate,
      })

      executionService?.executeTrade(tradeRequestObj).subscribe(tradeResponse => {
        setTradeResponse(tradeResponse)
      })
    } catch (e) {
      console.log(`Error executing trade from Launcher: ${e}`)
    } finally {
      setLoading(false)
    }
  }

  return {
    executeTrade,
    tradeResponse,
    loading,
    error,
  }
}
