import { CurrencyPair, Direction, ServiceConnectionStatus } from 'rt-types'
import { SpotTileData } from '../model'
import { ValidationMessage } from './notional/NotionalInput'
import {
  RfqRequest,
  RfqCancel,
  RfqRequote,
  RfqExpired,
  RfqReject,
  RfqReset,
} from '../model/rfqRequest'
import { NotionalUpdate } from '../model/spotTileData'

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
  displayCurrencyChart?: () => void
}
