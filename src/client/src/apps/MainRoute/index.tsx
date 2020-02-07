import { APPLICATION_DISCONNECT_MINS } from './store/middleware'
import MainRoute from './MainRoute'
import {
  BlotterFilters as BlotterFiltersType,
  BlotterService,
  DEALT_CURRENCY,
  filterBlotterTrades,
  SYMBOL,
  TradesUpdate as TradesUpdateType,
} from './widgets/blotter'
import { PricingService, SpotPriceTick as SpotPriceTickType } from './widgets/spotTile'

export default MainRoute
export {
  APPLICATION_DISCONNECT_MINS,
  BlotterService,
  DEALT_CURRENCY,
  filterBlotterTrades,
  PricingService,
  SYMBOL,
}
export type TradesUpdate = TradesUpdateType
export type BlotterFilters = BlotterFiltersType
export type SpotPriceTick = SpotPriceTickType
