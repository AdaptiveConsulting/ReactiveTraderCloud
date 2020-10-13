import React, { useEffect, useState } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import SpotTileContainer from '../widgets/spotTile/SpotTileContainer'
import { TileView } from '../widgets/workspace/workspaceHeader'
import styled from 'styled-components/macro'
import { InteropTopics, platformHasFeature, usePlatform } from 'rt-platforms'
import { Subscription } from 'rxjs'
import { useLocalStorage } from 'rt-util'

const SpotTileStyle = styled.div`
  min-width: 26rem;
  width: 26rem;
  min-height: 12.2rem;
  height: 12.2rem;
  padding: 0 0.575rem 0.5rem 0.575rem;
  margin: 0 auto;
`

const SpotRoute: React.FC<RouteComponentProps<{ symbol: string }>> = ({
  location: { search },
  match,
}) => {
  const platform = usePlatform()
  const [ccyPairFromInterop, setCcyPairFromInterop] = useState<ReadonlyArray<string>>()

  // TODO: ccyPair from interop has to be in the hook or in the  store, same for BlotterRoute, but don't leave them here (side-effects)
  useEffect(() => {
    if (!platform) {
      return
    }
    let ccyPairSubscription: Subscription

    if (platformHasFeature(platform, 'interop')) {
      const blotterFilters$ = platform.interop.subscribe$(InteropTopics.FilterCurrencyPair)
      ccyPairSubscription = blotterFilters$.subscribe(setCcyPairFromInterop)
    }

    return () => ccyPairSubscription && ccyPairSubscription.unsubscribe()
  }, [platform])

  const [tileView] = useLocalStorage('tileView', TileView.Analytics)
  const id = (ccyPairFromInterop && ccyPairFromInterop[0]) || match.params.symbol

  return (
    <SpotTileStyle>
      <SpotTileContainer id={id} tileView={tileView} />
    </SpotTileStyle>
  )
}

export default SpotRoute
