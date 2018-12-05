import React from 'react'
import { RouteWrapper } from 'rt-components'
import { AnalyticsContainer } from '../../ui/analytics'
import { ThemeProvider } from 'rt-theme'

const BlotterRoute = () => (
  <RouteWrapper>
    <ThemeProvider theme={theme => theme.analytics}>
      <AnalyticsContainer />
    </ThemeProvider>
  </RouteWrapper>
)

export default BlotterRoute
