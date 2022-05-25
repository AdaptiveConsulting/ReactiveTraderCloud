import * as HydraPlatform from "@adaptive/hydra-platform"
import { Observable } from "rxjs"
import { LocalDateConverter } from "@adaptive/hydra-codecs/dist/valueConverters"

export const RFQ_CREATED_RFQ_UPDATE = "rfqCreated",
  QUOTE_CREATED_RFQ_UPDATE = "quoteCreated",
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
export type QuoteAcceptedRfqUpdate = {
  type: typeof QUOTE_ACCEPTED_RFQ_UPDATE
  payload: number
}
export type RfqClosedRfqUpdate = {
  type: typeof RFQ_CLOSED_RFQ_UPDATE
  payload: RfqClosed
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
  | QuoteAcceptedRfqUpdate
  | RfqClosedRfqUpdate
  | StartOfStateOfTheWorldRfqUpdate
  | EndOfStateOfTheWorldRfqUpdate

export interface RfqClosed {
  id: number
  state: RfqState
}

export enum RfqState {
  Open = "Open",
  Expired = "Expired",
  Cancelled = "Cancelled",
  Closed = "Closed",
}

export interface QuoteBody {
  id: number
  rfqId: number
  price: number
  state: QuoteState
}

export enum QuoteState {
  Pending = "Pending",
  Accepted = "Accepted",
  Rejected = "Rejected",
}

export interface RfqBody {
  id: number
  instrumentId: number
  dealerIds: Array<number>
  quantity: number
  direction: Direction
  state: RfqState
  expirySecs: number
}

export enum Direction {
  Buy = "Buy",
  Sell = "Sell",
}

export const DEALER_SUBSCRIBE_REQUEST = "dealer",
  CLIENT_SUBSCRIBE_REQUEST = "client"

export type DealerSubscribeRequest = {
  type: typeof DEALER_SUBSCRIBE_REQUEST
  payload: number
}
export type ClientSubscribeRequest = { type: typeof CLIENT_SUBSCRIBE_REQUEST }
export type SubscribeRequest = DealerSubscribeRequest | ClientSubscribeRequest

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

export const ACK_CREATE_QUOTE_RESPONSE = "ack",
  NACK_CREATE_QUOTE_RESPONSE = "nack"

export type AckCreateQuoteResponse = {
  type: typeof ACK_CREATE_QUOTE_RESPONSE
  payload: number
}
export type NackCreateQuoteResponse = {
  type: typeof NACK_CREATE_QUOTE_RESPONSE
}
export type CreateQuoteResponse =
  | AckCreateQuoteResponse
  | NackCreateQuoteResponse

export interface CreateQuoteRequest {
  rfqId: number
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
}

export type LocalDate = LocalDateConverter.ConvertedType

export interface EchoResponse {
  payload: number
}

export interface EchoRequest {
  payload: number
}

export interface SetThroughputRequest {
  targetUpdatesPerSecond: number
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
      quoteAccepted: {
        tag: 3,
        payload: {
          location: { bitOffset: 8, byteOffset: 1, mask: 0 },
          type: QuoteIdTypeDefinition,
        },
      },
      rfqClosed: {
        tag: 4,
        payload: {
          location: { bitOffset: 8, byteOffset: 1, mask: 0 },
          type: RfqClosedRefTypeDefinition,
        },
      },
      startOfStateOfTheWorld: { tag: 5, payload: undefined },
      endOfStateOfTheWorld: { tag: 6, payload: undefined },
    },
    encodedLength: { bitLength: 40, byteLength: 5 },
  }
}

function RfqClosedRefTypeDefinition() {
  return { type: "pointer" as const, elementType: RfqClosedTypeDefinition }
}

function RfqClosedTypeDefinition() {
  return {
    type: "record" as const,
    encodedLength: { bitLength: 40, byteLength: 5 },
    fields: {
      id: {
        location: { bitOffset: 0, byteOffset: 0, mask: 0 },
        type: RfqIdTypeDefinition,
      },
      state: {
        location: { bitOffset: 32, byteOffset: 4, mask: 0 },
        type: RfqStateTypeDefinition,
      },
    },
    jsonConverter: undefined,
  }
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
  }
}

function RfqIdTypeDefinition() {
  return "Int32" as const
}

function QuoteIdTypeDefinition() {
  return "Int32" as const
}

function QuoteBodyRefTypeDefinition() {
  return { type: "pointer" as const, elementType: QuoteBodyTypeDefinition }
}

function QuoteBodyTypeDefinition() {
  return {
    type: "record" as const,
    encodedLength: { bitLength: 136, byteLength: 17 },
    fields: {
      id: {
        location: { bitOffset: 0, byteOffset: 0, mask: 0 },
        type: QuoteIdTypeDefinition,
      },
      rfqId: {
        location: { bitOffset: 32, byteOffset: 4, mask: 0 },
        type: RfqIdTypeDefinition,
      },
      price: {
        location: { bitOffset: 64, byteOffset: 8, mask: 0 },
        type: PriceTypeDefinition,
      },
      state: {
        location: { bitOffset: 128, byteOffset: 16, mask: 0 },
        type: QuoteStateTypeDefinition,
      },
    },
    jsonConverter: undefined,
  }
}

function QuoteStateTypeDefinition() {
  return {
    type: "enum" as const,
    cases: [
      { name: "Pending" as const, value: BigInt("1") },
      { name: "Accepted" as const, value: BigInt("2") },
      { name: "Rejected" as const, value: BigInt("3") },
    ],
    description: "" as const,
    encoding: "Int8" as const,
  }
}

function PriceTypeDefinition() {
  return "Float64" as const
}

function RfqBodyRefTypeDefinition() {
  return { type: "pointer" as const, elementType: RfqBodyTypeDefinition }
}

function RfqBodyTypeDefinition() {
  return {
    type: "record" as const,
    encodedLength: { bitLength: 224, byteLength: 28 },
    fields: {
      id: {
        location: { bitOffset: 0, byteOffset: 0, mask: 0 },
        type: RfqIdTypeDefinition,
      },
      instrumentId: {
        location: { bitOffset: 32, byteOffset: 4, mask: 0 },
        type: InstrumentIdTypeDefinition,
      },
      dealerIds: {
        location: { bitOffset: 64, byteOffset: 8, mask: 0 },
        type: DealerIdListRefTypeDefinition,
      },
      quantity: {
        location: { bitOffset: 96, byteOffset: 12, mask: 0 },
        type: QuantityTypeDefinition,
      },
      direction: {
        location: { bitOffset: 160, byteOffset: 20, mask: 0 },
        type: DirectionTypeDefinition,
      },
      state: {
        location: { bitOffset: 168, byteOffset: 21, mask: 0 },
        type: RfqStateTypeDefinition,
      },
      expirySecs: {
        location: { bitOffset: 192, byteOffset: 24, mask: 0 },
        type: int32TypeDefinition,
      },
    },
    jsonConverter: undefined,
  }
}

function int32TypeDefinition() {
  return "Int32" as const
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

function QuantityTypeDefinition() {
  return "Float64" as const
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
  }
}

function DealerIdTypeDefinition() {
  return "Int32" as const
}

function InstrumentIdTypeDefinition() {
  return "Int32" as const
}

function SubscribeRequestTypeDefinition() {
  return {
    type: "union" as const,
    cases: {
      dealer: {
        tag: 1,
        payload: {
          location: { bitOffset: 8, byteOffset: 1, mask: 0 },
          type: DealerIdTypeDefinition,
        },
      },
      client: { tag: 2, payload: undefined },
    },
    encodedLength: { bitLength: 40, byteLength: 5 },
  }
}

function AcceptQuoteResponseTypeDefinition() {
  return {
    type: "union" as const,
    cases: {
      ack: { tag: 1, payload: undefined },
      nack: { tag: 2, payload: undefined },
    },
    encodedLength: { bitLength: 8, byteLength: 1 },
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

function CreateQuoteResponseTypeDefinition() {
  return {
    type: "union" as const,
    cases: {
      ack: {
        tag: 1,
        payload: {
          location: { bitOffset: 8, byteOffset: 1, mask: 0 },
          type: QuoteIdTypeDefinition,
        },
      },
      nack: { tag: 2, payload: undefined },
    },
    encodedLength: { bitLength: 40, byteLength: 5 },
  }
}

function CreateQuoteRequestTypeDefinition() {
  return {
    type: "record" as const,
    encodedLength: { bitLength: 96, byteLength: 12 },
    fields: {
      rfqId: {
        location: { bitOffset: 0, byteOffset: 0, mask: 0 },
        type: RfqIdTypeDefinition,
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
        type: InstrumentIdTypeDefinition,
      },
      name: {
        location: { bitOffset: 32, byteOffset: 4, mask: 0 },
        type: stringRefTypeDefinition,
      },
    },
    jsonConverter: undefined,
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
  }
}

function InstrumentBodyRefTypeDefinition() {
  return { type: "pointer" as const, elementType: InstrumentBodyTypeDefinition }
}

function InstrumentBodyTypeDefinition() {
  return {
    type: "record" as const,
    encodedLength: { bitLength: 224, byteLength: 28 },
    fields: {
      id: {
        location: { bitOffset: 0, byteOffset: 0, mask: 0 },
        type: InstrumentIdTypeDefinition,
      },
      name: {
        location: { bitOffset: 32, byteOffset: 4, mask: 0 },
        type: stringRefTypeDefinition,
      },
      cusip: {
        location: { bitOffset: 64, byteOffset: 8, mask: 0 },
        type: stringRefTypeDefinition,
      },
      ticker: {
        location: { bitOffset: 96, byteOffset: 12, mask: 0 },
        type: stringRefTypeDefinition,
      },
      maturity: {
        location: { bitOffset: 128, byteOffset: 16, mask: 0 },
        type: LocalDateTypeDefinition,
      },
      interestRate: {
        location: { bitOffset: 160, byteOffset: 20, mask: 0 },
        type: float64TypeDefinition,
      },
    },
    jsonConverter: undefined,
  }
}

function float64TypeDefinition() {
  return "Float64" as const
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
    lengthEncoding: {
      encodingType: "UInt24" as const,
      location: { bitOffset: 16, byteOffset: 2, mask: 0 },
    },
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
    lengthEncoding: {
      encodingType: "UInt24" as const,
      location: { bitOffset: 16, byteOffset: 2, mask: 0 },
    },
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
    lengthEncoding: {
      encodingType: "UInt24" as const,
      location: { bitOffset: 16, byteOffset: 2, mask: 0 },
    },
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
        requestRouteKey: BigInt("1164161099841024256"),
        responseRouteKey: BigInt("5686211384067522816"),
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
        requestRouteKey: BigInt("-5157452200409264128"),
        responseRouteKey: BigInt("6776512328093340672"),
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
        requestRouteKey: BigInt("-6881743837586205440"),
        responseRouteKey: BigInt("-8802381833944962560"),
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
        requestRouteKey: BigInt("-5207524058606496000"),
        responseRouteKey: BigInt("7700181385355211776"),
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
        requestRouteKey: BigInt("-6086348338935972352"),
        responseRouteKey: BigInt("8536520351885563904"),
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
        requestRouteKey: BigInt("-6711739167421129728"),
        responseRouteKey: BigInt("5800769435217250816"),
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
        requestRouteKey: BigInt("-3587707241265510912"),
        responseRouteKey: BigInt("-6306063129046500096"),
        annotations: [],
      },
      allocators.responseAllocator(CurrencyPairUpdatesTypeDefinition),
    )
  },
}
export const ThroughputAdminService = {
  setThroughput: (input: SetThroughputRequest): Observable<void> => {
    return HydraPlatform.requestResponse$(
      {
        serviceName: "ThroughputAdminService",
        methodName: "setThroughput",
        inboundStream: "one",
        outboundStream: "empty",
        requestRouteKey: BigInt("-1018179353612796416"),
        responseRouteKey: BigInt("6831105567706198528"),
        annotations: [],
      },
      undefined,
      allocators.requestAllocator(input, SetThroughputRequestTypeDefinition),
    )
  },
}
export const EchoService = {
  echo: (input: EchoRequest): Observable<EchoResponse> => {
    return HydraPlatform.requestResponse$(
      {
        serviceName: "EchoService",
        methodName: "echo",
        inboundStream: "one",
        outboundStream: "one",
        requestRouteKey: BigInt("-1739061107074329088"),
        responseRouteKey: BigInt("-3932217723524714240"),
        annotations: [],
      },
      allocators.responseAllocator(EchoResponseTypeDefinition),
      allocators.requestAllocator(input, EchoRequestTypeDefinition),
    )
  },
}
export const InstrumentService = {
  subscribe: (): Observable<InstrumentUpdate> => {
    return HydraPlatform.requestStream$(
      {
        serviceName: "InstrumentService",
        methodName: "subscribe",
        inboundStream: "empty",
        outboundStream: "many",
        requestRouteKey: BigInt("4964042739278814208"),
        responseRouteKey: BigInt("1840451258422074368"),
        annotations: [],
      },
      allocators.responseAllocator(InstrumentUpdateTypeDefinition),
    )
  },
}
export const DealerService = {
  subscribe: (): Observable<DealerUpdate> => {
    return HydraPlatform.requestStream$(
      {
        serviceName: "DealerService",
        methodName: "subscribe",
        inboundStream: "empty",
        outboundStream: "many",
        requestRouteKey: BigInt("-8881681336949959168"),
        responseRouteKey: BigInt("-3865403791155441152"),
        annotations: [],
      },
      allocators.responseAllocator(DealerUpdateTypeDefinition),
    )
  },
}
export const WorkflowService = {
  createRfq: (input: CreateRfqRequest): Observable<CreateRfqResponse> => {
    return HydraPlatform.requestResponse$(
      {
        serviceName: "WorkflowService",
        methodName: "createRfq",
        inboundStream: "one",
        outboundStream: "one",
        requestRouteKey: BigInt("6400895782728043776"),
        responseRouteKey: BigInt("1480546138952989952"),
        annotations: [],
      },
      allocators.responseAllocator(CreateRfqResponseTypeDefinition),
      allocators.requestAllocator(input, CreateRfqRequestTypeDefinition),
    )
  },
  cancelRfq: (input: CancelRfqRequest): Observable<void> => {
    return HydraPlatform.requestResponse$(
      {
        serviceName: "WorkflowService",
        methodName: "cancelRfq",
        inboundStream: "one",
        outboundStream: "empty",
        requestRouteKey: BigInt("9120240265967396608"),
        responseRouteKey: BigInt("8351955485888580608"),
        annotations: [],
      },
      undefined,
      allocators.requestAllocator(input, CancelRfqRequestTypeDefinition),
    )
  },
  createQuote: (input: CreateQuoteRequest): Observable<CreateQuoteResponse> => {
    return HydraPlatform.requestResponse$(
      {
        serviceName: "WorkflowService",
        methodName: "createQuote",
        inboundStream: "one",
        outboundStream: "one",
        requestRouteKey: BigInt("-2939431115079188736"),
        responseRouteKey: BigInt("-762448194194362112"),
        annotations: [],
      },
      allocators.responseAllocator(CreateQuoteResponseTypeDefinition),
      allocators.requestAllocator(input, CreateQuoteRequestTypeDefinition),
    )
  },
  acceptQuote: (input: AcceptQuoteRequest): Observable<AcceptQuoteResponse> => {
    return HydraPlatform.requestResponse$(
      {
        serviceName: "WorkflowService",
        methodName: "acceptQuote",
        inboundStream: "one",
        outboundStream: "one",
        requestRouteKey: BigInt("3406490184815367168"),
        responseRouteKey: BigInt("-6269829733944167936"),
        annotations: [],
      },
      allocators.responseAllocator(AcceptQuoteResponseTypeDefinition),
      allocators.requestAllocator(input, AcceptQuoteRequestTypeDefinition),
    )
  },
  subscribe: (input: SubscribeRequest): Observable<RfqUpdate> => {
    return HydraPlatform.requestStream$(
      {
        serviceName: "WorkflowService",
        methodName: "subscribe",
        inboundStream: "one",
        outboundStream: "many",
        requestRouteKey: BigInt("-343946350836203520"),
        responseRouteKey: BigInt("-5563880384983941120"),
        annotations: [],
      },
      allocators.responseAllocator(RfqUpdateTypeDefinition),
      allocators.requestAllocator(input, SubscribeRequestTypeDefinition),
    )
  },
}

export function checkCompatibility(): Observable<HydraPlatform.VersionNegotiation.Compatibility> {
  return HydraPlatform.VersionNegotiation.VersionNegotiationService.checkCompatibility(
    {
      methods: [
        {
          serviceName: "AnalyticsService",
          methodName: "getAnalytics",
          methodRouteKey: BigInt("1164161099841024256"),
        },
        {
          serviceName: "BlotterService",
          methodName: "getTradeStream",
          methodRouteKey: BigInt("-5157452200409264128"),
        },
        {
          serviceName: "LoginService",
          methodName: "login",
          methodRouteKey: BigInt("-6881743837586205440"),
        },
        {
          serviceName: "ExecutionService",
          methodName: "executeTrade",
          methodRouteKey: BigInt("-5207524058606496000"),
        },
        {
          serviceName: "PricingService",
          methodName: "getPriceUpdates",
          methodRouteKey: BigInt("-6086348338935972352"),
        },
        {
          serviceName: "PricingService",
          methodName: "getPriceHistory",
          methodRouteKey: BigInt("-6711739167421129728"),
        },
        {
          serviceName: "ReferenceDataService",
          methodName: "getCcyPairs",
          methodRouteKey: BigInt("-3587707241265510912"),
        },
        {
          serviceName: "ThroughputAdminService",
          methodName: "setThroughput",
          methodRouteKey: BigInt("-1018179353612796416"),
        },
        {
          serviceName: "EchoService",
          methodName: "echo",
          methodRouteKey: BigInt("-1739061107074329088"),
        },
        {
          serviceName: "InstrumentService",
          methodName: "subscribe",
          methodRouteKey: BigInt("4964042739278814208"),
        },
        {
          serviceName: "DealerService",
          methodName: "subscribe",
          methodRouteKey: BigInt("-8881681336949959168"),
        },
        {
          serviceName: "WorkflowService",
          methodName: "createRfq",
          methodRouteKey: BigInt("6400895782728043776"),
        },
        {
          serviceName: "WorkflowService",
          methodName: "cancelRfq",
          methodRouteKey: BigInt("9120240265967396608"),
        },
        {
          serviceName: "WorkflowService",
          methodName: "createQuote",
          methodRouteKey: BigInt("-2939431115079188736"),
        },
        {
          serviceName: "WorkflowService",
          methodName: "acceptQuote",
          methodRouteKey: BigInt("3406490184815367168"),
        },
        {
          serviceName: "WorkflowService",
          methodName: "subscribe",
          methodRouteKey: BigInt("-343946350836203520"),
        },
      ],
    },
  )
}
