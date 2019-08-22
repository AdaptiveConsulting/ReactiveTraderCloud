import React from 'react'
import { OPENFIN_CHROME_HEADER_HEIGHT, RouteWrapper } from 'rt-components'
import { BlotterContainer } from '../../ui/blotter'
import { styled } from 'rt-theme'

const BlotterContainerStyle = styled('div')`
  height: calc(100% - ${OPENFIN_CHROME_HEADER_HEIGHT});
  width: 100%;
  padding: 0.625rem;
  margin: auto;
`

const BlotterRoute = () => (
  <RouteWrapper>
    <BlotterContainerStyle>
      <BlotterContainer />
    </BlotterContainerStyle>
  </RouteWrapper>
)

export default BlotterRoute
