import { bind } from "@react-rxjs/core"
import { defer, Observable } from "rxjs"
import { CurrencyPair } from "../types"

let ccMocks$: Record<string, Observable<CurrencyPair>> = {}

export const __setCurrencyPairMock = (
  key: string,
  value: Observable<CurrencyPair>,
) => {
  ccMocks$[key] = value
}

export const __resetCurrencyPairMocks = () => {
  ccMocks$ = {}
}

export const [useCurrencyPair, getCurrencyPair$] = bind((symbol: string) =>
  defer(() => ccMocks$[symbol]),
)

export const __resetMocks = () => {
  __resetCurrencyPairMocks()
}
