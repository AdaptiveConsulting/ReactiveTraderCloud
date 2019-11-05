import React, { useContext } from 'react'
import { ServiceStubWithLoadBalancer } from 'rt-system'

const ServiceStubContext = React.createContext<ServiceStubWithLoadBalancer | undefined>(undefined)
export const { Provider: ServiceStubProvider } = ServiceStubContext

export function useServiceStub() {
  return useContext(ServiceStubContext)
}
