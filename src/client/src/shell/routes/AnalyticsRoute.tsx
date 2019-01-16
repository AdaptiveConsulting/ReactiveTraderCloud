import React from 'react'
import { RouteWrapper } from 'rt-components'
import { AnalyticsContainer } from '../../ui/analytics'
import { styled } from 'rt-theme'

const AnalyticsRouteStyle = styled.div`
  height: 100%;
  padding: 0.625rem 0rem;
  overflow: auto;
`
const AnalyticsRoute = () => (
  <RouteWrapper>
    <AnalyticsRouteStyle>
      <AnalyticsContainer />
    </AnalyticsRouteStyle>
  </RouteWrapper>
)

export default AnalyticsRoute
