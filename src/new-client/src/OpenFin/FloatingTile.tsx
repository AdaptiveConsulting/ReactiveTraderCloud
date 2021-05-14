import { TileView } from "@/App/LiveRates/selectedView"
import { Tile } from "@/App/LiveRates/Tile"
import { useCurrencyPair } from "@/services/currencyPairs"

interface Props {
  symbol: string
  view: TileView
}

export const FloatingTile: React.FC<Props> = ({ symbol, view }) => {
  const currencyPair = useCurrencyPair(symbol)

  return (
    <Tile
      currencyPair={currencyPair}
      isAnalytics={view === TileView.Analytics}
    />
  )
}
