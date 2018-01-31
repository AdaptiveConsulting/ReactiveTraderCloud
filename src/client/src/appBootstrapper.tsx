import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { User } from './types'
import createConnection from './system/service/connection'
import { OpenFin } from './system/openFin'
import { ShellContainer, OpenFinProvider } from './ui/shell'
import { Provider } from 'react-redux'
// TODO: change to import when webpack bug solved https://github.com/webpack/webpack/issues/4160
const config = require('config.json')

import {
  AnalyticsService,
  BlotterService,
  CompositeStatusService,
  ExecutionService,
  FakeUserRepository,
  PricingService,
  ReferenceDataService
} from './services'
import configureStore from './configureStore'

// When the application is run in openfin then 'fin' will be registered on the global window object.
declare const window: any

const connectSocket = () => {
  const user: User = FakeUserRepository.currentUser
  const realm = 'com.weareadaptive.reactivetrader'
  const url = config.overwriteServerEndpoint
    ? config.serverEndPointUrl
    : location.hostname
  const port = config.overwriteServerEndpoint
    ? config.serverPort
    : location.port
  return createConnection(user.code, url, realm, port)
}

const appBootstrapper = () => {
  const connection = connectSocket()
  // in a larger app you'd put a container in here (shameless plug: https://github.com/KeithWoods/microdi-js, but there are many offerings in this space).
  const openFin = new OpenFin()
  const refDataService = ReferenceDataService(connection)
  const pricingService = PricingService(connection)
  const blotterService = BlotterService(connection, refDataService)
  const execService = ExecutionService(connection, refDataService, openFin)
  const analyticsService = AnalyticsService(connection, refDataService)
  const compositeStatusService = CompositeStatusService(
    connection,
    pricingService,
    refDataService,
    blotterService,
    execService,
    analyticsService
  )
  // connect the underlying connection
  connection.connect()

  const store = configureStore(
    refDataService,
    blotterService,
    pricingService,
    analyticsService,
    compositeStatusService,
    execService,
    openFin
  )
  window.store = store
  ReactDOM.render(
    <Provider store={store}>
      <OpenFinProvider openFin={openFin}>
        <ShellContainer />
      </OpenFinProvider>
    </Provider>,
    document.getElementById('root')
  )
}

const runBootstrapper = location.pathname === '/' && location.hash.length === 0
// if we're not the root we (perhaps a popup) we never re-run the bootstrap logic
runBootstrapper && appBootstrapper()
