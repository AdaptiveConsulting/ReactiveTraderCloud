import { useEffect, useState } from 'react'
import { ServiceClient } from 'rt-system'
// TODO - lift it out...
import PricingService from '../MainRoute/widgets/spotTile/epics/pricingService'

export const usePriceService = (serviceStub: ServiceClient): PricingService => {
  const [priceService, setPriceService] = useState(null)

  useEffect(() => {
    const service = new PricingService(serviceStub)

    setPriceService(service)
  }, [serviceStub])

  return priceService
}
