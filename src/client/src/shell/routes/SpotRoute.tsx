import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { RouteWrapper } from 'rt-components'
import SpotTileContainer from '../../ui/spotTile/SpotTileContainer'
import { TileViews } from '../../ui/workspace/workspaceHeader'
import { styled } from 'rt-theme'

const SpotTileStyle = styled.div`
  min-width: 26rem;
  width: 26rem;
  min-height: 12rem;
  height: 12rem;
  padding: 0.625rem;
  margin: auto;
`

export default ({ location, match }: RouteComponentProps<{ symbol: string }>) => {
  const queryString = location.search.split('?')[1]
  const tileView = queryString.split('=')[1] as TileViews
  return (
    <RouteWrapper>
      <SpotTileStyle>
        <SpotTileContainer id={match.params.symbol} tileView={tileView} />
      </SpotTileStyle>
    </RouteWrapper>
  )
}
