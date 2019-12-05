import React, { useEffect, useState } from 'react'
import { ThemeProvider } from 'rt-theme'
import { Launcher } from './Launcher'
import { createServiceStub } from './spotlight/transport';
import { getPlatformAsync, Platform, PlatformProvider } from 'rt-platforms';
import { getFdc3, SpotlightFdc3 } from './spotlight/fdc3/fdc3';
import { AutobahnConnectionProxy, ServiceStubWithLoadBalancer } from 'rt-system';
import { Fdc3Provider } from './spotlight/fdc3/context';
import { PricingServiceProvider, ServiceStubProvider, TradeUpdatesProvider } from './spotlight/context';
import BlotterService, { TradesUpdate } from '../MainRoute/widgets/blotter/blotterService';
import { Observable, ReplaySubject } from 'rxjs';
import PricingService from '../MainRoute/widgets/spotTile/epics/pricingService';

const autobahn = new AutobahnConnectionProxy(
  process.env.REACT_APP_BROKER_HOST || location.hostname,
  'com.weareadaptive.reactivetrader',
  +(process.env.REACT_APP_BROKER_PORT || location.port),
)

type Dependencies = {
  platform: Platform,
  pricingService: PricingService,
  tradeUpdatesStream: Observable<TradesUpdate>,
  serviceStub: ServiceStubWithLoadBalancer,
  fdc3: SpotlightFdc3
}

export const SimpleLauncher: React.FC = () => {

  const [dependencies, setDependencies] = useState<Dependencies>()

  useEffect(() => {
    (async () => {
      const serviceStub = createServiceStub(autobahn)
      const platformResult = await getPlatformAsync()
      const fdc3 = await getFdc3()

      // blotter service
      const blotterService = new BlotterService(serviceStub)
      const blotterUpdates$ = blotterService.getTradesStream()
      const tradesUpdates$ = new ReplaySubject<TradesUpdate>();
      blotterUpdates$.subscribe(tradesUpdates$)

      setDependencies({
        pricingService: new PricingService(serviceStub),
        tradeUpdatesStream: tradesUpdates$,
        serviceStub,
        platform: platformResult,
        fdc3
      })
    })()
  }, [])

  if (!dependencies) {
    return <></>
  }

  const { fdc3, platform, pricingService, serviceStub, tradeUpdatesStream } = dependencies;

  if (!platform || !serviceStub || !fdc3) {
    return <></>
  }

  return (
    <ThemeProvider>
      <ServiceStubProvider value={serviceStub}>
        <TradeUpdatesProvider value={tradeUpdatesStream}>
          <PricingServiceProvider value={pricingService}>
            <Fdc3Provider value={fdc3}>
              <PlatformProvider value={platform}>
                <Launcher/>
              </PlatformProvider>
            </Fdc3Provider>
          </PricingServiceProvider>
        </TradeUpdatesProvider>
      </ServiceStubProvider>
    </ThemeProvider>
  )
}

export default SimpleLauncher
