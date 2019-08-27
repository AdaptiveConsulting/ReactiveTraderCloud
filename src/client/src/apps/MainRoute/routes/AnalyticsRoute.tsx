import React from 'react'
import { OPENFIN_CHROME_HEADER_HEIGHT } from 'rt-components'
import { AnalyticsContainer } from '../widgets/analytics'
import { styled } from 'rt-theme'

const AnalyticsRouteStyle = styled.div`
  max-width: 25rem;
  height: calc(100% - ${OPENFIN_CHROME_HEADER_HEIGHT});
  padding: 0.625rem;
  margin: auto;
`
const AnalyticsRoute = () => (
  <AnalyticsRouteStyle>
    <AnalyticsContainer />
  </AnalyticsRouteStyle>
)

export default AnalyticsRoute
