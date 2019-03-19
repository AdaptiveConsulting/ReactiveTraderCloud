import { CurrencyPair, Direction, ServiceConnectionStatus } from 'rt-types'
import { SpotTileData } from '../model'
import { ValidationMessage } from './notional/NotionalInput'

export type RfqState = 'none' | 'canRequest' | 'requested' | 'received' | 'expired'

export interface Props {
  currencyPair: CurrencyPair
  spotTileData: SpotTileData
  executionStatus: ServiceConnectionStatus
  executeTrade: (direction: Direction, rawSpotRate: number) => void
  notional: string
  updateNotional: (notional: string) => void
  inputValidationMessage: ValidationMessage
  tradingDisabled: boolean
  chartData?: []
}
