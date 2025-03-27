import { bind } from "@react-rxjs/core"
import { combineKeys } from "@react-rxjs/utils"
import { useEffect } from "react"
import { combineLatest, merge } from "rxjs"
import { map } from "rxjs/operators"

import { GridLayout } from "@/client/components/layout/GridLayout"
import { currencyPairs$ } from "@/services/currencyPairs"

import { ALL_CURRENCIES, selectedCurrency$ } from "./selectedCurrency"
import { getInitView, TileView, useSelectedTileView } from "./selectedView"
import { Tile, tile$ } from "./Tile"
import { handleTearOut } from "./Tile/TearOut/handleTearOut"
import { tearOutState$, useTearOutEntry } from "./Tile/TearOut/state"

export const [useFilteredCurrencyPairs, filteredCurrencyPairs$] = bind(
  combineLatest([currencyPairs$, selectedCurrency$, tearOutState$]).pipe(
    map(([currencyPairs, selectedCurrency, tearOutState]) => {
      const result = { ...currencyPairs }
      for (const symbol of Object.keys(result)) {
        if (tearOutState[symbol]) {
          delete result[symbol]
        }
      }

      if (selectedCurrency === ALL_CURRENCIES) {
        return Object.values(result)
      }

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
  combineKeys(currencyPairs$.pipe(map(Object.keys)), tile$),
)

export const Tiles = () => {
  const currencyPairs = useFilteredCurrencyPairs()
  const selectedView = useSelectedTileView(getInitView())
  const tearOutEntry = useTearOutEntry()

  useEffect(() => {
    if (tearOutEntry) {
      const [symbol, tornOut, tileRef] = tearOutEntry
      if (tornOut) {
        handleTearOut(symbol, tileRef)
      }
    }
  }, [tearOutEntry])

  return (
    <GridLayout role="region" aria-label="Lives Rates Tiles">
      {currencyPairs.map((currencyPair) => (
        <Tile
          key={currencyPair.symbol}
          currencyPair={currencyPair}
          showingChart={selectedView === TileView.Chart}
        />
      ))}
    </GridLayout>
  )
}
