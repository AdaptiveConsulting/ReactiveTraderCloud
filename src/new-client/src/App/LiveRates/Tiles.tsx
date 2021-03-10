import { combineLatest, merge } from "rxjs"
import styled from "styled-components"
import {
  currencyPairDependant$,
  currencyPairs$,
} from "@/services/currencyPairs"
import { TileView, useSelectedTileView } from "./selectedView"
import { Tile, tile$ } from "./Tile"
import { map } from "rxjs/operators"
import { selectedCurrency$, ALL_CURRENCIES } from "./selectedCurrency"
import { bind } from "@react-rxjs/core"

const PanelItems = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  grid-gap: 0.25rem;
`

const [useFilteredCurrencyPairs, filteredCurrencyPairs$] = bind(
  combineLatest([currencyPairs$, selectedCurrency$]).pipe(
    map(([currencyPairs, selectedCurrency]) => {
      if (selectedCurrency === ALL_CURRENCIES)
        return Object.values(currencyPairs)
      const result = { ...currencyPairs }
      Object.keys(currencyPairs)
        .filter((symbol) => !symbol.includes(selectedCurrency as string))
        .forEach((symbol) => {
          delete result[symbol]
        })
      return Object.values(result)
    }),
  ),
)

export const tiles$ = merge(
  filteredCurrencyPairs$,
  currencyPairDependant$(tile$),
)

export const Tiles = () => {
  const currencyPairs = useFilteredCurrencyPairs()
  const selectedView = useSelectedTileView()
  return (
    <PanelItems data-testid="workspace__tiles-workspace-items">
      {currencyPairs.map((currencyPair) => (
        <Tile
          key={currencyPair.symbol}
          currencyPair={currencyPair}
          isAnalytics={selectedView === TileView.Analytics}
        />
      ))}
    </PanelItems>
  )
}
