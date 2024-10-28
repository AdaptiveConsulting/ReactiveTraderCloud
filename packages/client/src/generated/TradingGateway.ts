import { LocalDateConverter } from "@adaptive/hydra-codecs/dist/valueConverters"
import {
  createGatewayConnection,
  createHydraPlatform,
  createOtfAllocators,
  HydraPlatform,
  PlatformConfig,
  VersionNegotiation,
} from "@adaptive/hydra-platform"
import { mergeMap, Observable, ReplaySubject, take } from "rxjs"

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

export type LocalDate = LocalDateConverter.ConvertedType

export enum TradeStatus {
  Pending = "Pending",
  Done = "Done",
  Rejected = "Rejected",
}

export enum Direction {
  Buy = "Buy",
  Sell = "Sell",
}

export const RFQ_CREATED_RFQ_UPDATE = "rfqCreated",
  QUOTE_CREATED_RFQ_UPDATE = "quoteCreated",
  QUOTE_QUOTED_RFQ_UPDATE = "quoteQuoted",
  QUOTE_PASSED_RFQ_UPDATE = "quotePassed",
  QUOTE_ACCEPTED_RFQ_UPDATE = "quoteAccepted",
  RFQ_CLOSED_RFQ_UPDATE = "rfqClosed",
  START_OF_STATE_OF_THE_WORLD_RFQ_UPDATE = "startOfStateOfTheWorld",
  END_OF_STATE_OF_THE_WORLD_RFQ_UPDATE = "endOfStateOfTheWorld"

export type RfqCreatedRfqUpdate = {
  type: typeof RFQ_CREATED_RFQ_UPDATE
  payload: RfqBody
}
export type QuoteCreatedRfqUpdate = {
  type: typeof QUOTE_CREATED_RFQ_UPDATE
  payload: QuoteBody
}
export type QuoteQuotedRfqUpdate = {
  type: typeof QUOTE_QUOTED_RFQ_UPDATE
  payload: QuoteBody
}
export type QuotePassedRfqUpdate = {
  type: typeof QUOTE_PASSED_RFQ_UPDATE
  payload: QuoteBody
}
export type QuoteAcceptedRfqUpdate = {
  type: typeof QUOTE_ACCEPTED_RFQ_UPDATE
  payload: QuoteBody
}
export type RfqClosedRfqUpdate = {
  type: typeof RFQ_CLOSED_RFQ_UPDATE
  payload: RfqBody
}
export type StartOfStateOfTheWorldRfqUpdate = {
  type: typeof START_OF_STATE_OF_THE_WORLD_RFQ_UPDATE
}
export type EndOfStateOfTheWorldRfqUpdate = {
  type: typeof END_OF_STATE_OF_THE_WORLD_RFQ_UPDATE
}
export type RfqUpdate =
  | RfqCreatedRfqUpdate
  | QuoteCreatedRfqUpdate
  | QuoteQuotedRfqUpdate
  | QuotePassedRfqUpdate
  | QuoteAcceptedRfqUpdate
  | RfqClosedRfqUpdate
  | StartOfStateOfTheWorldRfqUpdate
  | EndOfStateOfTheWorldRfqUpdate

export interface QuoteBody {
  id: number
  rfqId: number
  dealerId: number
  state: QuoteState
}

export const PENDING_WITHOUT_PRICE_QUOTE_STATE = "pendingWithoutPrice",
  PENDING_WITH_PRICE_QUOTE_STATE = "pendingWithPrice",
  PASSED_QUOTE_STATE = "passed",
  ACCEPTED_QUOTE_STATE = "accepted",
  REJECTED_WITH_PRICE_QUOTE_STATE = "rejectedWithPrice",
  REJECTED_WITHOUT_PRICE_QUOTE_STATE = "rejectedWithoutPrice"

export type PendingWithoutPriceQuoteState = {
  type: typeof PENDING_WITHOUT_PRICE_QUOTE_STATE
}
export type PendingWithPriceQuoteState = {
  type: typeof PENDING_WITH_PRICE_QUOTE_STATE
  payload: number
}
export type PassedQuoteState = { type: typeof PASSED_QUOTE_STATE }
export type AcceptedQuoteState = {
  type: typeof ACCEPTED_QUOTE_STATE
  payload: number
}
export type RejectedWithPriceQuoteState = {
  type: typeof REJECTED_WITH_PRICE_QUOTE_STATE
  payload: number
}
export type RejectedWithoutPriceQuoteState = {
  type: typeof REJECTED_WITHOUT_PRICE_QUOTE_STATE
}
export type QuoteState =
  | PendingWithoutPriceQuoteState
  | PendingWithPriceQuoteState
  | PassedQuoteState
  | AcceptedQuoteState
  | RejectedWithPriceQuoteState
  | RejectedWithoutPriceQuoteState

export interface RfqBody {
  id: number
  instrumentId: number
  quantity: number
  direction: Direction
  state: RfqState
  expirySecs: number
  creationTimestamp: bigint
}

export enum RfqState {
  Open = "Open",
  Expired = "Expired",
  Cancelled = "Cancelled",
  Closed = "Closed",
}

export const ACK_ACCEPT_QUOTE_RESPONSE = "ack",
  NACK_ACCEPT_QUOTE_RESPONSE = "nack"

export type AckAcceptQuoteResponse = { type: typeof ACK_ACCEPT_QUOTE_RESPONSE }
export type NackAcceptQuoteResponse = {
  type: typeof NACK_ACCEPT_QUOTE_RESPONSE
}
export type AcceptQuoteResponse =
  | AckAcceptQuoteResponse
  | NackAcceptQuoteResponse

export interface AcceptQuoteRequest {
  quoteId: number
}

export const ACK_PASS_RESPONSE = "ack",
  NACK_PASS_RESPONSE = "nack"

export type AckPassResponse = { type: typeof ACK_PASS_RESPONSE }
export type NackPassResponse = { type: typeof NACK_PASS_RESPONSE }
export type PassResponse = AckPassResponse | NackPassResponse

export interface PassRequest {
  quoteId: number
}

export const ACK_QUOTE_RESPONSE = "ack",
  NACK_QUOTE_RESPONSE = "nack"

export type AckQuoteResponse = { type: typeof ACK_QUOTE_RESPONSE }
export type NackQuoteResponse = { type: typeof NACK_QUOTE_RESPONSE }
export type QuoteResponse = AckQuoteResponse | NackQuoteResponse

export interface QuoteRequest {
  quoteId: number
  price: number
}

export interface CancelRfqRequest {
  rfqId: number
}

export const ACK_CREATE_RFQ_RESPONSE = "ack",
  NACK_CREATE_RFQ_RESPONSE = "nack"

export type AckCreateRfqResponse = {
  type: typeof ACK_CREATE_RFQ_RESPONSE
  payload: number
}
export type NackCreateRfqResponse = { type: typeof NACK_CREATE_RFQ_RESPONSE }
export type CreateRfqResponse = AckCreateRfqResponse | NackCreateRfqResponse

export interface CreateRfqRequest {
  instrumentId: number
  dealerIds: Array<number>
  quantity: number
  direction: Direction
  expirySecs: number
}

export const ADDED_DEALER_UPDATE = "added",
  REMOVED_DEALER_UPDATE = "removed",
  START_OF_STATE_OF_THE_WORLD_DEALER_UPDATE = "startOfStateOfTheWorld",
  END_OF_STATE_OF_THE_WORLD_DEALER_UPDATE = "endOfStateOfTheWorld"

export type AddedDealerUpdate = {
  type: typeof ADDED_DEALER_UPDATE
  payload: DealerBody
}
export type RemovedDealerUpdate = {
  type: typeof REMOVED_DEALER_UPDATE
  payload: number
}
export type StartOfStateOfTheWorldDealerUpdate = {
  type: typeof START_OF_STATE_OF_THE_WORLD_DEALER_UPDATE
}
export type EndOfStateOfTheWorldDealerUpdate = {
  type: typeof END_OF_STATE_OF_THE_WORLD_DEALER_UPDATE
}
export type DealerUpdate =
  | AddedDealerUpdate
  | RemovedDealerUpdate
  | StartOfStateOfTheWorldDealerUpdate
  | EndOfStateOfTheWorldDealerUpdate

export interface DealerBody {
  id: number
  name: string
}

export const ADDED_INSTRUMENT_UPDATE = "added",
  REMOVED_INSTRUMENT_UPDATE = "removed",
  START_OF_STATE_OF_THE_WORLD_INSTRUMENT_UPDATE = "startOfStateOfTheWorld",
  END_OF_STATE_OF_THE_WORLD_INSTRUMENT_UPDATE = "endOfStateOfTheWorld"

export type AddedInstrumentUpdate = {
  type: typeof ADDED_INSTRUMENT_UPDATE
  payload: InstrumentBody
}
export type RemovedInstrumentUpdate = {
  type: typeof REMOVED_INSTRUMENT_UPDATE
  payload: number
}
export type StartOfStateOfTheWorldInstrumentUpdate = {
  type: typeof START_OF_STATE_OF_THE_WORLD_INSTRUMENT_UPDATE
}
export type EndOfStateOfTheWorldInstrumentUpdate = {
  type: typeof END_OF_STATE_OF_THE_WORLD_INSTRUMENT_UPDATE
}
export type InstrumentUpdate =
  | AddedInstrumentUpdate
  | RemovedInstrumentUpdate
  | StartOfStateOfTheWorldInstrumentUpdate
  | EndOfStateOfTheWorldInstrumentUpdate

export interface InstrumentBody {
  id: number
  name: string
  cusip: string
  ticker: string
  maturity: LocalDate
  interestRate: number
  benchmark: string
}

export interface EchoResponse {
  payload: number
}

export interface EchoRequest {
  payload: number
}

export interface SetThroughputRequest {
  targetUpdatesPerSecond: number
}

export interface GetThroughputResponse {
  updatesPerSecond: number
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

export interface CurrencyPair {
  symbol: string
  ratePrecision: number
  pipsPosition: number
}

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

export interface PriceStreamRequest {
  symbol: string
}

export interface ExecutionResponse {
  trade: Trade
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
const allocators = createOtfAllocators(converters)

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
    unknownCaseValue: undefined,
  }
}

function PriceTypeDefinition() {
  return "Float64" as const
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
    unknownCaseValue: undefined,
  }
}

function QuantityTypeDefinition() {
  return "Float64" as const
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
    maxCount: undefined,
  }
}

function int64TypeDefinition() {
  return "Int64" as const
}

function RfqUpdateTypeDefinition() {
  return {
    type: "union" as const,
    cases: {
      rfqCreated: {
        tag: 1,
        payload: {
          location: { bitOffset: 8, byteOffset: 1, mask: 0 },
          type: RfqBodyRefTypeDefinition,
        },
      },
      quoteCreated: {
        tag: 2,
        payload: {
          location: { bitOffset: 8, byteOffset: 1, mask: 0 },
          type: QuoteBodyRefTypeDefinition,
        },
      },
      quoteQuoted: {
        tag: 3,
        payload: {
          location: { bitOffset: 8, byteOffset: 1, mask: 0 },
          type: QuoteBodyRefTypeDefinition,
        },
      },
      quotePassed: {
        tag: 4,
        payload: {
          location: { bitOffset: 8, byteOffset: 1, mask: 0 },
          type: QuoteBodyRefTypeDefinition,
        },
      },
      quoteAccepted: {
        tag: 5,
        payload: {
          location: { bitOffset: 8, byteOffset: 1, mask: 0 },
          type: QuoteBodyRefTypeDefinition,
        },
      },
      rfqClosed: {
        tag: 6,
        payload: {
          location: { bitOffset: 8, byteOffset: 1, mask: 0 },
          type: RfqBodyRefTypeDefinition,
        },
      },
      startOfStateOfTheWorld: { tag: 7, payload: undefined },
      endOfStateOfTheWorld: { tag: 8, payload: undefined },
    },
    encodedLength: { bitLength: 40, byteLength: 5 },
    isGrowable: false,
  }
}

function QuoteBodyRefTypeDefinition() {
  return { type: "pointer" as const, elementType: QuoteBodyTypeDefinition }
}

function QuoteBodyTypeDefinition() {
  return {
    type: "record" as const,
    encodedLength: { bitLength: 128, byteLength: 16 },
    fields: {
      id: {
        location: { bitOffset: 0, byteOffset: 0, mask: 0 },
        type: QuoteIdTypeDefinition,
      },
      rfqId: {
        location: { bitOffset: 32, byteOffset: 4, mask: 0 },
        type: RfqIdTypeDefinition,
      },
      dealerId: {
        location: { bitOffset: 64, byteOffset: 8, mask: 0 },
        type: DealerIdTypeDefinition,
      },
      state: {
        location: { bitOffset: 96, byteOffset: 12, mask: 0 },
        type: QuoteStateRefTypeDefinition,
      },
    },
    jsonConverter: undefined,
  }
}

function QuoteStateRefTypeDefinition() {
  return { type: "pointer" as const, elementType: QuoteStateTypeDefinition }
}

function QuoteStateTypeDefinition() {
  return {
    type: "union" as const,
    cases: {
      pendingWithoutPrice: { tag: 1, payload: undefined },
      pendingWithPrice: {
        tag: 2,
        payload: {
          location: { bitOffset: 8, byteOffset: 1, mask: 0 },
          type: PriceTypeDefinition,
        },
      },
      passed: { tag: 3, payload: undefined },
      accepted: {
        tag: 4,
        payload: {
          location: { bitOffset: 8, byteOffset: 1, mask: 0 },
          type: PriceTypeDefinition,
        },
      },
      rejectedWithPrice: {
        tag: 5,
        payload: {
          location: { bitOffset: 8, byteOffset: 1, mask: 0 },
          type: PriceTypeDefinition,
        },
      },
      rejectedWithoutPrice: { tag: 6, payload: undefined },
    },
    encodedLength: { bitLength: 72, byteLength: 9 },
    isGrowable: false,
  }
}

function DealerIdTypeDefinition() {
  return "Int32" as const
}

function RfqIdTypeDefinition() {
  return "Int32" as const
}

function QuoteIdTypeDefinition() {
  return "Int32" as const
}

function RfqBodyRefTypeDefinition() {
  return { type: "pointer" as const, elementType: RfqBodyTypeDefinition }
}

function RfqBodyTypeDefinition() {
  return {
    type: "record" as const,
    encodedLength: { bitLength: 256, byteLength: 32 },
    fields: {
      id: {
        location: { bitOffset: 0, byteOffset: 0, mask: 0 },
        type: RfqIdTypeDefinition,
      },
      instrumentId: {
        location: { bitOffset: 32, byteOffset: 4, mask: 0 },
        type: InstrumentIdTypeDefinition,
      },
      quantity: {
        location: { bitOffset: 64, byteOffset: 8, mask: 0 },
        type: QuantityTypeDefinition,
      },
      direction: {
        location: { bitOffset: 128, byteOffset: 16, mask: 0 },
        type: DirectionTypeDefinition,
      },
      state: {
        location: { bitOffset: 136, byteOffset: 17, mask: 0 },
        type: RfqStateTypeDefinition,
      },
      expirySecs: {
        location: { bitOffset: 160, byteOffset: 20, mask: 0 },
        type: int32TypeDefinition,
      },
      creationTimestamp: {
        location: { bitOffset: 192, byteOffset: 24, mask: 0 },
        type: int64_133TypeDefinition,
      },
    },
    jsonConverter: undefined,
  }
}

function int64_133TypeDefinition() {
  return "Int64" as const
}

function int32TypeDefinition() {
  return "Int32" as const
}

function RfqStateTypeDefinition() {
  return {
    type: "enum" as const,
    cases: [
      { name: "Open" as const, value: BigInt("1") },
      { name: "Expired" as const, value: BigInt("2") },
      { name: "Cancelled" as const, value: BigInt("3") },
      { name: "Closed" as const, value: BigInt("4") },
    ],
    description: "" as const,
    encoding: "Int8" as const,
    unknownCaseValue: undefined,
  }
}

function InstrumentIdTypeDefinition() {
  return "Int32" as const
}

function AcceptQuoteResponseTypeDefinition() {
  return {
    type: "union" as const,
    cases: {
      ack: { tag: 1, payload: undefined },
      nack: { tag: 2, payload: undefined },
    },
    encodedLength: { bitLength: 8, byteLength: 1 },
    isGrowable: false,
  }
}

function AcceptQuoteRequestTypeDefinition() {
  return {
    type: "record" as const,
    encodedLength: { bitLength: 32, byteLength: 4 },
    fields: {
      quoteId: {
        location: { bitOffset: 0, byteOffset: 0, mask: 0 },
        type: QuoteIdTypeDefinition,
      },
    },
    jsonConverter: undefined,
  }
}

function PassResponseTypeDefinition() {
  return {
    type: "union" as const,
    cases: {
      ack: { tag: 1, payload: undefined },
      nack: { tag: 2, payload: undefined },
    },
    encodedLength: { bitLength: 8, byteLength: 1 },
    isGrowable: false,
  }
}

function PassRequestTypeDefinition() {
  return {
    type: "record" as const,
    encodedLength: { bitLength: 32, byteLength: 4 },
    fields: {
      quoteId: {
        location: { bitOffset: 0, byteOffset: 0, mask: 0 },
        type: QuoteIdTypeDefinition,
      },
    },
    jsonConverter: undefined,
  }
}

function QuoteResponseTypeDefinition() {
  return {
    type: "union" as const,
    cases: {
      ack: { tag: 1, payload: undefined },
      nack: { tag: 2, payload: undefined },
    },
    encodedLength: { bitLength: 8, byteLength: 1 },
    isGrowable: false,
  }
}

function QuoteRequestTypeDefinition() {
  return {
    type: "record" as const,
    encodedLength: { bitLength: 96, byteLength: 12 },
    fields: {
      quoteId: {
        location: { bitOffset: 0, byteOffset: 0, mask: 0 },
        type: QuoteIdTypeDefinition,
      },
      price: {
        location: { bitOffset: 32, byteOffset: 4, mask: 0 },
        type: PriceTypeDefinition,
      },
    },
    jsonConverter: undefined,
  }
}

function CancelRfqRequestTypeDefinition() {
  return {
    type: "record" as const,
    encodedLength: { bitLength: 32, byteLength: 4 },
    fields: {
      rfqId: {
        location: { bitOffset: 0, byteOffset: 0, mask: 0 },
        type: RfqIdTypeDefinition,
      },
    },
    jsonConverter: undefined,
  }
}

function CreateRfqResponseTypeDefinition() {
  return {
    type: "union" as const,
    cases: {
      ack: {
        tag: 1,
        payload: {
          location: { bitOffset: 8, byteOffset: 1, mask: 0 },
          type: RfqIdTypeDefinition,
        },
      },
      nack: { tag: 2, payload: undefined },
    },
    encodedLength: { bitLength: 40, byteLength: 5 },
    isGrowable: false,
  }
}

function CreateRfqRequestTypeDefinition() {
  return {
    type: "record" as const,
    encodedLength: { bitLength: 192, byteLength: 24 },
    fields: {
      instrumentId: {
        location: { bitOffset: 0, byteOffset: 0, mask: 0 },
        type: InstrumentIdTypeDefinition,
      },
      dealerIds: {
        location: { bitOffset: 32, byteOffset: 4, mask: 0 },
        type: DealerIdListRefTypeDefinition,
      },
      quantity: {
        location: { bitOffset: 64, byteOffset: 8, mask: 0 },
        type: QuantityTypeDefinition,
      },
      direction: {
        location: { bitOffset: 128, byteOffset: 16, mask: 0 },
        type: DirectionTypeDefinition,
      },
      expirySecs: {
        location: { bitOffset: 160, byteOffset: 20, mask: 0 },
        type: int32TypeDefinition,
      },
    },
    jsonConverter: undefined,
  }
}

function DealerIdListRefTypeDefinition() {
  return { type: "pointer" as const, elementType: DealerIdListTypeDefinition }
}

function DealerIdListTypeDefinition() {
  return {
    type: "list" as const,
    count: {
      encodingType: "Int16" as const,
      location: { bitOffset: 0, byteOffset: 0, mask: 0 },
    },
    elementLength: { bitLength: 32, byteLength: 4 },
    elementType: DealerIdTypeDefinition,
    lengthEncoding: undefined,
    firstElementOffset: 2,
    maxCount: undefined,
  }
}

function DealerUpdateTypeDefinition() {
  return {
    type: "union" as const,
    cases: {
      added: {
        tag: 1,
        payload: {
          location: { bitOffset: 8, byteOffset: 1, mask: 0 },
          type: DealerBodyRefTypeDefinition,
        },
      },
      removed: {
        tag: 2,
        payload: {
          location: { bitOffset: 8, byteOffset: 1, mask: 0 },
          type: DealerIdTypeDefinition,
        },
      },
      startOfStateOfTheWorld: { tag: 3, payload: undefined },
      endOfStateOfTheWorld: { tag: 4, payload: undefined },
    },
    encodedLength: { bitLength: 40, byteLength: 5 },
    isGrowable: false,
  }
}

function DealerBodyRefTypeDefinition() {
  return { type: "pointer" as const, elementType: DealerBodyTypeDefinition }
}

function DealerBodyTypeDefinition() {
  return {
    type: "record" as const,
    encodedLength: { bitLength: 64, byteLength: 8 },
    fields: {
      id: {
        location: { bitOffset: 0, byteOffset: 0, mask: 0 },
        type: DealerIdTypeDefinition,
      },
      name: {
        location: { bitOffset: 32, byteOffset: 4, mask: 0 },
        type: stringRef_140TypeDefinition,
      },
    },
    jsonConverter: undefined,
  }
}

function stringRef_140TypeDefinition() {
  return { type: "pointer" as const, elementType: string_135TypeDefinition }
}

function string_135TypeDefinition() {
  return {
    type: "string" as const,
    count: {
      encodingType: "Int32" as const,
      location: { bitOffset: 0, byteOffset: 0, mask: 0 },
    },
    encoding: "Utf16" as const,
    maxCount: undefined,
  }
}

function InstrumentUpdateTypeDefinition() {
  return {
    type: "union" as const,
    cases: {
      added: {
        tag: 1,
        payload: {
          location: { bitOffset: 8, byteOffset: 1, mask: 0 },
          type: InstrumentBodyRefTypeDefinition,
        },
      },
      removed: {
        tag: 2,
        payload: {
          location: { bitOffset: 8, byteOffset: 1, mask: 0 },
          type: InstrumentIdTypeDefinition,
        },
      },
      startOfStateOfTheWorld: { tag: 3, payload: undefined },
      endOfStateOfTheWorld: { tag: 4, payload: undefined },
    },
    encodedLength: { bitLength: 40, byteLength: 5 },
    isGrowable: false,
  }
}

function InstrumentBodyRefTypeDefinition() {
  return { type: "pointer" as const, elementType: InstrumentBodyTypeDefinition }
}

function InstrumentBodyTypeDefinition() {
  return {
    type: "record" as const,
    encodedLength: { bitLength: 256, byteLength: 32 },
    fields: {
      id: {
        location: { bitOffset: 0, byteOffset: 0, mask: 0 },
        type: InstrumentIdTypeDefinition,
      },
      name: {
        location: { bitOffset: 32, byteOffset: 4, mask: 0 },
        type: stringRef_140TypeDefinition,
      },
      cusip: {
        location: { bitOffset: 64, byteOffset: 8, mask: 0 },
        type: stringRef_140TypeDefinition,
      },
      ticker: {
        location: { bitOffset: 96, byteOffset: 12, mask: 0 },
        type: stringRef_140TypeDefinition,
      },
      maturity: {
        location: { bitOffset: 128, byteOffset: 16, mask: 0 },
        type: LocalDateTypeDefinition,
      },
      interestRate: {
        location: { bitOffset: 160, byteOffset: 20, mask: 0 },
        type: float64TypeDefinition,
      },
      benchmark: {
        location: { bitOffset: 224, byteOffset: 28, mask: 0 },
        type: stringRef_140TypeDefinition,
      },
    },
    jsonConverter: undefined,
  }
}

function float64TypeDefinition() {
  return "Float64" as const
}

function EchoResponseTypeDefinition() {
  return {
    type: "record" as const,
    encodedLength: { bitLength: 32, byteLength: 4 },
    fields: {
      payload: {
        location: { bitOffset: 0, byteOffset: 0, mask: 0 },
        type: int32TypeDefinition,
      },
    },
    jsonConverter: undefined,
  }
}

function EchoRequestTypeDefinition() {
  return {
    type: "record" as const,
    encodedLength: { bitLength: 32, byteLength: 4 },
    fields: {
      payload: {
        location: { bitOffset: 0, byteOffset: 0, mask: 0 },
        type: int32TypeDefinition,
      },
    },
    jsonConverter: undefined,
  }
}

function SetThroughputRequestTypeDefinition() {
  return {
    type: "record" as const,
    encodedLength: { bitLength: 32, byteLength: 4 },
    fields: {
      targetUpdatesPerSecond: {
        location: { bitOffset: 0, byteOffset: 0, mask: 0 },
        type: int32TypeDefinition,
      },
    },
    jsonConverter: undefined,
  }
}

function GetThroughputResponseTypeDefinition() {
  return {
    type: "record" as const,
    encodedLength: { bitLength: 32, byteLength: 4 },
    fields: {
      updatesPerSecond: {
        location: { bitOffset: 0, byteOffset: 0, mask: 0 },
        type: int32TypeDefinition,
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
    lengthEncoding: {
      encodingType: "UInt24" as const,
      location: { bitOffset: 16, byteOffset: 2, mask: 0 },
    },
    firstElementOffset: 5,
    maxCount: undefined,
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
    isGrowable: false,
  }
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
        type: int32_128TypeDefinition,
      },
      pipsPosition: {
        location: { bitOffset: 64, byteOffset: 8, mask: 0 },
        type: int32_128TypeDefinition,
      },
    },
    jsonConverter: undefined,
  }
}

function int32_128TypeDefinition() {
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
    maxCount: undefined,
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
    lengthEncoding: {
      encodingType: "UInt24" as const,
      location: { bitOffset: 16, byteOffset: 2, mask: 0 },
    },
    firstElementOffset: 5,
    maxCount: undefined,
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

function PriceStreamRequestTypeDefinition() {
  return {
    type: "record" as const,
    encodedLength: { bitLength: 32, byteLength: 4 },
    fields: {
      symbol: {
        location: { bitOffset: 0, byteOffset: 0, mask: 0 },
        type: SymbolRef_ComWeareadaptiveRtCommonTypeDefinition,
      },
    },
    jsonConverter: undefined,
  }
}

function SymbolRef_ComWeareadaptiveRtCommonTypeDefinition() {
  return { type: "pointer" as const, elementType: SymbolTypeDefinition }
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

function ExecuteTradeRequestTypeDefinition() {
  return {
    type: "record" as const,
    encodedLength: { bitLength: 256, byteLength: 32 },
    fields: {
      currencyPair: {
        location: { bitOffset: 0, byteOffset: 0, mask: 0 },
        type: SymbolRef_ComWeareadaptiveRtCommonTypeDefinition,
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
    maxCount: undefined,
  }
}

function LoginRequestTypeDefinition() {
  return {
    type: "record" as const,
    encodedLength: { bitLength: 32, byteLength: 4 },
    fields: {
      username: {
        location: { bitOffset: 0, byteOffset: 0, mask: 0 },
        type: stringRef_140TypeDefinition,
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
    lengthEncoding: {
      encodingType: "UInt24" as const,
      location: { bitOffset: 16, byteOffset: 2, mask: 0 },
    },
    firstElementOffset: 5,
    maxCount: undefined,
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
    lengthEncoding: {
      encodingType: "UInt24" as const,
      location: { bitOffset: 16, byteOffset: 2, mask: 0 },
    },
    firstElementOffset: 5,
    maxCount: undefined,
  }
}

function HistoricPositionTypeDefinition() {
  return {
    type: "record" as const,
    encodedLength: { bitLength: 96, byteLength: 12 },
    fields: {
      timestamp: {
        location: { bitOffset: 0, byteOffset: 0, mask: 0 },
        type: stringRef_140TypeDefinition,
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
    lengthEncoding: {
      encodingType: "UInt24" as const,
      location: { bitOffset: 16, byteOffset: 2, mask: 0 },
    },
    firstElementOffset: 5,
    maxCount: undefined,
  }
}

function CurrencyPairPositionTypeDefinition() {
  return {
    type: "record" as const,
    encodedLength: { bitLength: 224, byteLength: 28 },
    fields: {
      symbol: {
        location: { bitOffset: 0, byteOffset: 0, mask: 0 },
        type: SymbolRef_ComWeareadaptiveRtCommonTypeDefinition,
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

export interface IAnalyticsService {
  getAnalytics(input: AnalyticsRequest): Observable<PositionUpdates>
}

export interface IBlotterService {
  getTradeStream(): Observable<TradeUpdates>
}

export interface ILoginService {
  login(input: LoginRequest): Observable<void>
}

export interface IExecutionService {
  executeTrade(input: ExecuteTradeRequest): Observable<ExecutionResponse>
}

export interface IPricingService {
  getPriceUpdates(input: PriceStreamRequest): Observable<PriceTick>
  getPriceHistory(input: PriceStreamRequest): Observable<PriceTickHistory>
}

export interface IReferenceDataService {
  getCcyPairs(): Observable<CurrencyPairUpdates>
}

export interface IThroughputAdminService {
  getThroughput(): Observable<GetThroughputResponse>
  setThroughput(input: SetThroughputRequest): Observable<void>
}

export interface IEchoService {
  echo(input: EchoRequest): Observable<EchoResponse>
}

export interface IInstrumentService {
  subscribe(): Observable<InstrumentUpdate>
}

export interface IDealerService {
  subscribe(): Observable<DealerUpdate>
}

export interface IWorkflowService {
  createRfq(input: CreateRfqRequest): Observable<CreateRfqResponse>
  cancelRfq(input: CancelRfqRequest): Observable<void>
  quote(input: QuoteRequest): Observable<QuoteResponse>
  pass(input: PassRequest): Observable<PassResponse>
  accept(input: AcceptQuoteRequest): Observable<AcceptQuoteResponse>
  subscribe(): Observable<RfqUpdate>
}

export interface ITradeService {
  trades(): Observable<Trade>
  getTrades(): Observable<Trade>
}

export class AnalyticsService implements IAnalyticsService {
  getAnalytics: (input: AnalyticsRequest) => Observable<PositionUpdates> = (
    input,
  ) => {
    return this.hydraPlatform.requestStream$(
      {
        serviceName: "AnalyticsService",
        serviceVersion: "ZPWRZEYxeuriphf5mM3F-3ajfVE=",
        majorVersionContentAddress:
          "0xe62e7df2d92678862813a264ddc89f1027ee5a31",
        methodName: "getAnalytics",
        inboundStream: "one",
        outboundStream: "many",
        routingData: {
          request: {
            NEXT: BigInt("398568636411697713"),
            COMPLETED: BigInt("542683824487553585"),
            ERROR: BigInt("110338260259985969"),
            CANCEL: BigInt("254453448335841841"),
          },
          response: {
            NEXT: BigInt("290482514890006657"),
            COMPLETED: BigInt("434597702965862529"),
            ERROR: BigInt("2252138738294913"),
            CANCEL: BigInt("146367326814150785"),
          },
        },
        annotations: [],
      },
      allocators.responseAllocator(PositionUpdatesTypeDefinition),
      allocators.requestAllocator(input, AnalyticsRequestTypeDefinition),
    )
  }

  constructor(private hydraPlatform: HydraPlatform) {}

  static getAnalytics(input: AnalyticsRequest): Observable<PositionUpdates> {
    return gatewayServices.pipe(
      take(1),
      mergeMap((services) => services.analyticsService.getAnalytics(input)),
    )
  }
}

export class BlotterService implements IBlotterService {
  getTradeStream: () => Observable<TradeUpdates> = () => {
    return this.hydraPlatform.requestStream$(
      {
        serviceName: "BlotterService",
        serviceVersion: "71ZHSzqYkzeAMY8FHL-e1ZjDX9M=",
        majorVersionContentAddress:
          "0x4f8899fe381a704fbaed510e1751f1b86d0c8c90",
        methodName: "getTradeStream",
        inboundStream: "empty",
        outboundStream: "many",
        routingData: {
          request: {
            NEXT: BigInt("324259965274197136"),
            COMPLETED: BigInt("468375153350053008"),
            ERROR: BigInt("36029589122485392"),
            CANCEL: BigInt("180144777198341264"),
          },
          response: {
            NEXT: BigInt("333266776337026836"),
            COMPLETED: BigInt("477381964412882708"),
            ERROR: BigInt("45036400185315092"),
            CANCEL: BigInt("189151588261170964"),
          },
        },
        annotations: [],
      },
      allocators.responseAllocator(TradeUpdatesTypeDefinition),
    )
  }

  constructor(private hydraPlatform: HydraPlatform) {}

  static getTradeStream(): Observable<TradeUpdates> {
    return gatewayServices.pipe(
      take(1),
      mergeMap((services) => services.blotterService.getTradeStream()),
    )
  }
}

export class LoginService implements ILoginService {
  login: (input: LoginRequest) => Observable<void> = (input) => {
    return this.hydraPlatform.requestResponse$(
      {
        serviceName: "LoginService",
        serviceVersion: "HobGg0oQiuBiKlSYrrxJ0N6uWJ8=",
        majorVersionContentAddress:
          "0xd1acbdbcec85d9cbf2f7c6214fbfdba07f2270d5",
        methodName: "login",
        inboundStream: "one",
        outboundStream: "empty",
        routingData: {
          request: {
            NEXT: BigInt("335518861566832853"),
            COMPLETED: BigInt("479634049642688725"),
            ERROR: BigInt("47288485415121109"),
            CANCEL: BigInt("191403673490976981"),
          },
          response: {
            NEXT: BigInt("382806543175277546"),
            COMPLETED: BigInt("526921731251133418"),
            ERROR: BigInt("94576167023565802"),
            CANCEL: BigInt("238691355099421674"),
          },
        },
        annotations: [],
      },
      undefined,
      allocators.requestAllocator(input, LoginRequestTypeDefinition),
    )
  }

  constructor(private hydraPlatform: HydraPlatform) {}

  static login(input: LoginRequest): Observable<void> {
    return gatewayServices.pipe(
      take(1),
      mergeMap((services) => services.loginService.login(input)),
    )
  }
}

export class ExecutionService implements IExecutionService {
  executeTrade: (input: ExecuteTradeRequest) => Observable<ExecutionResponse> =
    (input) => {
      return this.hydraPlatform.requestResponse$(
        {
          serviceName: "ExecutionService",
          serviceVersion: "u9AuEKVxDfRiwjRAJX0iJJ9v5cw=",
          majorVersionContentAddress:
            "0xcff73f76c021c915bfe397253bda70b7bb287597",
          methodName: "executeTrade",
          inboundStream: "one",
          outboundStream: "one",
          routingData: {
            request: {
              NEXT: BigInt("340022560985478551"),
              COMPLETED: BigInt("484137749061334423"),
              ERROR: BigInt("51792184833766807"),
              CANCEL: BigInt("195907372909622679"),
            },
            response: {
              NEXT: BigInt("405324425429920820"),
              COMPLETED: BigInt("549439613505776692"),
              ERROR: BigInt("117094049278209076"),
              CANCEL: BigInt("261209237354064948"),
            },
          },
          annotations: [],
        },
        allocators.responseAllocator(ExecutionResponseTypeDefinition),
        allocators.requestAllocator(input, ExecuteTradeRequestTypeDefinition),
      )
    }

  constructor(private hydraPlatform: HydraPlatform) {}

  static executeTrade(
    input: ExecuteTradeRequest,
  ): Observable<ExecutionResponse> {
    return gatewayServices.pipe(
      take(1),
      mergeMap((services) => services.executionService.executeTrade(input)),
    )
  }
}

export class PricingService implements IPricingService {
  getPriceUpdates: (input: PriceStreamRequest) => Observable<PriceTick> = (
    input,
  ) => {
    return this.hydraPlatform.requestStream$(
      {
        serviceName: "PricingService",
        serviceVersion: "lMGjEAXz4GnWgyQK2jJTCMe1h68=",
        majorVersionContentAddress:
          "0xd47e9b02537be1029246d28fad3846ab88f26ebe",
        methodName: "getPriceUpdates",
        inboundStream: "one",
        outboundStream: "many",
        routingData: {
          request: {
            NEXT: BigInt("427842701337194174"),
            COMPLETED: BigInt("571957889413050046"),
            ERROR: BigInt("139612325185482430"),
            CANCEL: BigInt("283727513261338302"),
          },
          response: {
            NEXT: BigInt("342274080496420888"),
            COMPLETED: BigInt("486389268572276760"),
            ERROR: BigInt("54043704344709144"),
            CANCEL: BigInt("198158892420565016"),
          },
        },
        annotations: [],
      },
      allocators.responseAllocator(PriceTickTypeDefinition),
      allocators.requestAllocator(input, PriceStreamRequestTypeDefinition),
    )
  }
  getPriceHistory: (input: PriceStreamRequest) => Observable<PriceTickHistory> =
    (input) => {
      return this.hydraPlatform.requestResponse$(
        {
          serviceName: "PricingService",
          serviceVersion: "lMGjEAXz4GnWgyQK2jJTCMe1h68=",
          majorVersionContentAddress:
            "0xa1ed267eed573cf8a11410c6420e05a2db1cc99c",
          methodName: "getPriceHistory",
          inboundStream: "one",
          outboundStream: "one",
          routingData: {
            request: {
              NEXT: BigInt("351281470395697564"),
              COMPLETED: BigInt("495396658471553436"),
              ERROR: BigInt("63051094243985820"),
              CANCEL: BigInt("207166282319841692"),
            },
            response: {
              NEXT: BigInt("310748720041365834"),
              COMPLETED: BigInt("454863908117221706"),
              ERROR: BigInt("22518343889654090"),
              CANCEL: BigInt("166633531965509962"),
            },
          },
          annotations: [],
        },
        allocators.responseAllocator(PriceTickHistoryTypeDefinition),
        allocators.requestAllocator(input, PriceStreamRequestTypeDefinition),
      )
    }

  constructor(private hydraPlatform: HydraPlatform) {}

  static getPriceUpdates(input: PriceStreamRequest): Observable<PriceTick> {
    return gatewayServices.pipe(
      take(1),
      mergeMap((services) => services.pricingService.getPriceUpdates(input)),
    )
  }

  static getPriceHistory(
    input: PriceStreamRequest,
  ): Observable<PriceTickHistory> {
    return gatewayServices.pipe(
      take(1),
      mergeMap((services) => services.pricingService.getPriceHistory(input)),
    )
  }
}

export class ReferenceDataService implements IReferenceDataService {
  getCcyPairs: () => Observable<CurrencyPairUpdates> = () => {
    return this.hydraPlatform.requestStream$(
      {
        serviceName: "ReferenceDataService",
        serviceVersion: "OqWWP0EWma-LLq1gVKo89v7EEDU=",
        majorVersionContentAddress:
          "0xe61a79918fd439042742d78a7b67ccce35e745c6",
        methodName: "getCcyPairs",
        inboundStream: "empty",
        outboundStream: "many",
        routingData: {
          request: {
            NEXT: BigInt("301742060701435334"),
            COMPLETED: BigInt("445857248777291206"),
            ERROR: BigInt("13511684549723590"),
            CANCEL: BigInt("157626872625579462"),
          },
          response: {
            NEXT: BigInt("425590888427486909"),
            COMPLETED: BigInt("569706076503342781"),
            ERROR: BigInt("137360512275775165"),
            CANCEL: BigInt("281475700351631037"),
          },
        },
        annotations: [],
      },
      allocators.responseAllocator(CurrencyPairUpdatesTypeDefinition),
    )
  }

  constructor(private hydraPlatform: HydraPlatform) {}

  static getCcyPairs(): Observable<CurrencyPairUpdates> {
    return gatewayServices.pipe(
      take(1),
      mergeMap((services) => services.referenceDataService.getCcyPairs()),
    )
  }
}

export class ThroughputAdminService implements IThroughputAdminService {
  getThroughput: () => Observable<GetThroughputResponse> = () => {
    return this.hydraPlatform.requestResponse$(
      {
        serviceName: "ThroughputAdminService",
        serviceVersion: "hPl5jJ6kWETbXFuLnvWAwrfi5jc=",
        majorVersionContentAddress:
          "0x98ab50219a2ea5d9e19eb25f691bdbb34b3657dc",
        methodName: "getThroughput",
        inboundStream: "empty",
        outboundStream: "one",
        routingData: {
          request: {
            NEXT: BigInt("351281540995897308"),
            COMPLETED: BigInt("495396729071753180"),
            ERROR: BigInt("63051164844185564"),
            CANCEL: BigInt("207166352920041436"),
          },
          response: {
            NEXT: BigInt("317504247172331149"),
            COMPLETED: BigInt("461619435248187021"),
            ERROR: BigInt("29273871020619405"),
            CANCEL: BigInt("173389059096475277"),
          },
        },
        annotations: [],
      },
      allocators.responseAllocator(GetThroughputResponseTypeDefinition),
    )
  }
  setThroughput: (input: SetThroughputRequest) => Observable<void> = (
    input,
  ) => {
    return this.hydraPlatform.requestResponse$(
      {
        serviceName: "ThroughputAdminService",
        serviceVersion: "hPl5jJ6kWETbXFuLnvWAwrfi5jc=",
        majorVersionContentAddress:
          "0xec5a6ccffbbc97f1281f69833904dff1deb345be",
        methodName: "setThroughput",
        inboundStream: "one",
        outboundStream: "empty",
        routingData: {
          request: {
            NEXT: BigInt("427843003423606206"),
            COMPLETED: BigInt("571958191499462078"),
            ERROR: BigInt("139612627271894462"),
            CANCEL: BigInt("283727815347750334"),
          },
          response: {
            NEXT: BigInt("400820774001594930"),
            COMPLETED: BigInt("544935962077450802"),
            ERROR: BigInt("112590397849883186"),
            CANCEL: BigInt("256705585925739058"),
          },
        },
        annotations: [],
      },
      undefined,
      allocators.requestAllocator(input, SetThroughputRequestTypeDefinition),
    )
  }

  constructor(private hydraPlatform: HydraPlatform) {}

  static getThroughput(): Observable<GetThroughputResponse> {
    return gatewayServices.pipe(
      take(1),
      mergeMap((services) => services.throughputAdminService.getThroughput()),
    )
  }

  static setThroughput(input: SetThroughputRequest): Observable<void> {
    return gatewayServices.pipe(
      take(1),
      mergeMap((services) =>
        services.throughputAdminService.setThroughput(input),
      ),
    )
  }
}

export class EchoService implements IEchoService {
  echo: (input: EchoRequest) => Observable<EchoResponse> = (input) => {
    return this.hydraPlatform.requestResponse$(
      {
        serviceName: "EchoService",
        serviceVersion: "3pvE2P7uCShir_5g26nbD2Q4pSI=",
        majorVersionContentAddress:
          "0xf49cc1a0c1899403dd3d5d414eef4ce7dd9d2316",
        methodName: "echo",
        inboundStream: "one",
        outboundStream: "one",
        routingData: {
          request: {
            NEXT: BigInt("337770967908295446"),
            COMPLETED: BigInt("481886155984151318"),
            ERROR: BigInt("49540591756583702"),
            CANCEL: BigInt("193655779832439574"),
          },
          response: {
            NEXT: BigInt("398569432155476081"),
            COMPLETED: BigInt("542684620231331953"),
            ERROR: BigInt("110339056003764337"),
            CANCEL: BigInt("254454244079620209"),
          },
        },
        annotations: [],
      },
      allocators.responseAllocator(EchoResponseTypeDefinition),
      allocators.requestAllocator(input, EchoRequestTypeDefinition),
    )
  }

  constructor(private hydraPlatform: HydraPlatform) {}

  static echo(input: EchoRequest): Observable<EchoResponse> {
    return gatewayServices.pipe(
      take(1),
      mergeMap((services) => services.echoService.echo(input)),
    )
  }
}

export class InstrumentService implements IInstrumentService {
  subscribe: () => Observable<InstrumentUpdate> = () => {
    return this.hydraPlatform.requestStream$(
      {
        serviceName: "InstrumentService",
        serviceVersion: "F_OPT_bs_UpYBTnuGcirYfGLd08=",
        majorVersionContentAddress:
          "0x3f05c6b0f369625ad6cff51ef7e574ea07335c0f",
        methodName: "subscribe",
        inboundStream: "empty",
        outboundStream: "many",
        routingData: {
          request: {
            NEXT: BigInt("322008378500144143"),
            COMPLETED: BigInt("466123566576000015"),
            ERROR: BigInt("33778002348432399"),
            CANCEL: BigInt("177893190424288271"),
          },
          response: {
            NEXT: BigInt("288230663845826368"),
            COMPLETED: BigInt("432345851921682240"),
            ERROR: BigInt("287694114624"),
            CANCEL: BigInt("144115475769970496"),
          },
        },
        annotations: [],
      },
      allocators.responseAllocator(InstrumentUpdateTypeDefinition),
    )
  }

  constructor(private hydraPlatform: HydraPlatform) {}

  static subscribe(): Observable<InstrumentUpdate> {
    return gatewayServices.pipe(
      take(1),
      mergeMap((services) => services.instrumentService.subscribe()),
    )
  }
}

export class DealerService implements IDealerService {
  subscribe: () => Observable<DealerUpdate> = () => {
    return this.hydraPlatform.requestStream$(
      {
        serviceName: "DealerService",
        serviceVersion: "H_zyq8pnacrwFlPwJjz2Fb1788M=",
        majorVersionContentAddress:
          "0x11710ad71d1ec5d9fdd981e2dd608084bdede196",
        methodName: "subscribe",
        inboundStream: "empty",
        outboundStream: "many",
        routingData: {
          request: {
            NEXT: BigInt("337770542174953878"),
            COMPLETED: BigInt("481885730250809750"),
            ERROR: BigInt("49540166023242134"),
            CANCEL: BigInt("193655354099098006"),
          },
          response: {
            NEXT: BigInt("328763641913654098"),
            COMPLETED: BigInt("472878829989509970"),
            ERROR: BigInt("40533265761942354"),
            CANCEL: BigInt("184648453837798226"),
          },
        },
        annotations: [],
      },
      allocators.responseAllocator(DealerUpdateTypeDefinition),
    )
  }

  constructor(private hydraPlatform: HydraPlatform) {}

  static subscribe(): Observable<DealerUpdate> {
    return gatewayServices.pipe(
      take(1),
      mergeMap((services) => services.dealerService.subscribe()),
    )
  }
}

export class WorkflowService implements IWorkflowService {
  createRfq: (input: CreateRfqRequest) => Observable<CreateRfqResponse> = (
    input,
  ) => {
    return this.hydraPlatform.requestResponse$(
      {
        serviceName: "WorkflowService",
        serviceVersion: "pMWZC7BYrwInJjqMJtcfKgtCgtY=",
        majorVersionContentAddress:
          "0x5d266533fe0016e5a2e6d9cfc8012558d48ccd0d",
        methodName: "createRfq",
        inboundStream: "one",
        outboundStream: "one",
        routingData: {
          request: {
            NEXT: BigInt("317504155252739341"),
            COMPLETED: BigInt("461619343328595213"),
            ERROR: BigInt("29273779101027597"),
            CANCEL: BigInt("173388967176883469"),
          },
          response: {
            NEXT: BigInt("425590253033938557"),
            COMPLETED: BigInt("569705441109794429"),
            ERROR: BigInt("137359876882226813"),
            CANCEL: BigInt("281475064958082685"),
          },
        },
        annotations: [],
      },
      allocators.responseAllocator(CreateRfqResponseTypeDefinition),
      allocators.requestAllocator(input, CreateRfqRequestTypeDefinition),
    )
  }
  cancelRfq: (input: CancelRfqRequest) => Observable<void> = (input) => {
    return this.hydraPlatform.requestResponse$(
      {
        serviceName: "WorkflowService",
        serviceVersion: "pMWZC7BYrwInJjqMJtcfKgtCgtY=",
        majorVersionContentAddress:
          "0x462a1441fbf810fe69b66cd4cc23bf7e919a3367",
        methodName: "cancelRfq",
        inboundStream: "one",
        outboundStream: "empty",
        routingData: {
          request: {
            NEXT: BigInt("376051112494117735"),
            COMPLETED: BigInt("520166300569973607"),
            ERROR: BigInt("87820736342405991"),
            CANCEL: BigInt("231935924418261863"),
          },
          response: {
            NEXT: BigInt("315252471731274636"),
            COMPLETED: BigInt("459367659807130508"),
            ERROR: BigInt("27022095579562892"),
            CANCEL: BigInt("171137283655418764"),
          },
        },
        annotations: [],
      },
      undefined,
      allocators.requestAllocator(input, CancelRfqRequestTypeDefinition),
    )
  }
  quote: (input: QuoteRequest) => Observable<QuoteResponse> = (input) => {
    return this.hydraPlatform.requestResponse$(
      {
        serviceName: "WorkflowService",
        serviceVersion: "pMWZC7BYrwInJjqMJtcfKgtCgtY=",
        majorVersionContentAddress:
          "0xdc9486caef0addc7d7cd8915ac2a5c4d9ccd09f3",
        methodName: "quote",
        inboundStream: "one",
        outboundStream: "one",
        routingData: {
          request: {
            NEXT: BigInt("403072499992824307"),
            COMPLETED: BigInt("547187688068680179"),
            ERROR: BigInt("114842123841112563"),
            CANCEL: BigInt("258957311916968435"),
          },
          response: {
            NEXT: BigInt("349029131811972635"),
            COMPLETED: BigInt("493144319887828507"),
            ERROR: BigInt("60798755660260891"),
            CANCEL: BigInt("204913943736116763"),
          },
        },
        annotations: [],
      },
      allocators.responseAllocator(QuoteResponseTypeDefinition),
      allocators.requestAllocator(input, QuoteRequestTypeDefinition),
    )
  }
  pass: (input: PassRequest) => Observable<PassResponse> = (input) => {
    return this.hydraPlatform.requestResponse$(
      {
        serviceName: "WorkflowService",
        serviceVersion: "pMWZC7BYrwInJjqMJtcfKgtCgtY=",
        majorVersionContentAddress:
          "0x6af04e7fee4e349d520228e951fa95d29734945d",
        methodName: "pass",
        inboundStream: "one",
        outboundStream: "one",
        routingData: {
          request: {
            NEXT: BigInt("353533475228521565"),
            COMPLETED: BigInt("497648663304377437"),
            ERROR: BigInt("65303099076809821"),
            CANCEL: BigInt("209418287152665693"),
          },
          response: {
            NEXT: BigInt("306245164191815432"),
            COMPLETED: BigInt("450360352267671304"),
            ERROR: BigInt("18014788040103688"),
            CANCEL: BigInt("162129976115959560"),
          },
        },
        annotations: [],
      },
      allocators.responseAllocator(PassResponseTypeDefinition),
      allocators.requestAllocator(input, PassRequestTypeDefinition),
    )
  }
  accept: (input: AcceptQuoteRequest) => Observable<AcceptQuoteResponse> = (
    input,
  ) => {
    return this.hydraPlatform.requestResponse$(
      {
        serviceName: "WorkflowService",
        serviceVersion: "pMWZC7BYrwInJjqMJtcfKgtCgtY=",
        majorVersionContentAddress:
          "0xf19a7b5f8016848ea2aaa666c0b61a96d5c48172",
        methodName: "accept",
        inboundStream: "one",
        outboundStream: "one",
        routingData: {
          request: {
            NEXT: BigInt("400821014667493746"),
            COMPLETED: BigInt("544936202743349618"),
            ERROR: BigInt("112590638515782002"),
            CANCEL: BigInt("256705826591637874"),
          },
          response: {
            NEXT: BigInt("364791847448101730"),
            COMPLETED: BigInt("508907035523957602"),
            ERROR: BigInt("76561471296389986"),
            CANCEL: BigInt("220676659372245858"),
          },
        },
        annotations: [],
      },
      allocators.responseAllocator(AcceptQuoteResponseTypeDefinition),
      allocators.requestAllocator(input, AcceptQuoteRequestTypeDefinition),
    )
  }
  subscribe: () => Observable<RfqUpdate> = () => {
    return this.hydraPlatform.requestStream$(
      {
        serviceName: "WorkflowService",
        serviceVersion: "pMWZC7BYrwInJjqMJtcfKgtCgtY=",
        majorVersionContentAddress:
          "0xe366a125e0df38e5281cb702f51fefb02f82cb20",
        methodName: "subscribe",
        inboundStream: "empty",
        outboundStream: "many",
        routingData: {
          request: {
            NEXT: BigInt("360288726900984608"),
            COMPLETED: BigInt("504403914976840480"),
            ERROR: BigInt("72058350749272864"),
            CANCEL: BigInt("216173538825128736"),
          },
          response: {
            NEXT: BigInt("371547169517076709"),
            COMPLETED: BigInt("515662357592932581"),
            ERROR: BigInt("83316793365364965"),
            CANCEL: BigInt("227431981441220837"),
          },
        },
        annotations: [],
      },
      allocators.responseAllocator(RfqUpdateTypeDefinition),
    )
  }

  constructor(private hydraPlatform: HydraPlatform) {}

  static createRfq(input: CreateRfqRequest): Observable<CreateRfqResponse> {
    return gatewayServices.pipe(
      take(1),
      mergeMap((services) => services.workflowService.createRfq(input)),
    )
  }

  static cancelRfq(input: CancelRfqRequest): Observable<void> {
    return gatewayServices.pipe(
      take(1),
      mergeMap((services) => services.workflowService.cancelRfq(input)),
    )
  }

  static quote(input: QuoteRequest): Observable<QuoteResponse> {
    return gatewayServices.pipe(
      take(1),
      mergeMap((services) => services.workflowService.quote(input)),
    )
  }

  static pass(input: PassRequest): Observable<PassResponse> {
    return gatewayServices.pipe(
      take(1),
      mergeMap((services) => services.workflowService.pass(input)),
    )
  }

  static accept(input: AcceptQuoteRequest): Observable<AcceptQuoteResponse> {
    return gatewayServices.pipe(
      take(1),
      mergeMap((services) => services.workflowService.accept(input)),
    )
  }

  static subscribe(): Observable<RfqUpdate> {
    return gatewayServices.pipe(
      take(1),
      mergeMap((services) => services.workflowService.subscribe()),
    )
  }
}

export class TradeService implements ITradeService {
  trades: () => Observable<Trade> = () => {
    return this.hydraPlatform.listen$(
      {
        serviceName: "TradeService",
        serviceVersion: "BcarX12WJm_5S2XhtDiTp6-tCxw=",
        majorVersionContentAddress:
          "0xa6a3f7f4e00d155dd9589348882fdbf0c5dbe630",
        methodName: "trades",
        inboundStream: "none",
        outboundStream: "many",
        routingData: {
          request: {
            NEXT: BigInt("396317801320277552"),
            COMPLETED: BigInt("540432989396133424"),
            ERROR: BigInt("108087425168565808"),
            CANCEL: BigInt("252202613244421680"),
          },
          response: {
            NEXT: BigInt("306244926917648328"),
            COMPLETED: BigInt("450360114993504200"),
            ERROR: BigInt("18014550765936584"),
            CANCEL: BigInt("162129738841792456"),
          },
        },
        annotations: [],
      },
      allocators.responseAllocator(TradeTypeDefinition),
    )
  }
  getTrades: () => Observable<Trade> = () => {
    return this.hydraPlatform.requestStream$(
      {
        serviceName: "TradeService",
        serviceVersion: "BcarX12WJm_5S2XhtDiTp6-tCxw=",
        majorVersionContentAddress:
          "0x93fd65c8dc4850c834fd1fe7788811910ce1ab7d",
        methodName: "getTrades",
        inboundStream: "empty",
        outboundStream: "many",
        routingData: {
          request: {
            NEXT: BigInt("425590787772885885"),
            COMPLETED: BigInt("569705975848741757"),
            ERROR: BigInt("137360411621174141"),
            CANCEL: BigInt("281475599697030013"),
          },
          response: {
            NEXT: BigInt("380554322681567465"),
            COMPLETED: BigInt("524669510757423337"),
            ERROR: BigInt("92323946529855721"),
            CANCEL: BigInt("236439134605711593"),
          },
        },
        annotations: [],
      },
      allocators.responseAllocator(TradeTypeDefinition),
    )
  }

  constructor(private hydraPlatform: HydraPlatform) {}

  static trades(): Observable<Trade> {
    return gatewayServices.pipe(
      take(1),
      mergeMap((services) => services.tradeService.trades()),
    )
  }

  static getTrades(): Observable<Trade> {
    return gatewayServices.pipe(
      take(1),
      mergeMap((services) => services.tradeService.getTrades()),
    )
  }
}

export interface TradingGatewayServices {
  analyticsService: IAnalyticsService
  blotterService: IBlotterService
  loginService: ILoginService
  executionService: IExecutionService
  pricingService: IPricingService
  referenceDataService: IReferenceDataService
  throughputAdminService: IThroughputAdminService
  echoService: IEchoService
  instrumentService: IInstrumentService
  dealerService: IDealerService
  workflowService: IWorkflowService
  tradeService: ITradeService
  versionNegotiationService: VersionNegotiation.VersionNegotiationService
  checkCompatibility: () => Observable<VersionNegotiation.Compatibility>
}

const gatewayServices = new ReplaySubject<TradingGatewayServices>(1)

export function createTradingGatewayServices(
  hydraPlatform: HydraPlatform,
): TradingGatewayServices {
  const versionNegotiationService =
    new VersionNegotiation.VersionNegotiationService(hydraPlatform)
  return {
    analyticsService: new AnalyticsService(hydraPlatform),
    blotterService: new BlotterService(hydraPlatform),
    loginService: new LoginService(hydraPlatform),
    executionService: new ExecutionService(hydraPlatform),
    pricingService: new PricingService(hydraPlatform),
    referenceDataService: new ReferenceDataService(hydraPlatform),
    throughputAdminService: new ThroughputAdminService(hydraPlatform),
    echoService: new EchoService(hydraPlatform),
    instrumentService: new InstrumentService(hydraPlatform),
    dealerService: new DealerService(hydraPlatform),
    workflowService: new WorkflowService(hydraPlatform),
    tradeService: new TradeService(hydraPlatform),
    versionNegotiationService,
    checkCompatibility: () =>
      checkGatewayCompatibility(versionNegotiationService),
  }
}

export function connectToTradingGateway(config: PlatformConfig) {
  const connection = createGatewayConnection(config)
  const hydraPlatform = createHydraPlatform(connection)
  const services = createTradingGatewayServices(hydraPlatform)
  gatewayServices.next(services)
  return {
    connection,
    services,
  }
}

function checkGatewayCompatibility(
  versionNegotiationService: VersionNegotiation.VersionNegotiationService,
): Observable<VersionNegotiation.Compatibility> {
  return versionNegotiationService.checkCompatibility({
    methods: [
      {
        serviceName: "AnalyticsService",
        methodName: "getAnalytics",
        methodRouteKey: BigInt("398568636411697713"),
      },
      {
        serviceName: "BlotterService",
        methodName: "getTradeStream",
        methodRouteKey: BigInt("324259965274197136"),
      },
      {
        serviceName: "LoginService",
        methodName: "login",
        methodRouteKey: BigInt("335518861566832853"),
      },
      {
        serviceName: "ExecutionService",
        methodName: "executeTrade",
        methodRouteKey: BigInt("340022560985478551"),
      },
      {
        serviceName: "PricingService",
        methodName: "getPriceUpdates",
        methodRouteKey: BigInt("427842701337194174"),
      },
      {
        serviceName: "PricingService",
        methodName: "getPriceHistory",
        methodRouteKey: BigInt("351281470395697564"),
      },
      {
        serviceName: "ReferenceDataService",
        methodName: "getCcyPairs",
        methodRouteKey: BigInt("301742060701435334"),
      },
      {
        serviceName: "ThroughputAdminService",
        methodName: "getThroughput",
        methodRouteKey: BigInt("351281540995897308"),
      },
      {
        serviceName: "ThroughputAdminService",
        methodName: "setThroughput",
        methodRouteKey: BigInt("427843003423606206"),
      },
      {
        serviceName: "EchoService",
        methodName: "echo",
        methodRouteKey: BigInt("337770967908295446"),
      },
      {
        serviceName: "InstrumentService",
        methodName: "subscribe",
        methodRouteKey: BigInt("322008378500144143"),
      },
      {
        serviceName: "DealerService",
        methodName: "subscribe",
        methodRouteKey: BigInt("337770542174953878"),
      },
      {
        serviceName: "WorkflowService",
        methodName: "createRfq",
        methodRouteKey: BigInt("317504155252739341"),
      },
      {
        serviceName: "WorkflowService",
        methodName: "cancelRfq",
        methodRouteKey: BigInt("376051112494117735"),
      },
      {
        serviceName: "WorkflowService",
        methodName: "quote",
        methodRouteKey: BigInt("403072499992824307"),
      },
      {
        serviceName: "WorkflowService",
        methodName: "pass",
        methodRouteKey: BigInt("353533475228521565"),
      },
      {
        serviceName: "WorkflowService",
        methodName: "accept",
        methodRouteKey: BigInt("400821014667493746"),
      },
      {
        serviceName: "WorkflowService",
        methodName: "subscribe",
        methodRouteKey: BigInt("360288726900984608"),
      },
      {
        serviceName: "TradeService",
        methodName: "trades",
        methodRouteKey: BigInt("396317801320277552"),
      },
      {
        serviceName: "TradeService",
        methodName: "getTrades",
        methodRouteKey: BigInt("425590787772885885"),
      },
    ],
    checkHandlersAreRegistered: true,
    methodRouteKeyFormatVersion: 1,
    clientSupportsOlderMessageFormats: false,
  })
}

export function checkCompatibility(): Observable<VersionNegotiation.Compatibility> {
  return gatewayServices.pipe(
    take(1),
    mergeMap((services) =>
      checkGatewayCompatibility(services.versionNegotiationService),
    ),
  )
}
