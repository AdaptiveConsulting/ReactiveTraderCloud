import React from 'react'
import { RouteWrapper } from 'rt-components'
import { BlotterContainer } from '../../ui/blotter'
import styled from 'react-emotion'

const BlotterStyle = styled('div')`
  height: 100%;
  padding-left: 10px;
  padding-right: 10px;
  background-color: #272d3a;
`

const BlotterRoute = () => (
  <RouteWrapper>
    <BlotterStyle>
      <BlotterContainer />
    </BlotterStyle>
  </RouteWrapper>
)

export default BlotterRoute
