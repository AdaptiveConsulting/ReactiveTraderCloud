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

interface _RAW_LocalDate {
  year: number
  month: number
  day: number
}

export type LocalDate = LocalDateConverter.Transform<_RAW_LocalDate>

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
  timestamp: LocalDate
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

const environment = JSON.parse(
    '{"QuoteResponse":{"type":"record","encodedLength":{"bitLength":608,"byteLength":76},"fields":{"notional":{"location":{"bitOffset":0,"byteOffset":0,"mask":0},"type":{"typeName":"Quantity"}},"currencyPair":{"location":{"bitOffset":64,"byteOffset":8,"mask":0},"type":{"typeName":"CurrencyPair"}},"price":{"location":{"bitOffset":160,"byteOffset":20,"mask":0},"type":{"typeName":"PriceTick"}},"time":{"location":{"bitOffset":480,"byteOffset":60,"mask":0},"type":{"typeName":"float64"}},"timeout":{"location":{"bitOffset":544,"byteOffset":68,"mask":0},"type":{"typeName":"float64"}}}},"float64":"Float64","CurrencyPair":{"type":"record","encodedLength":{"bitLength":96,"byteLength":12},"fields":{"symbol":{"location":{"bitOffset":0,"byteOffset":0,"mask":0},"type":{"typeName":"SymbolRef"}},"ratePrecision":{"location":{"bitOffset":32,"byteOffset":4,"mask":0},"type":{"typeName":"int32"}},"pipsPosition":{"location":{"bitOffset":64,"byteOffset":8,"mask":0},"type":{"typeName":"int32"}}}},"int32":"Int32","SymbolRef":{"type":"pointer","elementType":{"typeName":"Symbol"}},"Symbol":{"type":"string","count":{"encodingType":"Int32","location":{"bitOffset":0,"byteOffset":0,"mask":0}},"encoding":"Utf16"},"Quantity":"Float64","QuoteRequest":{"type":"record","encodedLength":{"bitLength":96,"byteLength":12},"fields":{"symbol":{"location":{"bitOffset":0,"byteOffset":0,"mask":0},"type":{"typeName":"SymbolRef_41"}},"notional":{"location":{"bitOffset":32,"byteOffset":4,"mask":0},"type":{"typeName":"Quantity"}}}},"SymbolRef_41":{"type":"pointer","elementType":{"typeName":"Symbol"}},"CurrencyPairUpdates":{"type":"record","encodedLength":{"bitLength":40,"byteLength":5},"fields":{"updates":{"location":{"bitOffset":0,"byteOffset":0,"mask":0},"type":{"typeName":"CurrencyPairUpdateListRef"}},"isStateOfTheWorld":{"location":{"bitOffset":32,"byteOffset":4,"mask":1},"type":{"typeName":"bool"}},"isStale":{"location":{"bitOffset":33,"byteOffset":4,"mask":2},"type":{"typeName":"bool"}}}},"bool":"Bool","CurrencyPairUpdateListRef":{"type":"pointer","elementType":{"typeName":"CurrencyPairUpdateList"}},"CurrencyPairUpdateList":{"type":"list","count":{"encodingType":"Int16","location":{"bitOffset":0,"byteOffset":0,"mask":0}},"elementLength":{"bitLength":40,"byteLength":5},"elementType":{"typeName":"CurrencyPairUpdate"},"firstElementOffset":2},"CurrencyPairUpdate":{"type":"union","cases":{"added":{"tag":1,"payload":{"location":{"bitOffset":8,"byteOffset":1,"mask":0},"type":{"typeName":"CurrencyPairRef"}}},"removed":{"tag":2,"payload":{"location":{"bitOffset":8,"byteOffset":1,"mask":0},"type":{"typeName":"CurrencyPairRef_9"}}}},"encodedLength":{"bitLength":40,"byteLength":5}},"CurrencyPairRef_9":{"type":"pointer","elementType":{"typeName":"CurrencyPair"}},"CurrencyPairRef":{"type":"pointer","elementType":{"typeName":"CurrencyPair"}},"PriceTickHistory":{"type":"record","encodedLength":{"bitLength":32,"byteLength":4},"fields":{"prices":{"location":{"bitOffset":0,"byteOffset":0,"mask":0},"type":{"typeName":"PriceTickListRef"}}}},"PriceTickListRef":{"type":"pointer","elementType":{"typeName":"PriceTickList"}},"PriceTickList":{"type":"list","count":{"encodingType":"Int16","location":{"bitOffset":0,"byteOffset":0,"mask":0}},"elementLength":{"bitLength":320,"byteLength":40},"elementType":{"typeName":"PriceTick"},"firstElementOffset":2},"PriceTick":{"type":"record","encodedLength":{"bitLength":320,"byteLength":40},"fields":{"symbol":{"location":{"bitOffset":0,"byteOffset":0,"mask":0},"type":{"typeName":"SymbolRef_39"}},"bid":{"location":{"bitOffset":32,"byteOffset":4,"mask":0},"type":{"typeName":"Price"}},"ask":{"location":{"bitOffset":96,"byteOffset":12,"mask":0},"type":{"typeName":"Price"}},"mid":{"location":{"bitOffset":160,"byteOffset":20,"mask":0},"type":{"typeName":"Price"}},"valueDate":{"location":{"bitOffset":224,"byteOffset":28,"mask":0},"type":{"typeName":"LocalDate"}},"creationTimestamp":{"location":{"bitOffset":256,"byteOffset":32,"mask":0},"type":{"typeName":"int64"}}}},"int64":"Int64","LocalDate":{"type":"record","encodedLength":{"bitLength":32,"byteLength":4},"fields":{"year":{"location":{"bitOffset":0,"byteOffset":0,"mask":0},"type":{"typeName":"int16"}},"month":{"location":{"bitOffset":16,"byteOffset":2,"mask":0},"type":{"typeName":"int8"}},"day":{"location":{"bitOffset":24,"byteOffset":3,"mask":0},"type":{"typeName":"int8"}}},"jsonConverter":"LocalDateConverter"},"int8":"Int8","int16":"Int16","Price":"Float64","SymbolRef_39":{"type":"pointer","elementType":{"typeName":"Symbol"}},"PriceStreamRequest":{"type":"record","encodedLength":{"bitLength":32,"byteLength":4},"fields":{"symbol":{"location":{"bitOffset":0,"byteOffset":0,"mask":0},"type":{"typeName":"SymbolRef_38"}}}},"SymbolRef_38":{"type":"pointer","elementType":{"typeName":"Symbol"}},"ExecutionResponse":{"type":"record","encodedLength":{"bitLength":384,"byteLength":48},"fields":{"trade":{"location":{"bitOffset":0,"byteOffset":0,"mask":0},"type":{"typeName":"Trade"}}}},"Trade":{"type":"record","encodedLength":{"bitLength":384,"byteLength":48},"fields":{"tradeId":{"location":{"bitOffset":0,"byteOffset":0,"mask":0},"type":{"typeName":"int64"}},"tradeName":{"location":{"bitOffset":64,"byteOffset":8,"mask":0},"type":{"typeName":"stringRef"}},"currencyPair":{"location":{"bitOffset":96,"byteOffset":12,"mask":0},"type":{"typeName":"stringRef_60"}},"notional":{"location":{"bitOffset":128,"byteOffset":16,"mask":0},"type":{"typeName":"Quantity"}},"dealtCurrency":{"location":{"bitOffset":192,"byteOffset":24,"mask":0},"type":{"typeName":"stringRef_61"}},"direction":{"location":{"bitOffset":224,"byteOffset":28,"mask":0},"type":{"typeName":"Direction"}},"spotRate":{"location":{"bitOffset":232,"byteOffset":29,"mask":0},"type":{"typeName":"Price"}},"status":{"location":{"bitOffset":296,"byteOffset":37,"mask":0},"type":{"typeName":"TradeStatus"}},"tradeDate":{"location":{"bitOffset":320,"byteOffset":40,"mask":0},"type":{"typeName":"LocalDate"}},"valueDate":{"location":{"bitOffset":352,"byteOffset":44,"mask":0},"type":{"typeName":"LocalDate"}}}},"TradeStatus":{"type":"enum","cases":[{"name":"Pending","value":"_bigint_1"},{"name":"Done","value":"_bigint_2"},{"name":"Rejected","value":"_bigint_3"}],"description":"","encoding":"Int8"},"Direction":{"type":"enum","cases":[{"name":"Buy","value":"_bigint_1"},{"name":"Sell","value":"_bigint_2"}],"description":"","encoding":"Int8"},"stringRef_61":{"type":"pointer","elementType":{"typeName":"string"}},"string":{"type":"string","count":{"encodingType":"Int32","location":{"bitOffset":0,"byteOffset":0,"mask":0}},"encoding":"Utf16"},"stringRef_60":{"type":"pointer","elementType":{"typeName":"string"}},"stringRef":{"type":"pointer","elementType":{"typeName":"string"}},"ExecuteTradeRequest":{"type":"record","encodedLength":{"bitLength":256,"byteLength":32},"fields":{"currencyPair":{"location":{"bitOffset":0,"byteOffset":0,"mask":0},"type":{"typeName":"SymbolRef_37"}},"spotRate":{"location":{"bitOffset":32,"byteOffset":4,"mask":0},"type":{"typeName":"Price"}},"valueDate":{"location":{"bitOffset":96,"byteOffset":12,"mask":0},"type":{"typeName":"LocalDate"}},"direction":{"location":{"bitOffset":128,"byteOffset":16,"mask":0},"type":{"typeName":"Direction"}},"notional":{"location":{"bitOffset":136,"byteOffset":17,"mask":0},"type":{"typeName":"Quantity"}},"dealtCurrency":{"location":{"bitOffset":224,"byteOffset":28,"mask":0},"type":{"typeName":"CurrencyRef"}}}},"CurrencyRef":{"type":"pointer","elementType":{"typeName":"Currency"}},"Currency":{"type":"string","count":{"encodingType":"Int32","location":{"bitOffset":0,"byteOffset":0,"mask":0}},"encoding":"Utf16"},"SymbolRef_37":{"type":"pointer","elementType":{"typeName":"Symbol"}},"LoginRequest":{"type":"record","encodedLength":{"bitLength":32,"byteLength":4},"fields":{"username":{"location":{"bitOffset":0,"byteOffset":0,"mask":0},"type":{"typeName":"stringRef_62"}}}},"stringRef_62":{"type":"pointer","elementType":{"typeName":"string"}},"TradeUpdates":{"type":"record","encodedLength":{"bitLength":40,"byteLength":5},"fields":{"updates":{"location":{"bitOffset":0,"byteOffset":0,"mask":0},"type":{"typeName":"TradeListRef"}},"isStateOfTheWorld":{"location":{"bitOffset":32,"byteOffset":4,"mask":1},"type":{"typeName":"bool"}},"isStale":{"location":{"bitOffset":33,"byteOffset":4,"mask":2},"type":{"typeName":"bool"}}}},"TradeListRef":{"type":"pointer","elementType":{"typeName":"TradeList"}},"TradeList":{"type":"list","count":{"encodingType":"Int16","location":{"bitOffset":0,"byteOffset":0,"mask":0}},"elementLength":{"bitLength":384,"byteLength":48},"elementType":{"typeName":"Trade"},"firstElementOffset":2},"PositionUpdates":{"type":"record","encodedLength":{"bitLength":64,"byteLength":8},"fields":{"currentPositions":{"location":{"bitOffset":0,"byteOffset":0,"mask":0},"type":{"typeName":"CurrencyPairPositionListRef"}},"history":{"location":{"bitOffset":32,"byteOffset":4,"mask":0},"type":{"typeName":"HistoricPositionListRef"}}}},"HistoricPositionListRef":{"type":"pointer","elementType":{"typeName":"HistoricPositionList"}},"HistoricPositionList":{"type":"list","count":{"encodingType":"Int16","location":{"bitOffset":0,"byteOffset":0,"mask":0}},"elementLength":{"bitLength":96,"byteLength":12},"elementType":{"typeName":"HistoricPosition"},"firstElementOffset":2},"HistoricPosition":{"type":"record","encodedLength":{"bitLength":96,"byteLength":12},"fields":{"timestamp":{"location":{"bitOffset":0,"byteOffset":0,"mask":0},"type":{"typeName":"LocalDate"}},"usdPnl":{"location":{"bitOffset":32,"byteOffset":4,"mask":0},"type":{"typeName":"float64"}}}},"CurrencyPairPositionListRef":{"type":"pointer","elementType":{"typeName":"CurrencyPairPositionList"}},"CurrencyPairPositionList":{"type":"list","count":{"encodingType":"Int16","location":{"bitOffset":0,"byteOffset":0,"mask":0}},"elementLength":{"bitLength":224,"byteLength":28},"elementType":{"typeName":"CurrencyPairPosition"},"firstElementOffset":2},"CurrencyPairPosition":{"type":"record","encodedLength":{"bitLength":224,"byteLength":28},"fields":{"symbol":{"location":{"bitOffset":0,"byteOffset":0,"mask":0},"type":{"typeName":"SymbolRef_36"}},"basePnl":{"location":{"bitOffset":32,"byteOffset":4,"mask":0},"type":{"typeName":"float64"}},"baseTradedAmount":{"location":{"bitOffset":96,"byteOffset":12,"mask":0},"type":{"typeName":"float64"}},"counterTradedAmount":{"location":{"bitOffset":160,"byteOffset":20,"mask":0},"type":{"typeName":"float64"}}}},"SymbolRef_36":{"type":"pointer","elementType":{"typeName":"Symbol"}},"AnalyticsRequest":{"type":"record","encodedLength":{"bitLength":32,"byteLength":4},"fields":{"currency":{"location":{"bitOffset":0,"byteOffset":0,"mask":0},"type":{"typeName":"CurrencyRef_14"}}}},"CurrencyRef_14":{"type":"pointer","elementType":{"typeName":"Currency"}}}',
    (key, value) =>
      typeof value === "string" && value.startsWith("_bigint_")
        ? BigInt(value.replace("_bigint_", ""))
        : value,
  ),
  converters = { LocalDateConverter }
const allocators = HydraPlatform.createOtfAllocators(environment, converters)
export const AnalyticsService = {
  getAnalytics: (input: AnalyticsRequest): Observable<PositionUpdates> => {
    return HydraPlatform.requestStream$(
      {
        serviceName: "AnalyticsService",
        methodName: "getAnalytics",
        methodSignatureHash: 1922892293,
        inboundStream: "one",
        outboundStream: "many",
        requestRouteId: -642094529,
        responseRouteId: -1285796373,
        annotations: [],
      },
      allocators.responseAllocator("PositionUpdates"),
      allocators.requestAllocator(input, "AnalyticsRequest"),
    )
  },
}
export const BlotterService = {
  getTradeStream: (): Observable<TradeUpdates> => {
    return HydraPlatform.requestStream$(
      {
        serviceName: "BlotterService",
        methodName: "getTradeStream",
        methodSignatureHash: 34777264,
        inboundStream: "empty",
        outboundStream: "many",
        requestRouteId: -1383080335,
        responseRouteId: 45070941,
        annotations: [],
      },
      allocators.responseAllocator("TradeUpdates"),
    )
  },
}
export const LoginService = {
  login: (input: LoginRequest): Observable<void> => {
    return HydraPlatform.requestResponse$(
      {
        serviceName: "LoginService",
        methodName: "login",
        methodSignatureHash: 49034275,
        inboundStream: "one",
        outboundStream: "empty",
        requestRouteId: 740260733,
        responseRouteId: 793953459,
        annotations: [],
      },
      undefined,
      allocators.requestAllocator(input, "LoginRequest"),
    )
  },
}
export const ExecutionService = {
  executeTrade: (input: ExecuteTradeRequest): Observable<ExecutionResponse> => {
    return HydraPlatform.requestResponse$(
      {
        serviceName: "ExecutionService",
        methodName: "executeTrade",
        methodSignatureHash: 211232270,
        inboundStream: "one",
        outboundStream: "one",
        requestRouteId: 535373836,
        responseRouteId: 577139768,
        annotations: [],
      },
      allocators.responseAllocator("ExecutionResponse"),
      allocators.requestAllocator(input, "ExecuteTradeRequest"),
    )
  },
}
export const PricingService = {
  getPriceUpdates: (input: PriceStreamRequest): Observable<PriceTick> => {
    return HydraPlatform.requestStream$(
      {
        serviceName: "PricingService",
        methodName: "getPriceUpdates",
        methodSignatureHash: -1075832783,
        inboundStream: "one",
        outboundStream: "many",
        requestRouteId: 1962523176,
        responseRouteId: 143171678,
        annotations: [],
      },
      allocators.responseAllocator("PriceTick"),
      allocators.requestAllocator(input, "PriceStreamRequest"),
    )
  },
  getPriceHistory: (
    input: PriceStreamRequest,
  ): Observable<PriceTickHistory> => {
    return HydraPlatform.requestResponse$(
      {
        serviceName: "PricingService",
        methodName: "getPriceHistory",
        methodSignatureHash: 25663784,
        inboundStream: "one",
        outboundStream: "one",
        requestRouteId: -1171079694,
        responseRouteId: -804373976,
        annotations: [],
      },
      allocators.responseAllocator("PriceTickHistory"),
      allocators.requestAllocator(input, "PriceStreamRequest"),
    )
  },
}
export const ReferenceDataService = {
  getCcyPairs: (): Observable<CurrencyPairUpdates> => {
    return HydraPlatform.requestStream$(
      {
        serviceName: "ReferenceDataService",
        methodName: "getCcyPairs",
        methodSignatureHash: -1619823652,
        inboundStream: "empty",
        outboundStream: "many",
        requestRouteId: 1608024822,
        responseRouteId: 905829996,
        annotations: [],
      },
      allocators.responseAllocator("CurrencyPairUpdates"),
    )
  },
}
export const RfqService = {
  requestQuote: (input: QuoteRequest): Observable<QuoteResponse> => {
    return HydraPlatform.requestResponse$(
      {
        serviceName: "RfqService",
        methodName: "requestQuote",
        methodSignatureHash: -2124174778,
        inboundStream: "one",
        outboundStream: "one",
        requestRouteId: -1705529915,
        responseRouteId: -1975840591,
        annotations: [],
      },
      allocators.responseAllocator("QuoteResponse"),
      allocators.requestAllocator(input, "QuoteRequest"),
    )
  },
}
