import React from 'react'
import Helmet from 'react-helmet'
import { Provider as ReduxProvider } from 'react-redux'
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
        <React.Fragment>
          <GlobalScrollbarStyle />
          <Router />
        </React.Fragment>
      </ReduxProvider>
    </ThemeProvider>
  </React.Fragment>
)

export default MainRoute
