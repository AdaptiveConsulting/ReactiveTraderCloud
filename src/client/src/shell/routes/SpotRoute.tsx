import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { RouteWrapper } from 'rt-components'
import SpotTileContainer from '../../ui/spotTile/SpotTileContainer'
import styled from 'styled-components/macro'

const SpotTileStyle = styled.div`
  min-width: 26rem;
  width: 26rem;
  min-height: 12rem;
  height: 12rem;
  padding: 0.625rem;
  margin: auto;
`

export default ({ match }: RouteComponentProps<{ symbol: string }>) => (
  <RouteWrapper>
    <SpotTileStyle>
      <SpotTileContainer id={match.params.symbol} />
    </SpotTileStyle>
  </RouteWrapper>
)
