import { Subject } from "rxjs"
import { CurrencyPair } from "services/currencyPairs"

export const Tile: React.FC<{
  currencyPair: CurrencyPair
  isAnalytics: boolean
}> = ({ currencyPair, isAnalytics }) => (
  <div data-testid={`tile-${currencyPair.symbol}`}>
    IsAnalytics: {isAnalytics ? "true" : "false"}
  </div>
)

export const tile$ = () => new Subject()
