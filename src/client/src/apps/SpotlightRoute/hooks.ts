import { useEffect, useState } from 'react'
import { ServiceClient } from 'rt-system'
// TODO - lift services out...
import PricingService from '../MainRoute/widgets/spotTile/epics/pricingService'
import BlotterService from '../MainRoute/widgets/blotter/blotterService'

const useXxxService = <T>(TCreator: { new (serviceStub: ServiceClient): T; }, serviceStub: ServiceClient): T => {
  const [service, setService] = useState(null)

  useEffect(() => {
    const service = new TCreator(serviceStub)

    setService(service)
  }, [TCreator, serviceStub])

  return service
}

export const usePriceService = (serviceStub: ServiceClient): PricingService => {
  return useXxxService(PricingService, serviceStub)
}

export const useBlotterService = (serviceStub: ServiceClient): BlotterService => {
  return useXxxService(BlotterService, serviceStub)
}
