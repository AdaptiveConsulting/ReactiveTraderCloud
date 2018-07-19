import { from, ReplaySubject } from 'rxjs'
import { mergeMap, multicast, refCount, share } from 'rxjs/operators'
import {
  CompositeStatusService,
  ConnectionStatusService,
  ExecutionService,
  OpenFin,
  PricingService,
  ReferenceDataService
} from './services'
import { AutobahnConnection, ConnectionEvent, createConnection$, ServiceClient, ServiceStub } from './system'
import { ServiceCollectionMap } from './system/ServiceInstanceCollection'
import { serviceStatusStream$ } from './system/serviceStatusStream'
import { User } from './types'
import { AnalyticsService } from './ui/analytics'
import { BlotterService } from './ui/blotter'

const HEARTBEAT_TIMEOUT = 3000

export function createApplicationServices(user: User, autobahn: AutobahnConnection, openFin: OpenFin) {
  const connection$ = createConnection$(autobahn).pipe(
    multicast(() => {
      return new ReplaySubject<ConnectionEvent>(1)
    }),
    refCount()
  )

  const serviceStub = new ServiceStub(user.code, connection$)

  const serviceStatus$ = serviceStatusStream$(serviceStub, HEARTBEAT_TIMEOUT).pipe(
    multicast(() => {
      return new ReplaySubject<ServiceCollectionMap>(1)
    }),
    refCount()
  )

  const loadBalancedServiceStub = new ServiceClient(serviceStub, serviceStatus$)

  const blotterService = new BlotterService(loadBalancedServiceStub)

  const pricingService = new PricingService(loadBalancedServiceStub)

  const referenceDataService = new ReferenceDataService(loadBalancedServiceStub)

  const executionService = new ExecutionService(loadBalancedServiceStub, openFin.checkLimit.bind(openFin))

  const analyticsService = new AnalyticsService(loadBalancedServiceStub)

  const compositeStatusService = new CompositeStatusService(serviceStatus$)

  const connectionStatusService = new ConnectionStatusService(connection$)

  const pricesForCurrenciesInRefData = referenceDataService.getCurrencyPairUpdates$().pipe(
    mergeMap(refData =>
      from(refData.values()).pipe(
        mergeMap(refDataForSymbol =>
          pricingService.getSpotPriceStream({
            symbol: refDataForSymbol.symbol
          })
        ),
        share()
      )
    )
  )

  const dependencies = {
    referenceDataService,
    blotterService,
    pricingService,
    analyticsService,
    compositeStatusService,
    connectionStatusService,
    executionService,
    openFin,
    pricesForCurrenciesInRefData
  }

  return dependencies
}

export type ApplicationDependencies = ReturnType<typeof createApplicationServices>
