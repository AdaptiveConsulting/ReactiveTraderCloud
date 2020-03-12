import { ServiceStub } from 'rt-system'
import { SpotPriceTick } from '../model'

export const getHistoricPrices = (serviceStub: ServiceStub, ccyPair: string) => {
  return serviceStub.createRequestResponseOperation<SpotPriceTick[], string>(
    'priceHistory',
    'getPriceHistory',
    ccyPair,
  )
}
