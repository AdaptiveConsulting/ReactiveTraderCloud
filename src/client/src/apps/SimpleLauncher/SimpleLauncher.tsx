import React, { useEffect, useState } from 'react'
import { ThemeProvider } from 'styled-components'
import { Observable, ReplaySubject } from 'rxjs'
import { Provider as InteropProvider, getProvider } from 'rt-interop'
import { getPlatformAsync, Platform, PlatformProvider } from 'rt-platforms'
import { AutobahnConnectionProxy, ServiceStubWithLoadBalancer } from 'rt-system'
import { themes } from 'rt-theme'
import { BlotterService, TradesUpdate, PricingService } from 'apps/MainRoute'
import { Launcher } from './Launcher'
import {
  createServiceStub,
  PricingServiceProvider,
  ServiceStubProvider,
  TradeUpdatesProvider,
} from './spotlight'

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
  const intentsProvider = getProvider()

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
    <ThemeProvider theme={themes.dark}>
      <InteropProvider value={intentsProvider}>
        <ServiceStubProvider value={serviceStub}>
          <TradeUpdatesProvider value={tradeUpdatesStream}>
            <PricingServiceProvider value={pricingService}>
              <PlatformProvider value={platform}>
                <Launcher />
              </PlatformProvider>
            </PricingServiceProvider>
          </TradeUpdatesProvider>
        </ServiceStubProvider>
      </InteropProvider>
    </ThemeProvider>
  )
}

export default SimpleLauncher
