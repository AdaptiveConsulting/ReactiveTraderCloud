import React, { useEffect, useState } from 'react'
import { ThemeProvider } from 'rt-theme'

import { Launcher } from './Launcher'
import { createServiceStub } from './spotlight/transport';
import { getPlatformAsync, PlatformProvider } from 'rt-platforms';
import { getFdc3 } from './spotlight/fdc3/fdc3';
import { AutobahnConnectionProxy } from '../../rt-system';
import { Fdc3Provider } from './spotlight/fdc3/context';
import { TradeUpdatesProvider, PricingServiceProvider, ServiceStubProvider } from './spotlight/context';
import BlotterService, { TradesUpdate } from '../MainRoute/widgets/blotter/blotterService';
import { Observable, ReplaySubject } from 'rxjs';
import PricingService from '../MainRoute/widgets/spotTile/epics/pricingService';

const autobahn = new AutobahnConnectionProxy(
  process.env.REACT_APP_BROKER_HOST || location.hostname,
  'com.weareadaptive.reactivetrader',
  +(process.env.REACT_APP_BROKER_PORT || location.port),
)

export const SimpleLauncher: React.FC = () => {

  const [platform, setPlatform] = useState()
  const [fdc3, setFdc3] = useState()
  const [serviceStub, setServiceStub] = useState()
  const [pricingService, setPricingService] = useState<PricingService>()
  const [tradesUpdates, setTradeUpdates] = useState<Observable<TradesUpdate>>()

  useEffect(() => {
    const bootstrap = async () => {
      const serviceStubResult = createServiceStub(autobahn)
      const platformResult = await getPlatformAsync()
      const fdc3Result = await getFdc3()

      // blotter service
      const blotterService = new BlotterService(serviceStubResult)
      const blotterUpdates$ = blotterService.getTradesStream()
      const tradesUpdates$ = new ReplaySubject<TradesUpdate>();
      blotterUpdates$.subscribe(tradesUpdates$)
      setTradeUpdates(tradesUpdates$)

      // pricing service
      setPricingService(new PricingService(serviceStubResult))

      setServiceStub(serviceStubResult)
      setPlatform(platformResult)
      setFdc3(fdc3Result)
    }

    bootstrap()
  }, [])

  if (!platform || !serviceStub || !fdc3) {
    return <></>
  }

  return (
    <ThemeProvider>
      <ServiceStubProvider value={serviceStub}>
        <TradeUpdatesProvider value={tradesUpdates}>
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
