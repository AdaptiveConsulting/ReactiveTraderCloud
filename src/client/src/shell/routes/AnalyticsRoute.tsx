import React from 'react'
import { RouteWrapper } from 'rt-components'
import { AnalyticsContainer } from '../../ui/analytics'
import { styled } from 'rt-theme'

const AnalyticsRouteStyle = styled.div`
  max-width: 25rem;
  height: calc(100% - (21px + 0.625rem)); // minus chrome header and top padding
  padding: 0.625rem;
  margin: auto;
`
const AnalyticsRoute = () => (
  <RouteWrapper>
    <AnalyticsRouteStyle>
      <AnalyticsContainer />
    </AnalyticsRouteStyle>
  </RouteWrapper>
)

export default AnalyticsRoute
