import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { RouteWrapper } from 'rt-components'
import SpotTileContainer from '../../ui/spotTile/SpotTileContainer'

export default ({ match }: RouteComponentProps<{ symbol: string }>) => (
  <RouteWrapper>
    <SpotTileContainer id={match.params.symbol} />
  </RouteWrapper>
)
