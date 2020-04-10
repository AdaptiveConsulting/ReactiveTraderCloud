import React, { lazy, Suspense } from 'react'
import ReactDOM from 'react-dom'
import ReactGA from 'react-ga'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { GlobalStyle } from 'rt-theme'
import * as serviceWorker from './serviceWorker'
import { getSymphonyPlatform } from 'rt-platforms'
import { getEnvironment } from 'rt-util/getEnvironment'

const MainRoute = lazy(() => import('./apps/MainRoute'))
const StyleguideRoute = lazy(() => import('./apps/StyleguideRoute'))
const SimpleLauncher = lazy(() => import('./apps/SimpleLauncher'))

//TODO: Move to environment variables / config.
const trackingId = 'UA-46320965-5'
ReactGA.initialize(trackingId, {
  debug: process.env.NODE_ENV === 'development',
})

const { pathname } = new URL(window.location.href)
const urlParams = new URLSearchParams(window.location.search)

const APP_PATHS = {
  LAUNCHER: '/launcher',
  TRADER: '/',
  STYLEGUIDE: '/styleguide',
}

const envTitles = {
  localhost: '(LOCAL)',
  dev: '(DEV)',
  uat: '(UAT)',
  demo: '',
  unknown: '(UNKNOWN)',
}

const appTitles = {
  [APP_PATHS.LAUNCHER]: 'Reactive Ecosystem Launcher',
  [APP_PATHS.TRADER]: 'Reactive Trader Cloud',
  [APP_PATHS.STYLEGUIDE]: 'Style Guide for Reactive Trader',
}

async function init() {
  console.info('BUILD_VERSION: ', process.env.REACT_APP_BUILD_VERSION)

  const env = getEnvironment()

  document.title = `${appTitles[pathname] || document.title} ${envTitles[env || 'unknown']}`

  ReactGA.set({
    dimension3: env,
    page: window.location.pathname,
  })

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
              <Route path={APP_PATHS.LAUNCHER} render={() => <SimpleLauncher />} />
              <Route path={APP_PATHS.STYLEGUIDE} render={() => <StyleguideRoute />} />
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
    serviceWorker.unregister()
  }
}

init()
