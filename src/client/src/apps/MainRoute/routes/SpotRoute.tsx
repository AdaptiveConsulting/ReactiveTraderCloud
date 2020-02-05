import React, { useEffect, useState } from 'react'
import queryString from 'query-string'
import { RouteComponentProps } from 'react-router-dom'
import SpotTileContainer from '../widgets/spotTile/SpotTileContainer'
import { TileView } from '../widgets/workspace/workspaceHeader'
import { styled } from 'rt-theme'
import { InteropTopics, platformHasFeature, usePlatform } from 'rt-platforms'
import { Subscription } from 'rxjs'

const SpotTileStyle = styled.div`
  min-width: 26rem;
  width: 26rem;
  min-height: 12rem;
  height: 12rem;
  padding: 0.625rem;
  margin: 0 auto;
`

const getTileViewFromQueryStr: (queryStr: string) => TileView = queryStr => {
  const parsedQueryString = queryString.parse(queryStr)
  const tileView = parsedQueryString['tileView'] as TileView
  return !tileView
    ? TileView.Normal
    : Object.values(TileView).includes(tileView)
    ? tileView
    : TileView.Normal
}

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

  const tileView = getTileViewFromQueryStr(search)
  const id = (ccyPairFromInterop && ccyPairFromInterop[0]) || match.params.symbol
  return (
    <SpotTileStyle>
      <SpotTileContainer id={id} tileView={tileView} />
    </SpotTileStyle>
  )
}

export default SpotRoute
