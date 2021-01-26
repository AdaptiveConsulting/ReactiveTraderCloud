import { combineLatest, concat, EMPTY, merge } from "rxjs"
import styled from "styled-components/macro"
import { currencyPairs$, currencyPairUpdates$ } from "services/currencyPairs"
import { TileView, useSelectedTileView } from "./selectedView"
import { Tile, tile$ } from "./Tile"
import {
  distinctUntilChanged,
  map,
  mergeAll,
  mergeMap,
  switchMap,
  take,
} from "rxjs/operators"
import { UpdateType } from "services/utils"
import { split } from "@react-rxjs/utils"
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
  concat(
    currencyPairs$.pipe(
      take(1),
      mergeMap((ccPairs) => Object.values(ccPairs)),
      map((currencyPair) => ({ currencyPair, updateType: UpdateType.Added })),
    ),
    currencyPairUpdates$,
  ).pipe(
    split(
      (update) => update.currencyPair.symbol,
      (update$, key) =>
        update$.pipe(
          distinctUntilChanged((a, b) => a.updateType === b.updateType),
          switchMap((update) =>
            update.updateType === UpdateType.Removed ? EMPTY : tile$(key),
          ),
        ),
    ),
    mergeAll(),
  ),
)

export const Tiles = () => {
  const currencyPairs = useFilteredCurrencyPairs()
  const selectedView = useSelectedTileView()
  return (
    <PanelItems data-qa="workspace__tiles-workspace-items">
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
