import React from 'react'
import Helmet from 'react-helmet'
import { Provider as ReduxProvider } from 'react-redux'
import { platform, PlatformProvider } from 'rt-components'
import { ThemeProvider } from 'rt-theme'
import { Router } from './data'
import GlobalScrollbarStyle from './GlobalScrollbarStyle'
import { store } from './store'

const MainRoute = () => (
  <React.Fragment>
    <Helmet>
      <link
        rel="stylesheet"
        type="text/css"
        href="https://use.fontawesome.com/releases/v5.2.0/css/all.css"
      />
    </Helmet>
    <ThemeProvider>
      <ReduxProvider store={store}>
        <PlatformProvider value={platform}>
          <React.Fragment>
            <GlobalScrollbarStyle />
            <Router />
          </React.Fragment>
        </PlatformProvider>
      </ReduxProvider>
    </ThemeProvider>
  </React.Fragment>
)

export default MainRoute
