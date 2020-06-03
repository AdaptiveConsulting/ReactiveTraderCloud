import React, { useEffect, useState } from 'react'
import { ThemeProvider } from 'styled-components'
import { Observable, ReplaySubject } from 'rxjs'
import { Provider as InteropProvider, getProvider } from 'rt-interop'
import { getPlatformAsync, Platform, PlatformProvider } from 'rt-platforms'
import { WsConnection, ServiceClient } from 'rt-system'
import { themes } from 'rt-theme'
import { BlotterService, TradesUpdate, PricingService } from 'apps/MainRoute'
import { Launcher } from './Launcher'
import {
  createServiceStub,
  PricingServiceProvider,
  ServiceStubProvider,
  TradeUpdatesProvider
} from './spotlight'

import { ReferenceDataProvider } from './spotlight/context'
import { referenceDataService } from 'apps/MainRoute/data/referenceData/referenceDataService'

const broker = new WsConnection(
  process.env.REACT_APP_BROKER_HOST || location.hostname,
  +(process.env.REACT_APP_BROKER_PORT || location.port)
)

type Dependencies = {
  platform: Platform
  pricingService: PricingService
  tradeUpdatesStream: Observable<TradesUpdate>
  serviceClient: ServiceClient
  referenceData: any
}

export const SimpleLauncher: React.FC = () => {
  const [dependencies, setDependencies] = useState<Dependencies>()
  const intentsProvider = getProvider()

  useEffect(() => {
    ; (async () => {
      const serviceClient = createServiceStub(broker)
      const platformResult = await getPlatformAsync()

      // blotter service
      const blotterService = new BlotterService(serviceClient)
      const blotterUpdates$ = blotterService.getTradesStream()
      const tradesUpdates$ = new ReplaySubject<TradesUpdate>()
      const referenceDataService$ = referenceDataService(serviceClient)
      blotterUpdates$.subscribe(tradesUpdates$)

      setDependencies({
        pricingService: new PricingService(serviceClient),
        tradeUpdatesStream: tradesUpdates$,
        serviceClient,
        platform: platformResult,
        referenceData: referenceDataService$
      })
    })()
  }, [])

  if (!dependencies) {
    return <></>
  }

  const {
    platform,
    pricingService,
    serviceClient,
    tradeUpdatesStream,
    referenceData
  } = dependencies

  if (!platform || !serviceClient) {
    return <></>
  }

  return (
    <ThemeProvider theme={themes.dark}>
      <InteropProvider value={intentsProvider}>
        <ServiceStubProvider value={serviceClient}>
          <TradeUpdatesProvider value={tradeUpdatesStream}>
            <PricingServiceProvider value={pricingService}>
              <ReferenceDataProvider value={referenceData}>
                <PlatformProvider value={platform}>
                  <Launcher />
                </PlatformProvider>
              </ReferenceDataProvider>
            </PricingServiceProvider>
          </TradeUpdatesProvider>
        </ServiceStubProvider>
      </InteropProvider>
    </ThemeProvider>
  )
}

export default SimpleLauncher
