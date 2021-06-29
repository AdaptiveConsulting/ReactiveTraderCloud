import { bind } from "@react-rxjs/core"
import { combineLatest } from "rxjs"
import styled from "styled-components"
import { map } from "rxjs/operators"
import { currencyPairs$ } from "@/services/currencyPairs"
import { useSelectedTileView } from "@/App/LiveRates/selectedView"
import {
  selectedCurrency$,
  ALL_CURRENCIES,
} from "@/App/LiveRates/selectedCurrency"
import { DetachableTile } from "./DetachableTile"
import { tearOutState$ } from "./tornOutTiles"

const PanelItems = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  grid-gap: 0.25rem;
`

const [useFilteredCurrencyPairs] = bind(
  combineLatest([currencyPairs$, selectedCurrency$, tearOutState$]).pipe(
    map(([currencyPairs, selectedCurrency, tearOutState]) => {
      const result = { ...currencyPairs }

      for (const symbol of Object.keys(result)) {
        if (tearOutState[symbol]) {
          delete result[symbol]
        }
      }

      if (selectedCurrency === ALL_CURRENCIES) return Object.values(result)

      Object.keys(currencyPairs)
        .filter((symbol) => !symbol.includes(selectedCurrency as string))
        .forEach((symbol) => {
          delete result[symbol]
        })

      return Object.values(result)
    }),
  ),
)

export const DetachableTiles = () => {
  const currencyPairs = useFilteredCurrencyPairs()
  const selectedView = useSelectedTileView()

  return (
    <PanelItems role="region" aria-label="Lives Rates Tiles">
      {currencyPairs.map((currencyPair) => (
        <DetachableTile
          key={currencyPair.symbol}
          symbol={currencyPair.symbol}
          view={selectedView}
          isTornOut={false}
        />
      ))}
    </PanelItems>
  )
}
