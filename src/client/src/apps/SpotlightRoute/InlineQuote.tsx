import React, { FC, useEffect, useState } from 'react'
import { usePriceService } from './hooks'
import { useServiceStub } from './context'

interface IProps {
  currencyPair: string
}

export const InlineQuote: FC<IProps> = ({currencyPair}) => {
  const [quote, setQuote] = useState({symbol: '', mid: null})
  const serviceStub = useServiceStub()
  const priceService = usePriceService(serviceStub)

  useEffect(() => {
    if (!priceService) {
      return
    }
    const subscription = priceService.getSpotPriceStream({symbol: currencyPair})
      .subscribe(result => {
        setQuote(result)
      }, console.error)

    return () => {
      if (subscription) {
        subscription.unsubscribe()
      }
    }
  }, [priceService, currencyPair])

  const baseCcy = quote.symbol.substring(0, 3)
  const counterCcy = quote.symbol.substring(3)

  return quote.symbol ? (
    <div>
      1 {baseCcy} = {quote.mid} {counterCcy}
    </div>
  ) : null
}
