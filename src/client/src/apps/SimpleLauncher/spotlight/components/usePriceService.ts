import { useContext } from 'react'
import { PricingService } from 'apps/MainRoute'
import { PricingServiceContext } from '../context'

export const usePriceService = (): PricingService | undefined => {
  return useContext(PricingServiceContext)
}
