import { ReferenceDataService } from "@/generated/TradingGateway"
import { bind } from "@react-rxjs/core"
import { distinctUntilChanged, map, scan } from "rxjs/operators"
import { withConnection } from "../withConnection"
import { CurrencyPair } from "./types"

export const [useCurrencyPairs, currencyPairs$] = bind(
  ReferenceDataService.getCcyPairs().pipe(
    withConnection(),
    scan((acc, data) => {
      const { updates } = data
      const result = { ...acc }
      updates.forEach(({ type, payload }) => {
        const { symbol } = payload
        if (type === "removed") {
          delete result[symbol]
        } else {
          result[symbol] = {
            ...payload,
            base: symbol.substr(0, 3), // TODO: talk with hydra team about this
            terms: symbol.substr(3, 3),
            defaultNotional: symbol === "NZDUSD" ? 10_000_000 : 1_000_000, // TODO: talk with hydra team about this
          }
        }
      })
      return result
    }, {} as Record<string, CurrencyPair>),
  ),
)

export const [useCurrencyPair, getCurrencyPair$] = bind((symbol: string) =>
  currencyPairs$.pipe(
    map((currencyPairs) => currencyPairs[symbol]),
    distinctUntilChanged(),
  ),
)
