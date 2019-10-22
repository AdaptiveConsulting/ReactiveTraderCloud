import React, { useEffect, useState } from 'react'
import { ThemeProvider } from 'rt-theme'
import { getPlatformAsync, PlatformProvider } from 'rt-platforms'
import { Spotlight } from './Spotlight'
import { AutobahnConnectionProxy } from 'rt-system'
import { createServiceStub } from './transport'
import { ServiceStubProvider } from './context'
import { getFdc3 } from './fdc3/fdc3'
import { Fdc3Provider } from './fdc3/context'

const autobahn = new AutobahnConnectionProxy(
  process.env.REACT_APP_BROKER_HOST || location.hostname,
  'com.weareadaptive.reactivetrader',
  +(process.env.REACT_APP_BROKER_PORT || location.port),
)

export default function SpotlightRoute() {
  const [platform, setPlatform] = useState(null)
  const [fdc3, setFdc3] = useState(null)
  const [serviceStub, setServiceStub] = useState(null)

  useEffect(() => {
    const bootstrap = async () => {
      const serviceStubResult = createServiceStub(autobahn)
      const platformResult = await getPlatformAsync()
      const fdc3Result = await getFdc3()
      setServiceStub(serviceStubResult)
      setPlatform(platformResult)
      setFdc3(fdc3Result)
    }

    bootstrap()
  }, [])

  return (
    platform &&
    serviceStub &&
    fdc3 && (
      <ThemeProvider>
        <ServiceStubProvider value={serviceStub}>
          <Fdc3Provider value={fdc3}>
            <PlatformProvider value={platform}>
              <Spotlight />
            </PlatformProvider>
          </Fdc3Provider>
        </ServiceStubProvider>
      </ThemeProvider>
    )
  )
}
