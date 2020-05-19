import { useContext, useState, useEffect } from 'react'
import { ReferenceDataContext } from '../context'

interface CurrencyPairs {
  key: {
    base: string
    pipsPosition: number
    ratePrecision: number
    symbol: string
    terms: string
  }
}

export const useMarketService = (): any | undefined => {
  const [currencyPairs, setCurrencyPairs] = useState<CurrencyPairs>()
  const currencyPairs$ = useContext(ReferenceDataContext)

  useEffect(() => {
    if (!currencyPairs$) {
      console.error('referenceData stream was not provided')
      return
    }

    const subscription = currencyPairs$.pipe().subscribe(result => {
      setCurrencyPairs(result)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [currencyPairs$])

  return currencyPairs
}
