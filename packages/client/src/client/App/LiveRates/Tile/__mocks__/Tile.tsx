import { Subject } from "rxjs"

import { CurrencyPair } from "@/services/currencyPairs"

export const Tile = ({
  currencyPair,
  showingChart,
}: {
  currencyPair: CurrencyPair
  showingChart: boolean
}) => (
  <div data-testid={`tile-${currencyPair.symbol}`}>
    ShowingChart: {showingChart ? "true" : "false"}
  </div>
)

export const tile$ = () => new Subject()
