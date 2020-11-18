import { useContext } from 'react'
import { PricingService } from '../../services/pricingService'
import { PricingServiceContext } from '../context'

export const usePriceService = (): PricingService | undefined => {
  return useContext(PricingServiceContext)
}
