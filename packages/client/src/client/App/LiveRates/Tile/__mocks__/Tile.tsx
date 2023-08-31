import { Subject } from "rxjs"

import { CurrencyPair } from "@/services/currencyPairs"

export const Tile = ({
  currencyPair,
  isAnalytics,
}: {
  currencyPair: CurrencyPair
  isAnalytics: boolean
}) => (
  <div data-testid={`tile-${currencyPair.symbol}`}>
    IsAnalytics: {isAnalytics ? "true" : "false"}
  </div>
)

export const tile$ = () => new Subject()
