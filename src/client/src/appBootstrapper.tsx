import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { ServiceConst, User } from './types'
import SchedulerService from './system/schedulerService'
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
  _connection: Connection
  _referenceDataService: ReferenceDataService
  _pricingService: PricingService
  _blotterService: BlotterService
  _executionService: ExecutionService
  _analyticsService: AnalyticsService
  _compositeStatusService: CompositeStatusService
  _schedulerService: SchedulerService
  _openFin: any
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
      this._referenceDataService,
      this._blotterService,
      this._pricingService,
      this._analyticsService,
      this._compositeStatusService,
      this._executionService,
      this._openFin,
    )

    this.displayUi()
  }

  startServices() {
    const user: User = FakeUserRepository.currentUser
    const realm = 'com.weareadaptive.reactivetrader'
    const url = this.endpointURL
    const port = this.endpointPort

    this._schedulerService = new SchedulerService()
    this._connection = new Connection(
      user.code,
      new AutobahnConnectionProxy(url, realm, port),
      this._schedulerService,
    )

    // in a larger app you'd put a container in here (shameless plug: https://github.com/KeithWoods/microdi-js, but there are many offerings in this space).
    this._openFin = new OpenFin()
    this._referenceDataService = new ReferenceDataService(ServiceConst.ReferenceServiceKey, this._connection, this._schedulerService)
    this._pricingService = new PricingService(ServiceConst.PricingServiceKey, this._connection, this._schedulerService)
    this._blotterService = new BlotterService(ServiceConst.BlotterServiceKey, this._connection, this._schedulerService, this._referenceDataService)
    this._executionService = new ExecutionService(ServiceConst.ExecutionServiceKey, this._connection, this._schedulerService, this._referenceDataService, this._openFin)
    this._analyticsService = new AnalyticsService(ServiceConst.AnalyticsServiceKey, this._connection, this._schedulerService, this._referenceDataService)
    this._compositeStatusService = new CompositeStatusService(this._connection, this._pricingService, this._referenceDataService, this._blotterService, this._executionService, this._analyticsService)

    // connect/load all the services
    this._pricingService.connect()
    this._blotterService.connect()
    this._executionService.connect()
    this._analyticsService.connect()
    this._referenceDataService.connect()
    this._compositeStatusService.start()
    // and finally the underlying connection
    this._connection.connect()
  }

  displayUi() {
    const store = this.store
    window.store = store
    ReactDOM.render(
      <Provider store={store}>
        <OpenFinProvider openFin={this._openFin}>
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
