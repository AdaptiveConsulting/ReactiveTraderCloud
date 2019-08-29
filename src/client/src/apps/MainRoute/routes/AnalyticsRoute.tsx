import React from 'react'
import { AnalyticsContainer } from '../widgets/analytics'
import { styled } from 'rt-theme'

const AnalyticsRouteStyle = styled.div`
  max-width: 25rem;
  height: calc(100% - 21px);
  padding: 0.625rem;
  margin: auto;
`
const AnalyticsRoute = () => (
  <AnalyticsRouteStyle>
    <AnalyticsContainer />
  </AnalyticsRouteStyle>
)

export default AnalyticsRoute
