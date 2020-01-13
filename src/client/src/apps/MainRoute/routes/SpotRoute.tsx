import React, { useEffect, useState } from 'react'
import queryString from 'query-string'
import { RouteComponentProps } from 'react-router-dom'
import SpotTileContainer from '../widgets/spotTile/SpotTileContainer'
import { TileViews } from '../widgets/workspace/workspaceHeader'
import { styled } from 'rt-theme'
import { InteropTopics, platformHasFeature, usePlatform } from 'rt-platforms'
import { Subscription } from 'rxjs'
import { RfqState } from '../widgets/spotTile/components/types'

export interface rfqQueryObject {
  rfqState: RfqState
  rfqAskPrice: number | undefined
  rfqBidPrice: number | undefined
  rfqMidPrice: number | undefined
  rfqReceivedTime: number | null
  rfqTimeout: number | null
  notional: number | undefined
  creationTimestamp: number | null
  valueDate: string | null
}

const SpotTileStyle = styled.div`
  min-width: 26rem;
  width: 26rem;
  min-height: 12rem;
  height: 12rem;
  padding: 0.625rem;
  margin: 0 auto;
`

const getFloatFromQuery = (query: string[] | string | null | undefined): number | undefined => {
  if (query === null || typeof query === 'undefined' || Array.isArray(query) || query === 'undefined') {
    return undefined
  }
  
  return parseFloat(query)
}

const getIntFromQuery = (query: string[] | string | null | undefined): number | null => {
  if (query === null || typeof query === 'undefined' || Array.isArray(query) || query === 'null' || query === 'undefined') {
    return null
  }
  
  return parseInt(query)
}

const getStringFromQuery = (query: string[] | string | null | undefined): string | null => {
  if (query === null || typeof query === 'undefined' || Array.isArray(query) || query === 'null') {
    return null
  }
  
  return query
}

const getTileViewFromQueryStr: (query: string) => TileViews = query => {
  const parsedQueryString = queryString.parse(query)
  const tileView = parsedQueryString['tileView'] as TileViews

  return !tileView
    ? TileViews.Normal
    : Object.values(TileViews).includes(tileView)
    ? tileView
    : TileViews.Normal
}

const getRfqDatafromQuery: (query: string) => rfqQueryObject = query => {
  const parsedQueryString = queryString.parse(query)

  return {
    rfqState: parsedQueryString['rfqState'] as RfqState,
    rfqAskPrice: getFloatFromQuery(parsedQueryString['rfqAskPrice']),
    rfqBidPrice: getFloatFromQuery(parsedQueryString['rfqBidPrice']),
    rfqMidPrice: getFloatFromQuery(parsedQueryString['rfqMidPrice']),
    rfqReceivedTime: getIntFromQuery(parsedQueryString['rfqReceivedTime']),
    rfqTimeout: getIntFromQuery(parsedQueryString['rfqTimeout']),
    notional: getFloatFromQuery(parsedQueryString['notional']),
    creationTimestamp: getIntFromQuery(parsedQueryString['rfqCreationTimestamp']),
    valueDate: getStringFromQuery(parsedQueryString['rfqValueDate'])
  }
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
  const rfqQueryObject = getRfqDatafromQuery(search)

  const id = (ccyPairFromInterop && ccyPairFromInterop[0]) || match.params.symbol

  return (
    <SpotTileStyle>
      <SpotTileContainer id={id} tileView={tileView} rfqQueryObject={rfqQueryObject} />
    </SpotTileStyle>
  )
}

export default SpotRoute
