import * as HydraPlatform from "@adaptive/hydra-platform"
import { Observable } from "rxjs"
import { LocalDateConverter } from "@adaptive/hydra-codecs/dist/valueConverters"

export interface QuoteResponse {
  notional: number
  currencyPair: CurrencyPair
  price: PriceTick
  time: number
  timeout: number
}

export interface CurrencyPair {
  symbol: string
  ratePrecision: number
  pipsPosition: number
}

export interface QuoteRequest {
  symbol: string
  notional: number
}

export interface CurrencyPairUpdates {
  updates: Array<CurrencyPairUpdate>
  isStateOfTheWorld: boolean
  isStale: boolean
}

export const ADDED_CURRENCY_PAIR_UPDATE = "added",
  REMOVED_CURRENCY_PAIR_UPDATE = "removed"

export type AddedCurrencyPairUpdate = {
  type: typeof ADDED_CURRENCY_PAIR_UPDATE
  payload: CurrencyPair
}
export type RemovedCurrencyPairUpdate = {
  type: typeof REMOVED_CURRENCY_PAIR_UPDATE
  payload: CurrencyPair
}
export type CurrencyPairUpdate =
  | AddedCurrencyPairUpdate
  | RemovedCurrencyPairUpdate

export interface PriceTickHistory {
  prices: Array<PriceTick>
}

export interface PriceTick {
  symbol: string
  bid: number
  ask: number
  mid: number
  valueDate: LocalDate
  creationTimestamp: bigint
}

export type LocalDate = LocalDateConverter.ConvertedType

export interface PriceStreamRequest {
  symbol: string
}

export interface ExecutionResponse {
  trade: Trade
}

export interface Trade {
  tradeId: bigint
  tradeName: string
  currencyPair: string
  notional: number
  dealtCurrency: string
  direction: Direction
  spotRate: number
  status: TradeStatus
  tradeDate: LocalDate
  valueDate: LocalDate
}

export enum TradeStatus {
  Pending = "Pending",
  Done = "Done",
  Rejected = "Rejected",
}

export enum Direction {
  Buy = "Buy",
  Sell = "Sell",
}

export interface ExecuteTradeRequest {
  currencyPair: string
  spotRate: number
  valueDate: LocalDate
  direction: Direction
  notional: number
  dealtCurrency: string
}

export interface LoginRequest {
  username: string
}

export interface TradeUpdates {
  updates: Array<Trade>
  isStateOfTheWorld: boolean
  isStale: boolean
}

export interface PositionUpdates {
  currentPositions: Array<CurrencyPairPosition>
  history: Array<HistoricPosition>
}

export interface HistoricPosition {
  timestamp: string
  usdPnl: number
}

export interface CurrencyPairPosition {
  symbol: string
  basePnl: number
  baseTradedAmount: number
  counterTradedAmount: number
}

export interface AnalyticsRequest {
  currency: string
}

const converters = { LocalDateConverter }
const allocators = HydraPlatform.createOtfAllocators(converters)

function QuoteResponseTypeDefinition() {
  return {
    type: "record" as const,
    encodedLength: { bitLength: 256, byteLength: 32 },
    fields: {
      notional: {
        location: { bitOffset: 0, byteOffset: 0, mask: 0 },
        type: QuantityTypeDefinition,
      },
      currencyPair: {
        location: { bitOffset: 64, byteOffset: 8, mask: 0 },
        type: CurrencyPairRefTypeDefinition,
      },
      price: {
        location: { bitOffset: 96, byteOffset: 12, mask: 0 },
        type: PriceTickRefTypeDefinition,
      },
      time: {
        location: { bitOffset: 128, byteOffset: 16, mask: 0 },
        type: float64TypeDefinition,
      },
      timeout: {
        location: { bitOffset: 192, byteOffset: 24, mask: 0 },
        type: float64TypeDefinition,
      },
    },
    jsonConverter: undefined,
  }
}

function float64TypeDefinition() {
  return "Float64" as const
}

function PriceTickRefTypeDefinition() {
  return { type: "pointer" as const, elementType: PriceTickTypeDefinition }
}

function CurrencyPairRefTypeDefinition() {
  return { type: "pointer" as const, elementType: CurrencyPairTypeDefinition }
}

function CurrencyPairTypeDefinition() {
  return {
    type: "record" as const,
    encodedLength: { bitLength: 96, byteLength: 12 },
    fields: {
      symbol: {
        location: { bitOffset: 0, byteOffset: 0, mask: 0 },
        type: SymbolRefTypeDefinition,
      },
      ratePrecision: {
        location: { bitOffset: 32, byteOffset: 4, mask: 0 },
        type: int32TypeDefinition,
      },
      pipsPosition: {
        location: { bitOffset: 64, byteOffset: 8, mask: 0 },
        type: int32TypeDefinition,
      },
    },
    jsonConverter: undefined,
  }
}

function int32TypeDefinition() {
  return "Int32" as const
}

function SymbolRefTypeDefinition() {
  return { type: "pointer" as const, elementType: SymbolTypeDefinition }
}

function SymbolTypeDefinition() {
  return {
    type: "string" as const,
    count: {
      encodingType: "Int32" as const,
      location: { bitOffset: 0, byteOffset: 0, mask: 0 },
    },
    encoding: "Utf16" as const,
  }
}

function QuantityTypeDefinition() {
  return "Float64" as const
}

function QuoteRequestTypeDefinition() {
  return {
    type: "record" as const,
    encodedLength: { bitLength: 96, byteLength: 12 },
    fields: {
      symbol: {
        location: { bitOffset: 0, byteOffset: 0, mask: 0 },
        type: SymbolRefTypeDefinition,
      },
      notional: {
        location: { bitOffset: 32, byteOffset: 4, mask: 0 },
        type: QuantityTypeDefinition,
      },
    },
    jsonConverter: undefined,
  }
}

function CurrencyPairUpdatesTypeDefinition() {
  return {
    type: "record" as const,
    encodedLength: { bitLength: 40, byteLength: 5 },
    fields: {
      updates: {
        location: { bitOffset: 0, byteOffset: 0, mask: 0 },
        type: CurrencyPairUpdateListRefTypeDefinition,
      },
      isStateOfTheWorld: {
        location: { bitOffset: 32, byteOffset: 4, mask: 1 },
        type: boolTypeDefinition,
      },
      isStale: {
        location: { bitOffset: 33, byteOffset: 4, mask: 2 },
        type: boolTypeDefinition,
      },
    },
    jsonConverter: undefined,
  }
}

function boolTypeDefinition() {
  return "Bool" as const
}

function CurrencyPairUpdateListRefTypeDefinition() {
  return {
    type: "pointer" as const,
    elementType: CurrencyPairUpdateListTypeDefinition,
  }
}

function CurrencyPairUpdateListTypeDefinition() {
  return {
    type: "list" as const,
    count: {
      encodingType: "Int16" as const,
      location: { bitOffset: 0, byteOffset: 0, mask: 0 },
    },
    elementLength: { bitLength: 40, byteLength: 5 },
    elementType: CurrencyPairUpdateTypeDefinition,
    firstElementOffset: 2,
  }
}

function CurrencyPairUpdateTypeDefinition() {
  return {
    type: "union" as const,
    cases: {
      added: {
        tag: 1,
        payload: {
          location: { bitOffset: 8, byteOffset: 1, mask: 0 },
          type: CurrencyPairRefTypeDefinition,
        },
      },
      removed: {
        tag: 2,
        payload: {
          location: { bitOffset: 8, byteOffset: 1, mask: 0 },
          type: CurrencyPairRefTypeDefinition,
        },
      },
    },
    encodedLength: { bitLength: 40, byteLength: 5 },
  }
}

function PriceTickHistoryTypeDefinition() {
  return {
    type: "record" as const,
    encodedLength: { bitLength: 32, byteLength: 4 },
    fields: {
      prices: {
        location: { bitOffset: 0, byteOffset: 0, mask: 0 },
        type: PriceTickListRefTypeDefinition,
      },
    },
    jsonConverter: undefined,
  }
}

function PriceTickListRefTypeDefinition() {
  return { type: "pointer" as const, elementType: PriceTickListTypeDefinition }
}

function PriceTickListTypeDefinition() {
  return {
    type: "list" as const,
    count: {
      encodingType: "Int16" as const,
      location: { bitOffset: 0, byteOffset: 0, mask: 0 },
    },
    elementLength: { bitLength: 320, byteLength: 40 },
    elementType: PriceTickTypeDefinition,
    firstElementOffset: 5,
  }
}

function PriceTickTypeDefinition() {
  return {
    type: "record" as const,
    encodedLength: { bitLength: 320, byteLength: 40 },
    fields: {
      symbol: {
        location: { bitOffset: 0, byteOffset: 0, mask: 0 },
        type: SymbolRefTypeDefinition,
      },
      bid: {
        location: { bitOffset: 32, byteOffset: 4, mask: 0 },
        type: PriceTypeDefinition,
      },
      ask: {
        location: { bitOffset: 96, byteOffset: 12, mask: 0 },
        type: PriceTypeDefinition,
      },
      mid: {
        location: { bitOffset: 160, byteOffset: 20, mask: 0 },
        type: PriceTypeDefinition,
      },
      valueDate: {
        location: { bitOffset: 224, byteOffset: 28, mask: 0 },
        type: LocalDateTypeDefinition,
      },
      creationTimestamp: {
        location: { bitOffset: 256, byteOffset: 32, mask: 0 },
        type: int64TypeDefinition,
      },
    },
    jsonConverter: undefined,
  }
}

function int64TypeDefinition() {
  return "Int64" as const
}

function LocalDateTypeDefinition() {
  return {
    type: "record" as const,
    encodedLength: { bitLength: 32, byteLength: 4 },
    fields: {
      year: {
        location: { bitOffset: 0, byteOffset: 0, mask: 0 },
        type: int16TypeDefinition,
      },
      month: {
        location: { bitOffset: 16, byteOffset: 2, mask: 0 },
        type: int8TypeDefinition,
      },
      day: {
        location: { bitOffset: 24, byteOffset: 3, mask: 0 },
        type: int8TypeDefinition,
      },
    },
    jsonConverter: "LocalDateConverter" as const,
  }
}

function int8TypeDefinition() {
  return "Int8" as const
}

function int16TypeDefinition() {
  return "Int16" as const
}

function PriceTypeDefinition() {
  return "Float64" as const
}

function PriceStreamRequestTypeDefinition() {
  return {
    type: "record" as const,
    encodedLength: { bitLength: 32, byteLength: 4 },
    fields: {
      symbol: {
        location: { bitOffset: 0, byteOffset: 0, mask: 0 },
        type: SymbolRefTypeDefinition,
      },
    },
    jsonConverter: undefined,
  }
}

function ExecutionResponseTypeDefinition() {
  return {
    type: "record" as const,
    encodedLength: { bitLength: 32, byteLength: 4 },
    fields: {
      trade: {
        location: { bitOffset: 0, byteOffset: 0, mask: 0 },
        type: TradeRefTypeDefinition,
      },
    },
    jsonConverter: undefined,
  }
}

function TradeRefTypeDefinition() {
  return { type: "pointer" as const, elementType: TradeTypeDefinition }
}

function TradeTypeDefinition() {
  return {
    type: "record" as const,
    encodedLength: { bitLength: 384, byteLength: 48 },
    fields: {
      tradeId: {
        location: { bitOffset: 0, byteOffset: 0, mask: 0 },
        type: int64TypeDefinition,
      },
      tradeName: {
        location: { bitOffset: 64, byteOffset: 8, mask: 0 },
        type: stringRefTypeDefinition,
      },
      currencyPair: {
        location: { bitOffset: 96, byteOffset: 12, mask: 0 },
        type: stringRefTypeDefinition,
      },
      notional: {
        location: { bitOffset: 128, byteOffset: 16, mask: 0 },
        type: QuantityTypeDefinition,
      },
      dealtCurrency: {
        location: { bitOffset: 192, byteOffset: 24, mask: 0 },
        type: stringRefTypeDefinition,
      },
      direction: {
        location: { bitOffset: 224, byteOffset: 28, mask: 0 },
        type: DirectionTypeDefinition,
      },
      spotRate: {
        location: { bitOffset: 232, byteOffset: 29, mask: 0 },
        type: PriceTypeDefinition,
      },
      status: {
        location: { bitOffset: 296, byteOffset: 37, mask: 0 },
        type: TradeStatusTypeDefinition,
      },
      tradeDate: {
        location: { bitOffset: 320, byteOffset: 40, mask: 0 },
        type: LocalDateTypeDefinition,
      },
      valueDate: {
        location: { bitOffset: 352, byteOffset: 44, mask: 0 },
        type: LocalDateTypeDefinition,
      },
    },
    jsonConverter: undefined,
  }
}

function TradeStatusTypeDefinition() {
  return {
    type: "enum" as const,
    cases: [
      { name: "Pending" as const, value: BigInt("1") },
      { name: "Done" as const, value: BigInt("2") },
      { name: "Rejected" as const, value: BigInt("3") },
    ],
    description: "" as const,
    encoding: "Int8" as const,
  }
}

function DirectionTypeDefinition() {
  return {
    type: "enum" as const,
    cases: [
      { name: "Buy" as const, value: BigInt("1") },
      { name: "Sell" as const, value: BigInt("2") },
    ],
    description: "" as const,
    encoding: "Int8" as const,
  }
}

function stringRefTypeDefinition() {
  return { type: "pointer" as const, elementType: stringTypeDefinition }
}

function stringTypeDefinition() {
  return {
    type: "string" as const,
    count: {
      encodingType: "Int32" as const,
      location: { bitOffset: 0, byteOffset: 0, mask: 0 },
    },
    encoding: "Utf16" as const,
  }
}

function ExecuteTradeRequestTypeDefinition() {
  return {
    type: "record" as const,
    encodedLength: { bitLength: 256, byteLength: 32 },
    fields: {
      currencyPair: {
        location: { bitOffset: 0, byteOffset: 0, mask: 0 },
        type: SymbolRefTypeDefinition,
      },
      spotRate: {
        location: { bitOffset: 32, byteOffset: 4, mask: 0 },
        type: PriceTypeDefinition,
      },
      valueDate: {
        location: { bitOffset: 96, byteOffset: 12, mask: 0 },
        type: LocalDateTypeDefinition,
      },
      direction: {
        location: { bitOffset: 128, byteOffset: 16, mask: 0 },
        type: DirectionTypeDefinition,
      },
      notional: {
        location: { bitOffset: 136, byteOffset: 17, mask: 0 },
        type: QuantityTypeDefinition,
      },
      dealtCurrency: {
        location: { bitOffset: 224, byteOffset: 28, mask: 0 },
        type: CurrencyRefTypeDefinition,
      },
    },
    jsonConverter: undefined,
  }
}

function CurrencyRefTypeDefinition() {
  return { type: "pointer" as const, elementType: CurrencyTypeDefinition }
}

function CurrencyTypeDefinition() {
  return {
    type: "string" as const,
    count: {
      encodingType: "Int32" as const,
      location: { bitOffset: 0, byteOffset: 0, mask: 0 },
    },
    encoding: "Utf16" as const,
  }
}

function LoginRequestTypeDefinition() {
  return {
    type: "record" as const,
    encodedLength: { bitLength: 32, byteLength: 4 },
    fields: {
      username: {
        location: { bitOffset: 0, byteOffset: 0, mask: 0 },
        type: stringRefTypeDefinition,
      },
    },
    jsonConverter: undefined,
  }
}

function TradeUpdatesTypeDefinition() {
  return {
    type: "record" as const,
    encodedLength: { bitLength: 40, byteLength: 5 },
    fields: {
      updates: {
        location: { bitOffset: 0, byteOffset: 0, mask: 0 },
        type: TradeListRefTypeDefinition,
      },
      isStateOfTheWorld: {
        location: { bitOffset: 32, byteOffset: 4, mask: 1 },
        type: boolTypeDefinition,
      },
      isStale: {
        location: { bitOffset: 33, byteOffset: 4, mask: 2 },
        type: boolTypeDefinition,
      },
    },
    jsonConverter: undefined,
  }
}

function TradeListRefTypeDefinition() {
  return { type: "pointer" as const, elementType: TradeListTypeDefinition }
}

function TradeListTypeDefinition() {
  return {
    type: "list" as const,
    count: {
      encodingType: "Int16" as const,
      location: { bitOffset: 0, byteOffset: 0, mask: 0 },
    },
    elementLength: { bitLength: 384, byteLength: 48 },
    elementType: TradeTypeDefinition,
    firstElementOffset: 5,
  }
}

function PositionUpdatesTypeDefinition() {
  return {
    type: "record" as const,
    encodedLength: { bitLength: 64, byteLength: 8 },
    fields: {
      currentPositions: {
        location: { bitOffset: 0, byteOffset: 0, mask: 0 },
        type: CurrencyPairPositionListRefTypeDefinition,
      },
      history: {
        location: { bitOffset: 32, byteOffset: 4, mask: 0 },
        type: HistoricPositionListRefTypeDefinition,
      },
    },
    jsonConverter: undefined,
  }
}

function HistoricPositionListRefTypeDefinition() {
  return {
    type: "pointer" as const,
    elementType: HistoricPositionListTypeDefinition,
  }
}

function HistoricPositionListTypeDefinition() {
  return {
    type: "list" as const,
    count: {
      encodingType: "Int16" as const,
      location: { bitOffset: 0, byteOffset: 0, mask: 0 },
    },
    elementLength: { bitLength: 96, byteLength: 12 },
    elementType: HistoricPositionTypeDefinition,
    firstElementOffset: 5,
  }
}

function HistoricPositionTypeDefinition() {
  return {
    type: "record" as const,
    encodedLength: { bitLength: 96, byteLength: 12 },
    fields: {
      timestamp: {
        location: { bitOffset: 0, byteOffset: 0, mask: 0 },
        type: stringRefTypeDefinition,
      },
      usdPnl: {
        location: { bitOffset: 32, byteOffset: 4, mask: 0 },
        type: float64TypeDefinition,
      },
    },
    jsonConverter: undefined,
  }
}

function CurrencyPairPositionListRefTypeDefinition() {
  return {
    type: "pointer" as const,
    elementType: CurrencyPairPositionListTypeDefinition,
  }
}

function CurrencyPairPositionListTypeDefinition() {
  return {
    type: "list" as const,
    count: {
      encodingType: "Int16" as const,
      location: { bitOffset: 0, byteOffset: 0, mask: 0 },
    },
    elementLength: { bitLength: 224, byteLength: 28 },
    elementType: CurrencyPairPositionTypeDefinition,
    firstElementOffset: 5,
  }
}

function CurrencyPairPositionTypeDefinition() {
  return {
    type: "record" as const,
    encodedLength: { bitLength: 224, byteLength: 28 },
    fields: {
      symbol: {
        location: { bitOffset: 0, byteOffset: 0, mask: 0 },
        type: SymbolRefTypeDefinition,
      },
      basePnl: {
        location: { bitOffset: 32, byteOffset: 4, mask: 0 },
        type: float64TypeDefinition,
      },
      baseTradedAmount: {
        location: { bitOffset: 96, byteOffset: 12, mask: 0 },
        type: float64TypeDefinition,
      },
      counterTradedAmount: {
        location: { bitOffset: 160, byteOffset: 20, mask: 0 },
        type: float64TypeDefinition,
      },
    },
    jsonConverter: undefined,
  }
}

function AnalyticsRequestTypeDefinition() {
  return {
    type: "record" as const,
    encodedLength: { bitLength: 32, byteLength: 4 },
    fields: {
      currency: {
        location: { bitOffset: 0, byteOffset: 0, mask: 0 },
        type: CurrencyRefTypeDefinition,
      },
    },
    jsonConverter: undefined,
  }
}

export const AnalyticsService = {
  getAnalytics: (input: AnalyticsRequest): Observable<PositionUpdates> => {
    return HydraPlatform.requestStream$(
      {
        serviceName: "AnalyticsService",
        methodName: "getAnalytics",
        inboundStream: "one",
        outboundStream: "many",
        requestRouteKey: BigInt("7193047013647582464"),
        responseRouteKey: BigInt("-5366938992238658560"),
        annotations: [],
      },
      allocators.responseAllocator(PositionUpdatesTypeDefinition),
      allocators.requestAllocator(input, AnalyticsRequestTypeDefinition),
    )
  },
}
export const BlotterService = {
  getTradeStream: (): Observable<TradeUpdates> => {
    return HydraPlatform.requestStream$(
      {
        serviceName: "BlotterService",
        methodName: "getTradeStream",
        inboundStream: "empty",
        outboundStream: "many",
        requestRouteKey: BigInt("516767086541627392"),
        responseRouteKey: BigInt("-1282749241317622016"),
        annotations: [],
      },
      allocators.responseAllocator(TradeUpdatesTypeDefinition),
    )
  },
}
export const LoginService = {
  login: (input: LoginRequest): Observable<void> => {
    return HydraPlatform.requestResponse$(
      {
        serviceName: "LoginService",
        methodName: "login",
        inboundStream: "one",
        outboundStream: "empty",
        requestRouteKey: BigInt("4665269211409501952"),
        responseRouteKey: BigInt("4822501354577487872"),
        annotations: [],
      },
      undefined,
      allocators.requestAllocator(input, LoginRequestTypeDefinition),
    )
  },
}
export const ExecutionService = {
  executeTrade: (input: ExecuteTradeRequest): Observable<ExecutionResponse> => {
    return HydraPlatform.requestResponse$(
      {
        serviceName: "ExecutionService",
        methodName: "executeTrade",
        inboundStream: "one",
        outboundStream: "one",
        requestRouteKey: BigInt("1075788347945614336"),
        responseRouteKey: BigInt("619083084394464000"),
        annotations: [],
      },
      allocators.responseAllocator(ExecutionResponseTypeDefinition),
      allocators.requestAllocator(input, ExecuteTradeRequestTypeDefinition),
    )
  },
}
export const PricingService = {
  getPriceUpdates: (input: PriceStreamRequest): Observable<PriceTick> => {
    return HydraPlatform.requestStream$(
      {
        serviceName: "PricingService",
        methodName: "getPriceUpdates",
        inboundStream: "one",
        outboundStream: "many",
        requestRouteKey: BigInt("8413700287026779648"),
        responseRouteKey: BigInt("3800867469029228800"),
        annotations: [],
      },
      allocators.responseAllocator(PriceTickTypeDefinition),
      allocators.requestAllocator(input, PriceStreamRequestTypeDefinition),
    )
  },
  getPriceHistory: (
    input: PriceStreamRequest,
  ): Observable<PriceTickHistory> => {
    return HydraPlatform.requestResponse$(
      {
        serviceName: "PricingService",
        methodName: "getPriceHistory",
        inboundStream: "one",
        outboundStream: "one",
        requestRouteKey: BigInt("1528078832124954880"),
        responseRouteKey: BigInt("-4186857408412338688"),
        annotations: [],
      },
      allocators.responseAllocator(PriceTickHistoryTypeDefinition),
      allocators.requestAllocator(input, PriceStreamRequestTypeDefinition),
    )
  },
}
export const ReferenceDataService = {
  getCcyPairs: (): Observable<CurrencyPairUpdates> => {
    return HydraPlatform.requestStream$(
      {
        serviceName: "ReferenceDataService",
        methodName: "getCcyPairs",
        inboundStream: "empty",
        outboundStream: "many",
        requestRouteKey: BigInt("3148703404362059776"),
        responseRouteKey: BigInt("3559278686880111616"),
        annotations: [],
      },
      allocators.responseAllocator(CurrencyPairUpdatesTypeDefinition),
    )
  },
}
export const RfqService = {
  requestQuote: (input: QuoteRequest): Observable<QuoteResponse> => {
    return HydraPlatform.requestResponse$(
      {
        serviceName: "RfqService",
        methodName: "requestQuote",
        inboundStream: "one",
        outboundStream: "one",
        requestRouteKey: BigInt("8143068223263718656"),
        responseRouteKey: BigInt("4897793398437933312"),
        annotations: [],
      },
      allocators.responseAllocator(QuoteResponseTypeDefinition),
      allocators.requestAllocator(input, QuoteRequestTypeDefinition),
    )
  },
}
