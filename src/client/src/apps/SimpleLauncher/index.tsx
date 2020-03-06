import React, { useEffect, useState } from 'react'
import { ThemeProvider } from 'rt-theme'
import { Launcher } from './Launcher'
import { createServiceStub } from './spotlight/transport'
import { getPlatformAsync, Platform, PlatformProvider } from 'rt-platforms'
import { AutobahnConnectionProxy, ServiceStubWithLoadBalancer } from 'rt-system'
import {
  PricingServiceProvider,
  ServiceStubProvider,
  TradeUpdatesProvider,
} from './spotlight/context'
import BlotterService, { TradesUpdate } from '../MainRoute/widgets/blotter/blotterService'
import { Observable, ReplaySubject } from 'rxjs'
import PricingService from '../MainRoute/widgets/spotTile/epics/pricingService'

const autobahn = new AutobahnConnectionProxy(
  process.env.REACT_APP_BROKER_HOST || location.hostname,
  'com.weareadaptive.reactivetrader',
  +(process.env.REACT_APP_BROKER_PORT || location.port),
)

type Dependencies = {
  platform: Platform
  pricingService: PricingService
  tradeUpdatesStream: Observable<TradesUpdate>
  serviceStub: ServiceStubWithLoadBalancer
}

export const SimpleLauncher: React.FC = () => {
  const [dependencies, setDependencies] = useState<Dependencies>()

  useEffect(() => {
    ;(async () => {
      const serviceStub = createServiceStub(autobahn)
      const platformResult = await getPlatformAsync()

      // blotter service
      const blotterService = new BlotterService(serviceStub)
      const blotterUpdates$ = blotterService.getTradesStream()
      const tradesUpdates$ = new ReplaySubject<TradesUpdate>()
      blotterUpdates$.subscribe(tradesUpdates$)

      setDependencies({
        pricingService: new PricingService(serviceStub),
        tradeUpdatesStream: tradesUpdates$,
        serviceStub,
        platform: platformResult,
      })
    })()
  }, [])

  if (!dependencies) {
    return <></>
  }

  const { platform, pricingService, serviceStub, tradeUpdatesStream } = dependencies

  if (!platform || !serviceStub) {
    return <></>
  }

  return (
    <ThemeProvider>
      <ServiceStubProvider value={serviceStub}>
        <TradeUpdatesProvider value={tradeUpdatesStream}>
          <PricingServiceProvider value={pricingService}>
            <PlatformProvider value={platform}>
              <Launcher />
            </PlatformProvider>
          </PricingServiceProvider>
        </TradeUpdatesProvider>
      </ServiceStubProvider>
    </ThemeProvider>
  )
}

export default SimpleLauncher
