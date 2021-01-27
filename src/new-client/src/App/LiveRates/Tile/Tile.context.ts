import { contextBinder } from "@react-rxjs/utils"
import { createContext, useContext } from "react"
import { CurrencyPair } from "services/currencyPairs"

const CurrencyPairContext = createContext<CurrencyPair>(null as any)

export const { Provider } = CurrencyPairContext
export const useTileCurrencyPair = () => useContext(CurrencyPairContext)
export const symbolBind = contextBinder(() => useTileCurrencyPair().symbol)
