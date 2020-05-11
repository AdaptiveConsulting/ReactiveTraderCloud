import React, { FC, useEffect, useState } from 'react'
import { usePriceService } from './usePriceService'
import { SpotPriceTick } from 'apps/MainRoute'
import { InlineIntent } from './styles'
import { DateTime } from 'luxon'
import { ResultsTable, ResultsTableRow, LoadingRow } from './resultsTable'
import { MovementIcon } from '../../icons'
import { defaultColDefs } from './utils'
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
      .subscribe((result) => {
        setQuote(result)
      }, console.error)

    return () => {
      if (subscription) {
        subscription.unsubscribe()
      }
    }
  }, [priceService, currencyPair])

  const row =
    quote && quote.symbol
      ? [
        {
          ...quote,
          priceMovementType: <MovementIcon direction={quote.priceMovementType} />,
          valueDate: DateTime.fromISO(quote.valueDate).toFormat('dd LLL yyyy / HH:mm:ss'),
        },
      ]
      : []

  if (!quote) {
    return <LoadingRow cols={defaultColDefs} />
  }

  if (quote && quote?.symbol) {
    return <ResultsTableRow row={row[0]} cols={defaultColDefs} />
  }

  return null
}

export const InlineQuoteTable: FC<InlineQuoteProps> = ({ currencyPair }) => {
  return (
    <InlineIntent>
      <ResultsTable cols={defaultColDefs}>
        <InlineQuote currencyPair={currencyPair} />
      </ResultsTable>
    </InlineIntent>
  )
}
