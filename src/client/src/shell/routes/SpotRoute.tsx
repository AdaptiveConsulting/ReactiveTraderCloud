import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { RouteWrapper } from 'rt-components'
import SpotTileContainer from '../../ui/spotTile/SpotTileContainer'

export default ({ location, match }: RouteComponentProps<{ symbol: string }>) => {
  const queryString = location.search.split('?')[1]
  const tileView = queryString.split('=')[1]
  return (
    <RouteWrapper>
      <SpotTileContainer id={match.params.symbol} tileView={tileView} />
    </RouteWrapper>
  )
}
