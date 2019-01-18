import React from 'react'
import { RouteWrapper } from 'rt-components'
import { BlotterContainer } from '../../ui/blotter'
import { styled } from 'rt-theme'

const BlotterContainerStyle = styled('div')`
  height: 28.125rem;
  min-width: 53.125rem;
  padding: 0.625rem;
`

const BlotterRoute = () => (
  <RouteWrapper>
    <BlotterContainerStyle>
      <BlotterContainer />
    </BlotterContainerStyle>
  </RouteWrapper>
)

export default BlotterRoute
