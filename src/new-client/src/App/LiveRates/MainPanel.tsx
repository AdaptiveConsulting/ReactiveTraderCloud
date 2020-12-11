import { merge } from "rxjs"
import { Subscribe } from "@react-rxjs/core"
import styled from "styled-components/macro"
import { TileSwitch } from "./TileSwitch"
import { MainHeader } from "./MainHeader"
import {
  filteredSymbols$,
  useFilteredSymbols,
  currencies$,
  currencyPairs$,
} from "services/currencyPairs"
import { tilesSubscription$ } from "services/tiles"
import { Loader } from "components/Loader"

const PanelItems = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  grid-gap: 0.25rem;
`

const LiveRates$ = merge(
  filteredSymbols$,
  currencies$,
  currencyPairs$,
  tilesSubscription$,
)
const FilteredTiles = () => {
  const spotTiles = useFilteredSymbols()
  return (
    <>
      {spotTiles.map((symbol) => (
        <TileSwitch key={symbol} id={symbol} />
      ))}
    </>
  )
}

export const MainPanel: React.FC = () => {
  return (
    <div data-qa="workspace__tiles-workspace">
      <Subscribe
        source$={LiveRates$}
        fallback={<Loader minWidth="22rem" minHeight="22rem" />}
      >
        <MainHeader />

        <PanelItems data-qa="workspace__tiles-workspace-items">
          <FilteredTiles />
        </PanelItems>
      </Subscribe>
    </div>
  )
}
