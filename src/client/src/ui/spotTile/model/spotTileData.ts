import { Notification } from '../../../rt-types/notification'
import { SpotPriceTick } from './spotPriceTick'

export interface SpotTileData {
  notification?: Notification
  currencyChartIsOpening: boolean
  isTradeExecutionInFlight: boolean
  hasError: boolean
  price?: SpotPriceTick
}
