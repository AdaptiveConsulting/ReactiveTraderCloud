import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { RouteWrapper } from 'rt-components'
import SpotTileContainer from '../../ui/spotTile/SpotTileContainer'
import { styled } from 'rt-theme'

const SpotTileStyle = styled.div`
  width: 380px;
  height: 210px;
  padding: 0.625rem;
`

export default ({ match }: RouteComponentProps<{ symbol: string }>) => (
  <RouteWrapper>
    <SpotTileStyle>
      <SpotTileContainer id={match.params.symbol} />
    </SpotTileStyle>
  </RouteWrapper>
)
