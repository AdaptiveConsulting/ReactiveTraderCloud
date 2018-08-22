import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { timer } from 'rxjs'

import { ConnectionActions } from 'rt-actions'
import { EnvironmentProvider, OpenFinContext } from 'rt-components'
import { AutobahnConnectionProxy, logger } from 'rt-system'
import { ThemeState } from 'rt-theme'
import { User } from 'rt-types'

import { Router } from 'shell'

import { createApplicationServices } from './applicationServices'
import { getEnvVars } from './config/config'
import configureStore from './configureStore'
import FakeUserRepository from './shell/fakeUserRepository'
import { OpenFin } from './shell/openFin'

const log = logger.create('Application Service')

// When the application is run in openfin then 'fin' will be registered on the global window object.
declare const window: any

const config = getEnvVars(process.env.REACT_APP_ENV!)

const APPLICATION_DISCONNECT = 15 * 60 * 1000

const openFin = new OpenFin()

//const isRunningInFinsemble = window.FSBL

const environmentContext = {
  isRunningDesktop: openFin.isRunningInOpenFin,
  openFin
}

export const run = () => {
  const user: User = FakeUserRepository.currentUser
  const realm = 'com.weareadaptive.reactivetrader'
  const url = config.overwriteServerEndpoint ? config.serverEndpointUrl : location.hostname
  const port = config.overwriteServerEndpoint ? config.serverPort : location.port

  const autobahn = new AutobahnConnectionProxy(url!, realm, +port!)

  const applicationDependencies = createApplicationServices(user, autobahn, openFin)

  const store = (window.store = configureStore(applicationDependencies))

  window.localStorage.themeName = window.localStorage.themeName || 'light'
  function updateLocalStorageThemeName(name) {
    window.localStorage.themeName = name
  }

  ReactDOM.render(
    <Provider store={store}>
      <EnvironmentProvider value={environmentContext}>
        <ThemeState.Provider name={window.localStorage.themeName} onChange={updateLocalStorageThemeName}>
          <OpenFinContext.Provider value={openFin.isRunningInOpenFin ? openFin : null}>
            <Router />
          </OpenFinContext.Provider>
        </ThemeState.Provider>
      </EnvironmentProvider>
    </Provider>,
    document.getElementById('root')
  )

  store.dispatch(ConnectionActions.connect())

  timer(APPLICATION_DISCONNECT).subscribe(() => {
    store.dispatch(ConnectionActions.disconnect())
    log.warn(`Application has reached disconnection time at ${APPLICATION_DISCONNECT}`)
  })
}
