import React from 'react'
import { merge } from 'rxjs'
import { Subscribe } from '@react-rxjs/core'
import styled from 'styled-components/macro'
import { TileSwitch } from './TileSwitch'
import { MainHeader } from './MainHeader'
import { useLocalStorage } from './util'
import { filteredSymbols$,
         useFilteredSymbols, 
         currencies$,
         currencyPairs$ } from 'services/currencyPairs'
import { tilesSubscription$ } from 'services/tiles'
import { TileView } from './types'
import { Loader } from 'components/Loader'

const PanelItems = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  grid-gap: 0.25rem;
`

const PanelItem = styled.div`
  flex-grow: 1;
  flex-basis: 20rem;
`

const LiveRates$ = merge(filteredSymbols$, currencies$, currencyPairs$, tilesSubscription$)
const FilteredTiles = () => {
  const spotTiles = useFilteredSymbols()
  return (
    <>
      {
        spotTiles.map((symbol) => (
          <PanelItem>
            <TileSwitch id={symbol} key={symbol}/>
          </PanelItem>
        ))
      }
    </>
  )
}

export const MainPanel: React.FC = () => {
  const [tileView, setTileView] = useLocalStorage('tileView', TileView.Analytics)
  
  return (
    <div data-qa="workspace__tiles-workspace">
      <Subscribe source$={LiveRates$}
                fallback={<Loader minWidth="22rem" minHeight="22rem" />}
      >
        <MainHeader
          tileView={tileView as TileView}
        />
      
        <PanelItems data-qa="workspace__tiles-workspace-items">
          <FilteredTiles/>
        </PanelItems>
      </Subscribe>
    </div>
  )
}
