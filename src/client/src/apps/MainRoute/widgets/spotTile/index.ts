import { SpotPriceTick as SpotPriceTickType } from './model'
export { spotTileDataReducer } from './spotTileDataReducer'
export { default as createSpotTileEpic, PricingService } from './epics'
export { default as SpotTileContainer } from './SpotTileContainer'

export type SpotPriceTick = SpotPriceTickType
