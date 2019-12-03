import { useEffect, useState } from 'react'
import { ServiceClient } from 'rt-system'

export const useServiceFactory = <T>(
  TCreator: { new(serviceStub: ServiceClient): T },
  serviceStub?: ServiceClient,
  useSingleInstance: boolean = false
): T | undefined => {
  const [service, setService] = useState<T | undefined>(undefined)

  useEffect(() => {
    if (!serviceStub) {
      return
    }
    const service = new TCreator(serviceStub)

    setService(service)
  }, [TCreator, serviceStub, useSingleInstance])

  return service
}
