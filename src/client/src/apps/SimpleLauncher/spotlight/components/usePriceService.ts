import PricingService from '../../../MainRoute/widgets/spotTile/epics/pricingService'
import { useContext } from 'react';
import { PricingServiceContext } from '../context';

export const usePriceService = (): PricingService | undefined => {
  return useContext(PricingServiceContext)
}
