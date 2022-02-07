import { contextBinder } from "@react-rxjs/utils"
import { createContext, useContext } from "react"
import { CurrencyPair } from "@/services/currencyPairs"

const TileContext = createContext<{
  currencyPair: CurrencyPair
  isTornOut: boolean
  supportsTearOut: boolean
}>({} as any)

export const { Provider } = TileContext
export const useTileContext = () => useContext(TileContext)
export const useTileCurrencyPair = () => useTileContext().currencyPair
export const symbolBind = contextBinder(() => useTileCurrencyPair().symbol)
