import { contextBinder } from "@react-rxjs/utils"
import { createContext, useContext } from "react"
import { CurrencyPair } from "@/services/currencyPairs"

type TileContextBase = {
  isTornOut: boolean
  supportsTearOut: boolean
}
type TileContextInitial = TileContextBase & {
  currencyPair: CurrencyPair | null
}
type TileContextType = TileContextBase & { currencyPair: CurrencyPair }

const TileContext = createContext<TileContextInitial>({
  currencyPair: null,
  isTornOut: false,
  supportsTearOut: false,
})

export const { Provider } = TileContext
export const useTileContext = () => {
  const tileContext = useContext(TileContext)
  if (!tileContext.currencyPair) {
    throw new TypeError("currencyPair must be defined")
  }
  return tileContext as TileContextType
}
export const useTileCurrencyPair = () => useTileContext().currencyPair
export const symbolBind = contextBinder(() => useTileCurrencyPair().symbol)
