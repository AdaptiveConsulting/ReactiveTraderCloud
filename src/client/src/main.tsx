import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { getEnvVars } from './config/config'
import { OpenFin } from './services/openFin'
import createConnection from './system/service/connection'
import { User } from './types'
import { OpenFinProvider, ShellContainer } from './ui/shell'

import { timer } from 'rxjs'
import { publishReplay, refCount } from 'rxjs/operators'
import configureStore from './configureStore'
import { connect, disconnect } from './connectionActions'
import {
  AnalyticsService,
  BlotterService,
  CompositeStatusService,
  ConnectionStatusService,
  ExecutionService,
  FakeUserRepository,
  PricingService,
  ReferenceDataService
} from './services'
import { logger } from './system'
import { ServiceClient } from './system/service'
import { serviceInstanceDictionaryStream$ } from './system/service/serviceStatusStream'

const log = logger.create('Application Service')

// When the application is run in openfin then 'fin' will be registered on the global window object.
declare const window: any

const config = getEnvVars(process.env.REACT_APP_ENV)

const connectSocket = () => {
  const user: User = FakeUserRepository.currentUser
  const realm = 'com.weareadaptive.reactivetrader'
  const url = config.overwriteServerEndpoint
    ? config.serverEndpointUrl
    : location.hostname
  const port = config.overwriteServerEndpoint
    ? config.serverPort
    : location.port
  return createConnection(user.code, url, realm, +port)
}

const HEARTBEAT_TIMEOUT = 3000
const APPLICATION_DISCONNECT = 15 * 60 * 1000

const appBootstrapper = () => {
  const connection = connectSocket()

  const serviceStatus$ = serviceInstanceDictionaryStream$(
    connection,
    HEARTBEAT_TIMEOUT
  ).pipe(publishReplay(1), refCount())

  const serviceClient = new ServiceClient(connection, serviceStatus$)

  const blotterService = new BlotterService(serviceClient)

  const pricingService = new PricingService(serviceClient)

  const refDataService = new ReferenceDataService(serviceClient)

  const openFin = new OpenFin()

  const execService = new ExecutionService(
    serviceClient,
    openFin.checkLimit.bind(openFin)
  )

  const analyticsService = new AnalyticsService(serviceClient)

  const compositeStatusService = new CompositeStatusService(serviceStatus$)

  const connectionStatusService = new ConnectionStatusService(connection)

  const isRunningInFinsemble = window.FSBL

  const store = configureStore(
    refDataService,
    blotterService,
    pricingService,
    analyticsService,
    compositeStatusService,
    connectionStatusService,
    execService,
    openFin
  )
  window.store = store
  ReactDOM.render(
    <Provider store={store}>
      <OpenFinProvider
        openFin={openFin}
        isRunningInFinsemble={isRunningInFinsemble}
      >
        <ShellContainer />
      </OpenFinProvider>
    </Provider>,
    document.getElementById('root')
  )

  store.dispatch(connect())

  timer(APPLICATION_DISCONNECT).subscribe(() => {
    store.dispatch(disconnect())
    log.warn(
      `Application has reached disconnection time at ${APPLICATION_DISCONNECT}`
    )
  })
}

const runBootstrapper = location.pathname === '/' && location.hash.length === 0

// if we're not the root we (perhaps a popup) we never re-run the bootstrap logic

export function run() {
  if (runBootstrapper) {
    appBootstrapper()
  }
}
