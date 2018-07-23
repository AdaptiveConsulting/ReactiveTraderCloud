import { from, ReplaySubject } from 'rxjs'
import { mergeMap, multicast, refCount, share } from 'rxjs/operators'
import { ConnectionStatusService, ExecutionService, OpenFin, PricingService, ReferenceDataService } from './services'
import { AutobahnConnection, ConnectionEvent, createConnection$, ServiceClient, ServiceStub } from './system'
import { ServiceCollectionMap } from './system/ServiceInstanceCollection'
import { serviceStatusStream$ } from './system/serviceStatusStream'
import { User } from './types'

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

  const pricingService = new PricingService(loadBalancedServiceStub)

  const referenceDataService = new ReferenceDataService(loadBalancedServiceStub)

  const executionService = new ExecutionService(loadBalancedServiceStub, openFin.checkLimit.bind(openFin))

  const connectionStatusService = new ConnectionStatusService(connection$)

  const pricesForCurrenciesInRefData = referenceDataService.getCurrencyPairUpdates$().pipe(
    mergeMap(refData =>
      from(Object.values(refData)).pipe(
        mergeMap(refDataForSymbol =>
          pricingService.getSpotPriceStream({
            symbol: refDataForSymbol.symbol
          })
        ),
        share()
      )
    )
  )

  return {
    referenceDataService,
    pricingService,
    connectionStatusService,
    executionService,
    openFin,
    pricesForCurrenciesInRefData,
    loadBalancedServiceStub,
    serviceStatus$
  }
}

export type ApplicationDependencies = ReturnType<typeof createApplicationServices>
