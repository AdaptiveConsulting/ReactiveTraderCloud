import { bind } from "@react-rxjs/core"
import { defer, Observable } from "rxjs"
import { HistoryPrice, Price } from "../types"

let priceMocks$: Record<string, Observable<Price>> = {}

export const __setPriceMock = (symbol: string, value: Observable<Price>) => {
  priceMocks$[symbol] = value
}

export const __resetPriceMocks = () => {
  priceMocks$ = {}
}

export const [usePrice, getPrice$] = bind((symbol: string) =>
  defer(() => priceMocks$[symbol]),
)

let historicalPricesMock$: Observable<HistoryPrice> | undefined
export const __setHistoricalPricesMock = (mock: Observable<HistoryPrice>) => {
  historicalPricesMock$ = mock
}
export const __resetHistoricalPricesMock = () => {
  historicalPricesMock$ = undefined
}

export const __resetMocks = () => {
  __resetHistoricalPricesMock()
  __resetPriceMocks()
}

export const [
  useHistoricalPrices,
  getHistoricalPrices$,
] = bind((symbol: string) => defer(() => historicalPricesMock$!))
