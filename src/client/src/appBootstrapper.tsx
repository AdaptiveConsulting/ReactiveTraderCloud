import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { ServiceConst, User } from './types'
import AutobahnConnectionProxy from './system/service/autobahnConnectionProxy'
import Connection from './system/service/connection'
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
  ReferenceDataService,
} from './services'
import configureStore from './configureStore'

// When the application is run in openfin then 'fin' will be registered on the global window object.
declare const window: any

class AppBootstrapper {
  connection: Connection
  referenceDataService: ReferenceDataService
  pricingService: PricingService
  blotterService: BlotterService
  executionService: ExecutionService
  analyticsService: AnalyticsService
  compositeStatusService: CompositeStatusService
  openFin: any
  store: any

  get endpointURL() {
    return config.overwriteServerEndpoint ? config.serverEndPointUrl : location.hostname
  }

  get endpointPort() {
    return config.overwriteServerEndpoint ? config.serverPort : location.port
  }

  run() {
    this.startServices()
    this.store = configureStore(
      this.referenceDataService,
      this.blotterService,
      this.pricingService,
      this.analyticsService,
      this.compositeStatusService,
      this.executionService,
      this.openFin,
    )

    this.displayUi()
  }

  startServices() {
    const user: User = FakeUserRepository.currentUser
    const realm = 'com.weareadaptive.reactivetrader'
    const url = this.endpointURL
    const port = this.endpointPort

    this.connection = new Connection(
      user.code,
      new AutobahnConnectionProxy(url, realm, port),
    )

    // in a larger app you'd put a container in here (shameless plug: https://github.com/KeithWoods/microdi-js, but there are many offerings in this space).
    this.openFin = new OpenFin()
    this.referenceDataService = new ReferenceDataService(ServiceConst.ReferenceServiceKey, this.connection)
    this.pricingService = new PricingService(ServiceConst.PricingServiceKey, this.connection)
    this.blotterService = new BlotterService(ServiceConst.BlotterServiceKey, this.connection, this.referenceDataService)
    this.executionService = new ExecutionService(ServiceConst.ExecutionServiceKey, this.connection, this.referenceDataService, this.openFin)
    this.analyticsService = new AnalyticsService(ServiceConst.AnalyticsServiceKey, this.connection, this.referenceDataService)
    this.compositeStatusService = new CompositeStatusService(this.connection, this.pricingService, this.referenceDataService, this.blotterService, this.executionService, this.analyticsService)

    // connect/load all the services
    this.pricingService.connect()
    this.blotterService.connect()
    this.executionService.connect()
    this.analyticsService.connect()
    this.referenceDataService.connect()
    this.compositeStatusService.start()
    // and finally the underlying connection
    this.connection.connect()
  }

  displayUi() {
    const store = this.store
    window.store = store
    ReactDOM.render(
      <Provider store={store}>
        <OpenFinProvider openFin={this.openFin}>
          <ShellContainer/>
        </OpenFinProvider>
      </Provider>,
      document.getElementById('root'),
    )
  }
}

const runBootstrapper = location.pathname === '/' && location.hash.length === 0
// if we're not the root we (perhaps a popup) we never re-run the bootstrap logic
if (runBootstrapper) {
  new AppBootstrapper().run()
}
