import { CurrencyPair, Direction, ServiceConnectionStatus } from 'rt-types'
import { SpotTileDataWithNotional } from '../model'
import { ValidationMessage } from './notional'
import { RfqCancel, RfqExpired, RfqReject, RfqRequest, RfqRequote, RfqReset, } from '../model/rfqRequest'

export interface TradingMode {
  symbol: CurrencyPair['symbol']
  mode: 'esp' | 'rfq'
}

export type RfqState = 'none' | 'canRequest' | 'requested' | 'received' | 'expired'

export interface RfqActions {
  request: (rfqActionObj: RfqRequest) => void
  cancel: (rfqActionObj: RfqCancel) => void
  reject: (rfqActionObj: RfqReject) => void
  requote: (rfqActionObj: RfqRequote) => void
  expired: (rfqActionObj: RfqExpired) => void
  reset: (rfqActionObj: RfqReset) => void
}

export interface TileSwitchChildrenProps {
  notional: number
  userError: boolean
}

export interface SpotTileProps {
  currencyPair: CurrencyPair
  spotTileData: SpotTileDataWithNotional
  executionStatus: ServiceConnectionStatus
  executeTrade: (direction: Direction, rawSpotRate: number) => void
  updateNotional: (notional: number) => void
  resetNotional: () => void
  inputDisabled: boolean
  inputValidationMessage?: ValidationMessage
  tradingDisabled: boolean
  chartData?: []
  rfq: RfqActions
  displayCurrencyChart?: () => void
}
