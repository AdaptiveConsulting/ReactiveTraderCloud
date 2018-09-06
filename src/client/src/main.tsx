import React from 'react'
import ReactDOM from 'react-dom'
import { Provider as ReduxProvider } from 'react-redux'
import { timer } from 'rxjs'

import { ConnectionActions } from 'rt-actions'
import { Environment } from 'rt-components'
import { AutobahnConnectionProxy, logger } from 'rt-system'
import { ThemeState } from 'rt-theme'
import { User } from 'rt-types'

import { Router } from 'shell'

import { createApplicationServices } from './applicationServices'
import { getEnvVars } from './config/config'
import configureStore from './configureStore'
import FakeUserRepository from './shell/fakeUserRepository'
import { OpenFin } from './shell/openFin'

// When the application is run in openfin then 'fin' will be registered on the global window object.
declare const window: any

const APPLICATION_DISCONNECT = 15 * 60 * 1000
const config = getEnvVars(process.env.REACT_APP_ENV!)

const log = logger.create('Application Service')

const openfin = new OpenFin()

const environment = {
  isDesktop: openfin.isPresent,
  openfin: openfin.isPresent ? openfin : null
}

export const run = () => {
  const user: User = FakeUserRepository.currentUser
  const realm = 'com.weareadaptive.reactivetrader'
  const url = config.overwriteServerEndpoint ? config.serverEndpointUrl : location.hostname
  const port = config.overwriteServerEndpoint ? config.serverPort : location.port

  const autobahn = new AutobahnConnectionProxy(url!, realm, +port!)

  const applicationDependencies = createApplicationServices(user, autobahn, openfin)

  const store = (window.store = configureStore(applicationDependencies))

  window.localStorage.themeName = window.localStorage.themeName || 'light'
  function updateLocalStorageThemeName(name: string) {
    window.localStorage.themeName = name
  }

  ReactDOM.render(
    <React.Fragment>
      {/* The below style tags are required to preload bold and bold-italic fonts */}
      <span style={{ fontWeight: 900 }} />
      <span style={{ fontWeight: 900, fontStyle: 'italic' }} />
      {/* Now back to our regularly scheduled programming 🎉 */}
      <ReduxProvider store={store}>
        <Environment.Provider value={environment}>
          <ThemeState.Provider name={window.localStorage.themeName} onChange={updateLocalStorageThemeName}>
            <Router />
          </ThemeState.Provider>
        </Environment.Provider>
      </ReduxProvider>
    </React.Fragment>,
    document.getElementById('root')
  )

  store.dispatch(ConnectionActions.connect())

  timer(APPLICATION_DISCONNECT).subscribe(() => {
    store.dispatch(ConnectionActions.disconnect())
    log.warn(`Application has reached disconnection time at ${APPLICATION_DISCONNECT}`)
  })
}
