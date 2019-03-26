import { CurrencyPair, Direction, ServiceConnectionStatus } from 'rt-types'
import { SpotTileData } from '../model'
import { ValidationMessage, NotionalUpdate } from './notional/NotionalInput'
import { RfqRequest, RfqCancel, RfqRequote, RfqExpired } from '../model/rfqRequest'

export interface TradingMode {
  symbol: CurrencyPair['symbol']
  mode: 'esp' | 'rfq'
}

export type RfqState = 'none' | 'canRequest' | 'requested' | 'received' | 'expired'

export interface RfqActions {
  request: (obj: RfqRequest) => void
  cancel: (obj: RfqCancel) => void
  reject: (obj: RfqCancel) => void
  requote: (obj: RfqRequote) => void
  expired: (obj: RfqExpired) => void
}

export interface TileSwitchChildrenProps {
  notional: string
  userError: boolean
}

export interface Props {
  currencyPair: CurrencyPair
  spotTileData: SpotTileData
  executionStatus: ServiceConnectionStatus
  executeTrade: (direction: Direction, rawSpotRate: number) => void
  notional: string
  updateNotional: (notionalUpdate: NotionalUpdate) => void
  resetNotional: () => void
  inputDisabled: boolean
  inputValidationMessage: ValidationMessage
  tradingDisabled: boolean
  chartData?: []
  rfq: RfqActions
}
