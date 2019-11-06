import { useEffect, useState } from 'react'
import { ServiceClient } from 'rt-system'
// TODO - lift services out...
import PricingService from '../MainRoute/widgets/spotTile/epics/pricingService'
import BlotterService from '../MainRoute/widgets/blotter/blotterService'

const useXxxService = <T>(
  TCreator: { new (serviceStub: ServiceClient): T },
  serviceStub?: ServiceClient,
): T | undefined => {
  const [service, setService] = useState<T | undefined>(undefined)

  useEffect(() => {
    if (!serviceStub) {
      return
    }
    const service = new TCreator(serviceStub)

    setService(service)
  }, [TCreator, serviceStub])

  return service
}

export const usePriceService = (serviceStub?: ServiceClient): PricingService | undefined => {
  return useXxxService(PricingService, serviceStub)
}

export const useBlotterService = (serviceStub?: ServiceClient): BlotterService | undefined => {
  return useXxxService(BlotterService, serviceStub)
}
