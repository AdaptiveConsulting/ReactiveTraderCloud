import {
  CurrencyPairUpdate,
  CurrencyPairUpdates,
} from "@/generated/TradingGateway"
import { Observable, of } from "rxjs"
import { delay } from "rxjs/operators"
import { CurrencyPair } from "./types"

const fakeData: Record<string, CurrencyPair> = {
  EURUSD: {
    symbol: "EURUSD",
    ratePrecision: 5,
    pipsPosition: 4,
    base: "EUR",
    terms: "USD",
    defaultNotional: 1000000,
  },
  USDJPY: {
    symbol: "USDJPY",
    ratePrecision: 3,
    pipsPosition: 2,
    base: "USD",
    terms: "JPY",
    defaultNotional: 1000000,
  },
  GBPUSD: {
    symbol: "GBPUSD",
    ratePrecision: 5,
    pipsPosition: 4,
    base: "GBP",
    terms: "USD",
    defaultNotional: 1000000,
  },
  GBPJPY: {
    symbol: "GBPJPY",
    ratePrecision: 3,
    pipsPosition: 2,
    base: "GBP",
    terms: "JPY",
    defaultNotional: 1000000,
  },
  EURJPY: {
    symbol: "EURJPY",
    ratePrecision: 3,
    pipsPosition: 2,
    base: "EUR",
    terms: "JPY",
    defaultNotional: 1000000,
  },
  AUDUSD: {
    symbol: "AUDUSD",
    ratePrecision: 5,
    pipsPosition: 4,
    base: "AUD",
    terms: "USD",
    defaultNotional: 1000000,
  },
  NZDUSD: {
    symbol: "NZDUSD",
    ratePrecision: 5,
    pipsPosition: 4,
    base: "NZD",
    terms: "USD",
    defaultNotional: 10000000,
  },
  EURCAD: {
    symbol: "EURCAD",
    ratePrecision: 5,
    pipsPosition: 4,
    base: "EUR",
    terms: "CAD",
    defaultNotional: 1000000,
  },
  EURAUD: {
    symbol: "EURAUD",
    ratePrecision: 5,
    pipsPosition: 4,
    base: "EUR",
    terms: "AUD",
    defaultNotional: 1000000,
  },
}

const getCcyPairs = (): Observable<CurrencyPairUpdates> =>
  of({
    updates: Object.entries(fakeData).map<CurrencyPairUpdate>(
      ([symbol, data]) => ({
        type: "added",
        payload: {
          symbol,
          pipsPosition: data.pipsPosition,
          ratePrecision: data.ratePrecision,
        },
      }),
    ),
    isStateOfTheWorld: true,
    isStale: false,
  }).pipe(delay(1_000))

const ReferenceDataService = {
  getCcyPairs,
}

export { ReferenceDataService }
