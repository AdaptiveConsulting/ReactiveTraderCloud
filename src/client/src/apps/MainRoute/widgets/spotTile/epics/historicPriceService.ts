import { ServiceClient } from 'rt-system'
import { SpotPriceTick } from '../model'

export const getHistoricPrices = (serviceClient: ServiceClient, ccyPair: string) => {
  return serviceClient.createRequestResponseOperation<SpotPriceTick[], string>(
    'priceHistory',
    'getPriceHistory',
    ccyPair
  )
}
