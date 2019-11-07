import React, { lazy, Suspense } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { GlobalStyle } from 'rt-theme'
import * as serviceWorker from './serviceWorker'
import { getSymphonyPlatform } from 'rt-platforms'

const MainRoute = lazy(() => import('./apps/MainRoute'))
const StyleguideRoute = lazy(() => import('./apps/StyleguideRoute'))
const SimpleLauncher = lazy(() => import('./apps/SimpleLauncher'))
const SpotlightRoute = lazy(() => import('./apps/SpotlightRoute'))

const urlParams = new URLSearchParams(window.location.search)

async function init() {
  console.info('BUILD_VERSION: ', process.env.REACT_APP_BUILD_VERSION)

  if (urlParams.has('startAsSymphonyController')) {
    const { initiateSymphony } = await getSymphonyPlatform()
    await initiateSymphony(urlParams.get('env') || undefined)
  } else {
    ReactDOM.render(
      <React.Fragment>
        <GlobalStyle />
        <BrowserRouter>
          <Suspense fallback={<div />}>
            <Switch>
              <Route path="/launcher" render={() => <SimpleLauncher />} />
              <Route path="/styleguide" render={() => <StyleguideRoute />} />
              <Route path="/spotlight" render={() => <SpotlightRoute />} />
              <Route render={() => <MainRoute />} />
            </Switch>
          </Suspense>
        </BrowserRouter>
      </React.Fragment>,
      document.getElementById('root'),
    )

    // If you want your app to work offline and load faster, you can change
    // unregister() to register() below. Note this comes with some pitfalls.
    // Learn more about service workers: https://bit.ly/CRA-PWA
    serviceWorker.register()
  }
}

init()
