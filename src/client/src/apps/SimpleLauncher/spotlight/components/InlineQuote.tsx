import React, { FC, useEffect, useState } from 'react'
import { usePriceService } from './usePriceService'
import { SpotPriceTick } from '../../../MainRoute/widgets/spotTile/model'
import { InlineIntent, InlineQuoteContainer } from './styles';

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

  const baseCcy = quote && quote.symbol.substring(0, 3)
  const counterCcy = quote && quote.symbol.substring(3)

  return (
    quote && quote.symbol ? (
      <InlineIntent>
        <InlineQuoteContainer>
          1 {baseCcy} = {quote.mid} {counterCcy}
        </InlineQuoteContainer>
      </InlineIntent>
    ) : null
  )
}
