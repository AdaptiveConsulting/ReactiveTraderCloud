import { useEffect, useState } from 'react'
import { SpotPriceTick } from 'apps/MainRoute'
import { usePriceService } from './usePriceService'

export const useSpotPrice = (currencyPair: string | undefined) => {
  const priceService = usePriceService()
  const [spotPrice, setSpotPrice] = useState<SpotPriceTick>()

  useEffect(() => {
    setSpotPrice(undefined)
  }, [currencyPair, setSpotPrice])

  useEffect(() => {
    if (!priceService || !currencyPair) {
      return
    }

    const subscription = priceService
      .getSpotPriceStream({ symbol: currencyPair })
      .subscribe(result => {
        setSpotPrice(result)
      }, console.error)

    return () => {
      if (subscription) {
        subscription.unsubscribe()
      }
    }
  }, [priceService, currencyPair])

  return spotPrice
}
