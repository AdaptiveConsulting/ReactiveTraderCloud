import React from 'react'
import { RouteWrapper } from 'rt-components'
import { BlotterContainer } from '../../ui/blotter'
import styled from 'react-emotion'

const BlotterContainerStyle = styled('div')`
  height: 100%;
  padding-left: 10px;
  padding-right: 10px;
  background-color: #272d3a;
`

const BlotterRoute = () => (
  <RouteWrapper>
    <BlotterContainerStyle>
      <BlotterContainer />
    </BlotterContainerStyle>
  </RouteWrapper>
)

export default BlotterRoute
