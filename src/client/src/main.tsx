import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { EnvironmentProvider } from 'rt-components'
import { User } from 'rt-types'
import { timer } from 'rxjs'
import { createApplicationServices } from './applicationServices'
import { getEnvVars } from './config/config'
import configureStore from './configureStore'
import { OpenFinProvider, ShellContainer } from './shell'
import { default as FakeUserRepository } from './shell/fakeUserRepository'
import { OpenFin } from './shell/openFin'
import { AutobahnConnectionProxy, logger } from './system'
import { ConnectionActions } from './ui/connectionStatus'

const log = logger.create('Application Service')

// When the application is run in openfin then 'fin' will be registered on the global window object.
declare const window: any

const config = getEnvVars(process.env.REACT_APP_ENV)

const APPLICATION_DISCONNECT = 15 * 60 * 1000

const openFin = new OpenFin()

//const isRunningInFinsemble = window.FSBL

const environmentContext = {
  isRunningDesktop: openFin.isRunningInOpenFin,
  openFin
}

const appBootstrapper = () => {
  const user: User = FakeUserRepository.currentUser
  const realm = 'com.weareadaptive.reactivetrader'
  const url = config.overwriteServerEndpoint ? config.serverEndpointUrl : location.hostname
  const port = config.overwriteServerEndpoint ? config.serverPort : location.port

  const autobahn = new AutobahnConnectionProxy(url, realm, +port)

  const applicationDependencies = createApplicationServices(user, autobahn, openFin)

  const store = configureStore(applicationDependencies)
  window.store = store

  ReactDOM.render(
    <Provider store={store}>
      <EnvironmentProvider value={environmentContext}>
        {openFin.isRunningInOpenFin ? (
          <OpenFinProvider openFin={openFin}>
            <ShellContainer />
          </OpenFinProvider>
        ) : (
          <ShellContainer />
        )}
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

const runBootstrapper = location.pathname === '/' && location.hash.length === 0

// if we're not the root we (perhaps a popup) we never re-run the bootstrap logic

export function run() {
  if (runBootstrapper) {
    appBootstrapper()
  }
}
