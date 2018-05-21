import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { ReplaySubject, timer } from 'rxjs'
import { multicast, publishReplay, refCount } from 'rxjs/operators'
import { getEnvVars } from './config/config'
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
import { OpenFin } from './services/openFin'
import { logger, ServiceStub } from './system'
import { ServiceClient } from './system'
import { AutobahnConnectionProxy } from './system'
import { ServiceCollectionMap } from './system'
import { ConnectionEvent, createConnection$ } from './system/connectionStream'
import { serviceStatusStream$ } from './system/serviceStatusStream'
import { User } from './types'
import { OpenFinProvider, ShellContainer } from './ui/shell'

const log = logger.create('Application Service')

// When the application is run in openfin then 'fin' will be registered on the global window object.
declare const window: any

const config = getEnvVars(process.env.REACT_APP_ENV)

const connectSocket = () => {}

const HEARTBEAT_TIMEOUT = 3000
const APPLICATION_DISCONNECT = 15 * 60 * 1000

const appBootstrapper = () => {
  const user: User = FakeUserRepository.currentUser
  const realm = 'com.weareadaptive.reactivetrader'
  const url = config.overwriteServerEndpoint
    ? config.serverEndpointUrl
    : location.hostname
  const port = config.overwriteServerEndpoint
    ? config.serverPort
    : location.port

  const autobahn = new AutobahnConnectionProxy(url, realm, +port)

  const connection$ = createConnection$(autobahn).pipe(
    multicast(() => {
      return new ReplaySubject<ConnectionEvent>(1)
    }),
    refCount()
  )

  const serviceStub = new ServiceStub(user.code, connection$)

  const serviceStatus$ = serviceStatusStream$(
    serviceStub,
    HEARTBEAT_TIMEOUT
  ).pipe(
    multicast(() => {
      return new ReplaySubject<ServiceCollectionMap>(1)
    }),
    refCount()
  )

  const loadBalancedServiceStub = new ServiceClient(serviceStub, serviceStatus$)

  const blotterService = new BlotterService(loadBalancedServiceStub)

  const pricingService = new PricingService(loadBalancedServiceStub)

  const refDataService = new ReferenceDataService(loadBalancedServiceStub)

  const openFin = new OpenFin()

  const execService = new ExecutionService(
    loadBalancedServiceStub,
    openFin.checkLimit.bind(openFin)
  )

  const analyticsService = new AnalyticsService(loadBalancedServiceStub)

  const compositeStatusService = new CompositeStatusService(serviceStatus$)

  const connectionStatusService = new ConnectionStatusService(connection$)

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
