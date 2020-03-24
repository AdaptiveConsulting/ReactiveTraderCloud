import React, { FC, useEffect, useState } from 'react'
import { usePriceService } from './usePriceService'
import { SpotPriceTick } from 'apps/MainRoute'
import { InlineIntent } from './styles'
import { DateTime } from 'luxon'
import { ResultsTable } from './resultsTable'

interface InlineQuoteProps {
  currencyPair: string
}

export const InlineQuote: FC<InlineQuoteProps> = ({ currencyPair }) => {
  const [quote, setQuote] = useState<SpotPriceTick>()
  const priceService = usePriceService()

  useEffect(() => {
    if (!priceService) {
      return
    }
    const subscription = priceService
      .getSpotPriceStream({ symbol: currencyPair })
      .subscribe(result => {
        setQuote(result)
      }, console.error)

    return () => {
      if (subscription) {
        subscription.unsubscribe()
      }
    }
  }, [priceService, currencyPair])

  const colDefs = [
    { title: 'Symbol', id: 'symbol' },
    { title: 'Ask', id: 'ask' },
    { title: 'Mid', id: 'mid' },
    { title: 'Bid', id: 'bid' },
    { title: 'Movement', id: 'priceMovementType' },
    { title: 'Date/Time', id: 'valueDate' },
  ]
  const rows =
    quote && quote.symbol
      ? [
          {
            ...quote,
            valueDate: DateTime.fromISO(quote.valueDate).toFormat('yyyy LLL dd / HH:mm:ss'),
          },
        ]
      : []

  return quote && quote.symbol ? (
    <InlineIntent>
      <ResultsTable cols={colDefs} rows={rows} />
    </InlineIntent>
  ) : null
}
