import React from 'react'
import queryString from 'query-string'
import { RouteComponentProps } from 'react-router-dom'
import SpotTileContainer from '../widgets/spotTile/SpotTileContainer'
import { TileViews } from '../widgets/workspace/workspaceHeader'
import { styled } from 'rt-theme'

const SpotTileStyle = styled.div`
  min-width: 26rem;
  width: 26rem;
  min-height: 12rem;
  height: 12rem;
  padding: 0.625rem;
  margin: 0 auto;
`
const getTileViewFromQueryStr: (queryStr: string) => TileViews = queryStr => {
  const parsedQueryString = queryString.parse(queryStr)
  const tileView = parsedQueryString['tileView']
  return !tileView
    ? TileViews.Normal
    : Object.values(TileViews).includes(tileView)
    ? (tileView as TileViews)
    : TileViews.Normal
}
export default ({ location: { search }, match }: RouteComponentProps<{ symbol: string }>) => {
  const tileView = getTileViewFromQueryStr(search)
  return (
    <SpotTileStyle>
      <SpotTileContainer id={match.params.symbol} tileView={tileView} />
    </SpotTileStyle>
  )
}
