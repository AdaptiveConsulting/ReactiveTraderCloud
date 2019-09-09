import React from 'react'
import { AnalyticsContainer } from '../widgets/analytics'
import { styled } from 'rt-theme'

const AnalyticsRouteStyle = styled.div`
  height: calc(100% - 21px);
  padding: 0.625rem 0.625rem 0rem 0.625rem;
  overflow-x: scroll;
  margin: auto;
`

const AnalyticsRoute = () => {
  return (
    <AnalyticsRouteStyle>
      <AnalyticsContainer inExternalWindow={true} />
    </AnalyticsRouteStyle>
  )
}

export default AnalyticsRoute
