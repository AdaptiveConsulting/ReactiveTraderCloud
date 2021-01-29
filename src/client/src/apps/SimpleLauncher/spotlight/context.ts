import React from 'react'
import { Observable } from 'rxjs'
import { ServiceClient } from 'rt-system'
import { ExecutionService, PricingService, TradesUpdate } from 'apps/MainRoute'

export const ServiceStubContext = React.createContext<ServiceClient | undefined>(undefined)
export const { Provider: ServiceStubProvider } = ServiceStubContext

export const PricingServiceContext = React.createContext<PricingService | undefined>(undefined)
export const { Provider: PricingServiceProvider } = PricingServiceContext

// stream of trade updates
export const TradeUpdatesContext = React.createContext<Observable<TradesUpdate> | undefined>(
  undefined
)
export const { Provider: TradeUpdatesProvider } = TradeUpdatesContext

export const ReferenceDataContext = React.createContext<Observable<any> | undefined>(undefined)
export const { Provider: ReferenceDataProvider } = ReferenceDataContext

//TODO: Add Types
export const TradeExecutionContext = React.createContext<ExecutionService | undefined>(undefined)
export const { Provider: TradeExecutionProvider } = TradeExecutionContext
