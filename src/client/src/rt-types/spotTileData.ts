import { Notification } from './notification'
import { SpotPriceTick } from './spotPriceTick'

export interface SpotTileData {
  notification?: Notification
  currencyChartIsOpening: boolean
  isTradeExecutionInFlight: boolean
  hasError: boolean
  price?: SpotPriceTick
}
