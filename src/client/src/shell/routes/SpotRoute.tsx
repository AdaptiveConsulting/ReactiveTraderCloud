import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import SpotTileContainer from '../../ui/spotTile/SpotTileContainer'

export default ({ match }: RouteComponentProps<{ symbol: string }>) => <SpotTileContainer id={match.params.symbol} />
