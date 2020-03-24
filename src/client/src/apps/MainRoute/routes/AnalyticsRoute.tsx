import React from 'react'
import { AnalyticsContainer } from '../widgets/analytics'
import { styled } from 'rt-theme'

const AnalyticsRouteStyle = styled.div`
  /*height offset is needed for openfin controls*/
  height: calc(100% - 24px);
  padding: 0 0.625rem 0rem 0.625rem;
  overflow-x: scroll;
  margin: auto;
`

const AnalyticsRoute = () => {
  return (
    <AnalyticsRouteStyle>
      <AnalyticsContainer inExternalWindow />
    </AnalyticsRouteStyle>
  )
}

export default AnalyticsRoute
