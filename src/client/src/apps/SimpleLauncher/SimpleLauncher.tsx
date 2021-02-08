import React, { useEffect, useState } from 'react'
import { ThemeProvider } from 'styled-components/macro'
import { Observable, ReplaySubject } from 'rxjs'
import { Provider as InteropProvider, getProvider } from 'rt-interop'
import { getPlatformAsync, Platform, PlatformProvider, createLimitChecker } from 'rt-platforms'
import { WsConnection, ServiceClient } from 'rt-system'
import { themes } from 'rt-theme'
import { BlotterService, TradesUpdate, PricingService, ExecutionService } from 'apps/MainRoute'
import { Launcher } from './Launcher'
import {
  createServiceStub,
  PricingServiceProvider,
  ServiceStubProvider,
  TradeUpdatesProvider,
  TradeExecutionProvider,
} from './spotlight'

import { ReferenceDataProvider } from './spotlight/context'
import { referenceDataService } from 'apps/MainRoute/data/referenceData/referenceDataService'
import { getAppName } from 'rt-util'
import Helmet from 'react-helmet'

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
  executionService: ExecutionService
}

export const SimpleLauncher: React.FC = () => {
  const [dependencies, setDependencies] = useState<Dependencies>()
  const intentsProvider = getProvider()

  useEffect(() => {
    ;(async () => {
      const serviceClient = createServiceStub(broker)
      const platformResult = await getPlatformAsync()
      const limitChecker = await createLimitChecker('openfin')

      platformResult.window.show()

      // blotter service
      const blotterService = new BlotterService(serviceClient)
      const blotterUpdates$ = blotterService.getTradesStream()
      const tradesUpdates$ = new ReplaySubject<TradesUpdate>()
      const referenceDataService$ = referenceDataService(serviceClient)
      const executionService = new ExecutionService(serviceClient, (test: any) => {
        return limitChecker.rpc({
          tradedCurrencyPair: test.CurrencyPair,
          notional: test.Notional,
          rate: test.SpotRate,
        })
      })
      
      blotterUpdates$.subscribe(tradesUpdates$)

      setDependencies({
        pricingService: new PricingService(serviceClient),
        tradeUpdatesStream: tradesUpdates$,
        serviceClient,
        platform: platformResult,
        referenceData: referenceDataService$,
        executionService: executionService,
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
    referenceData,
    executionService,
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
                <TradeExecutionProvider value={executionService}>
                  <PlatformProvider value={platform}>
                    <Helmet title={getAppName('Reactive Launcher')} />
                    <Launcher />
                  </PlatformProvider>
                </TradeExecutionProvider>
              </ReferenceDataProvider>
            </PricingServiceProvider>
          </TradeUpdatesProvider>
        </ServiceStubProvider>
      </InteropProvider>
    </ThemeProvider>
  )
}

export default SimpleLauncher
