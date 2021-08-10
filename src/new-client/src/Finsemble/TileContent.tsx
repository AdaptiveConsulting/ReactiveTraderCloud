import { TileView } from "@/App/LiveRates/selectedView"
import { Tile } from "@/App/LiveRates/Tile"
import { useCurrencyPair } from "@/services/currencyPairs"

interface TileContentProps {
  symbol: string
  view: TileView
}

export const TileContent: React.FC<TileContentProps> = ({ symbol, view }) => {
  const currencyPair = useCurrencyPair(symbol)
  return (
    <Tile
      key={symbol}
      currencyPair={currencyPair}
      isAnalytics={view === TileView.Analytics}
    />
  )
}
