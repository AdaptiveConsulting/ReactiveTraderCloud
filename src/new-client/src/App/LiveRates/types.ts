import { Direction } from 'services/trades'
import { CurrencyPair } from 'services/currencyPairs'
export interface RfqRequest {
    notional: number
    currencyPair: CurrencyPair
}

export enum PriceMovementTypes {
    Up = 'Up',
    Down = 'Down',
    None = 'None'
}

export interface SpotPriceTick {
    ask: number
    bid: number
    mid: number
    creationTimestamp: number
    symbol: string
    valueDate: string
    priceMovementType?: PriceMovementTypes
    priceStale?: boolean
}

export interface RfqReceived extends RfqRequest {
    price: SpotPriceTick
    time: number
    timeout: number
}

export interface RfqRequote {
    notional: number
    currencyPair: CurrencyPair
}

export interface RfqReject {
    currencyPair: CurrencyPair
}

export interface RfqCancel {
    currencyPair: CurrencyPair
}

export interface RfqExpired {
    currencyPair: CurrencyPair
}

export interface RfqReset {
    currencyPair: CurrencyPair
}
  
interface WindowConfig {
    name: string
    url: string
    width: number
    height: number
    displayName?: string
    minHeight?: number
    minWidth?: number
    maxHeight?: number
    maxWidth?: number
    center?: 'parent' | 'screen'
    x?: number
    y?: number
    saveWindowState?: boolean
}

type Center = 'screen' | 'parent'

export interface ExternalWindowProps {
    title: string
    config: WindowConfig
    browserConfig: { center: Center }
}

export interface TradingMode {
    symbol: CurrencyPair['symbol']
    mode: 'esp' | 'rfq'
}

export interface RfqActions {
    request: (rfqActionObj: RfqRequest) => void
    cancel: (rfqActionObj: RfqCancel) => void
    reject: (rfqActionObj: RfqReject) => void
    requote: (rfqActionObj: RfqRequote) => void
    expired: (rfqActionObj: RfqExpired) => void
    reset: (rfqActionObj: RfqReset) => void
}


export interface CurrencyPairNotional {
    currencyPair: string
    notional: number
}

export enum ServiceConnectionStatus {
    CONNECTING = 'CONNECTING',
    CONNECTED = 'CONNECTED',
    DISCONNECTED = 'DISCONNECTED'
}

export interface ExecuteTradeRequest extends Object {
    id: string
    CurrencyPair: string
    SpotRate: number
    Direction: Direction
    Notional: number
    DealtCurrency: string
}

export type RfqState = 'none' | 'canRequest' | 'requested' | 'received' | 'expired'

export interface Trade {
    tradeId: number
    traderName: string
    symbol: string
    notional: number
    dealtCurrency: string
    termsCurrency?: string
    direction: any
    spotRate: number
    tradeDate: Date
    valueDate: Date
    status: any
    highlight?: boolean
}

export interface LastTradeExecutionStatus {
    request: ExecuteTradeRequest
    hasError: boolean
    hasWarning: boolean
    warning?: string
    error?: string
    trade?: Trade
}

export interface SpotTileData {
    isTradeExecutionInFlight: boolean
    price: SpotPriceTick
    historicPrices: SpotPriceTick[]
    lastTradeExecutionStatus: LastTradeExecutionStatus | null
    rfqState: RfqState
    rfqReceivedTime: number | null
    rfqTimeout: number | null
    rfqPrice: SpotPriceTick | null
    notional?: number
}

export interface Rate {
    bigFigure: number
    rawRate: number
    ratePrecision: number
    pipFraction: number
    pipPrecision: number
    pips: number
  }
  
export enum TileView {
    Normal = 'Normal',
    Analytics = 'Analytics',
  }
  