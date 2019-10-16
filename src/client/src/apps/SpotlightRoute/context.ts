import React, { useContext } from 'react'
import { ServiceStubWithLoadBalancer } from 'rt-system'

const ServiceStubContext = React.createContext<ServiceStubWithLoadBalancer>(null)
export const { Provider: ServiceStubProvider } = ServiceStubContext

export function useServiceStub() {
  return useContext(ServiceStubContext)
}
