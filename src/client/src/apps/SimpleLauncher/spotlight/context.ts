import React from 'react'
import { Observable } from 'rxjs'
import { ServiceStubWithLoadBalancer } from 'rt-system'
import { PricingService, TradesUpdate } from 'apps/MainRoute'

export const ServiceStubContext = React.createContext<ServiceStubWithLoadBalancer | undefined>(
  undefined,
)
export const { Provider: ServiceStubProvider } = ServiceStubContext

export const PricingServiceContext = React.createContext<PricingService | undefined>(undefined)
export const { Provider: PricingServiceProvider } = PricingServiceContext

// stream of trade updates
export const TradeUpdatesContext = React.createContext<Observable<TradesUpdate> | undefined>(
  undefined,
)
export const { Provider: TradeUpdatesProvider } = TradeUpdatesContext
