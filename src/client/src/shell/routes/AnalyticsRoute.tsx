import React from 'react'
import { RouteWrapper } from 'rt-components'
import { AnalyticsContainer } from '../../ui/analytics'
import { styled } from 'rt-theme'

const AnalyticsStyle = styled.div`
  height: 100%;
  padding: 10px;
  background-color: ${({ theme }) => theme.core.darkBackground};
  overflow: auto;
`
const AnalyticsRoute = () => (
  <RouteWrapper>
    <AnalyticsStyle>
      <AnalyticsContainer />
    </AnalyticsStyle>
  </RouteWrapper>
)

export default AnalyticsRoute
