import React, { FC, useEffect, useState } from 'react'
import { usePriceService } from './usePriceService'
import { SpotPriceTick } from 'apps/MainRoute'
import { InlineIntent, LoadingWrapper } from './styles'
import { DateTime } from 'luxon'
import { ResultsTable, Col } from './resultsTable'
import { MovementIcon } from '../../icons'
import { AdaptiveLoader } from 'rt-components'

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

  const highlightPip = (value: number, bidAsk: 'bid' | 'ask') => {
    const array = String(value).split('')
    return array.map((char: string, index: number) => {
      const style =
        index === array.length - 2 || index === array.length - 1
          ? {
              color: bidAsk === 'ask' ? '#ff274b' : '#2d95ff',
              fontSize: '1rem',
            }
          : {}
      return (
        <span style={style} key={`${char}-${index}`}>
          {char}
        </span>
      )
    })
  }

  const colDefs: Col[] = [
    { title: 'Symbol', id: 'symbol' },
    { title: 'Ask', id: 'ask', align: 'right', formatter: value => highlightPip(value, 'ask') },
    { title: 'Mid', id: 'mid', align: 'right' },
    { title: 'Bid', id: 'bid', align: 'right', formatter: value => highlightPip(value, 'bid') },
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

  return (
    <InlineIntent>
      {!quote && (
        <LoadingWrapper>
          <AdaptiveLoader size={25} speed={1.4} />
        </LoadingWrapper>
      )}
      {quote && quote.symbol && <ResultsTable cols={colDefs} rows={rows} />}
    </InlineIntent>
  )
}
