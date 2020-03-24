import React, { FC, useEffect, useState } from 'react'
import { usePriceService } from './usePriceService'
import { SpotPriceTick } from 'apps/MainRoute'
import { InlineIntent } from './styles'
import { DateTime } from 'luxon'
import { ResultsTable, Col } from './resultsTable'
import { MovementIcon } from '../../icons'

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

  const colDefs: Col[] = [
    { title: 'Symbol', id: 'symbol' },
    { title: 'Ask', id: 'ask', align: 'right' },
    { title: 'Mid', id: 'mid', align: 'right' },
    { title: 'Bid', id: 'bid', align: 'right' },
    { title: 'Movement', id: 'priceMovementType', align: 'center' },
    { title: 'Date/Time', id: 'valueDate' },
  ]

  const rows =
    quote && quote.symbol
      ? [
          {
            ...quote,
            priceMovementType: <MovementIcon direction={quote.priceMovementType} />,
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
