import { CurrencyPair, Direction, ServiceConnectionStatus } from 'rt-types'
import { SpotTileData } from '../model'
import { ValidationMessage, NotionalUpdate } from './notional/NotionalInput'

export type RfqState = 'none' | 'canRequest' | 'requested' | 'received' | 'expired'
export interface RfqStateManagement {
  userError: boolean
  rfqState: RfqState
  rfqInitiate: () => void
  rfqCancel: () => void
  rfqRequote: () => void
}

export interface Props {
  currencyPair: CurrencyPair
  spotTileData: SpotTileData
  executionStatus: ServiceConnectionStatus
  executeTrade: (direction: Direction, rawSpotRate: number) => void
  notional: string
  updateNotional: (notionalUpdate: NotionalUpdate) => void
  rfqInitiate: () => void
  rfqCancel: () => void
  rfqRequote: () => void
  inputDisabled: boolean
  inputValidationMessage: ValidationMessage
  tradingDisabled: boolean
  chartData?: []
}
