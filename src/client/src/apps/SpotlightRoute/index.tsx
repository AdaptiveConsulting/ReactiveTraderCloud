import React, { useEffect, useState } from 'react'
import { ThemeProvider } from 'rt-theme'
import { getPlatformAsync, PlatformProvider } from 'rt-platforms'
import { Spotlight } from './Spotlight'
import { AutobahnConnectionProxy } from 'rt-system'
import { createServiceStub } from './transport'
import { ServiceStubProvider } from './context'

const autobahn = new AutobahnConnectionProxy(
  process.env.REACT_APP_BROKER_HOST || location.hostname,
  'com.weareadaptive.reactivetrader',
  +(process.env.REACT_APP_BROKER_PORT || location.port),
)

export default function SpotlightRoute() {
  const [platform, setPlatform] = useState(null)
  const [serviceStub, setServiceStub] = useState(null)

  useEffect(() => {
    const bootstrap = async () => {
      const serviceStubResult = createServiceStub(autobahn)
      const platformResult = await getPlatformAsync()
      setServiceStub(serviceStubResult)
      setPlatform(platformResult)
    }

    bootstrap()
  }, [])

  return (
    platform && serviceStub && (
      <ThemeProvider>
        <ServiceStubProvider value={serviceStub}>
          <PlatformProvider value={platform}>
            <Spotlight/>
          </PlatformProvider>
        </ServiceStubProvider>
      </ThemeProvider>
    )
  )
}
