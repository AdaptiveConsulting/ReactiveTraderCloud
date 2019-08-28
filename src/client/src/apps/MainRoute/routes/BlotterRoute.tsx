import React from 'react'
import { BlotterContainer } from '../widgets/blotter'
import { styled } from 'rt-theme'

const BlotterContainerStyle = styled('div')`
  height: calc(100% - 21px);
  width: 100%;
  padding: 0.625rem;
  margin: auto;
`

const BlotterRoute = () => (
  <BlotterContainerStyle>
    <BlotterContainer />
  </BlotterContainerStyle>
)

export default BlotterRoute
