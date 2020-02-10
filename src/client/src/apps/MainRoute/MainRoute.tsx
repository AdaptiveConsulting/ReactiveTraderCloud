import React, { useEffect, useState } from 'react'
import Helmet from 'react-helmet'
import { Provider as ReduxProvider } from 'react-redux'
import { DateTime } from 'luxon'
import { getPlatformAsync, PlatformProvider } from 'rt-platforms'
import { ThemeProvider } from 'rt-theme'
import { Provider as InteropProvider, getProvider } from 'rt-interop'
import { Router } from './data'
import GlobalScrollbarStyle from './GlobalScrollbarStyle'
import { createStore } from './store'

const MainRoute = () => {
  const [platform, setPlatform] = useState()
  const [store, setStore] = useState()
  const intentsProvider = getProvider()

  useEffect(() => {
    const getPlatform = async () => {
      const runningPlatform = await getPlatformAsync()
      const store = await createStore(runningPlatform)
      setPlatform(runningPlatform)
      setStore(store)
    }

    getPlatform()
    console.info('IANA ZONE: ', DateTime.local().zoneName)
  }, [])

  if (!store || !platform) {
    return <></>
  }

  return (
    <React.Fragment>
      <Helmet>
        <link
          rel="stylesheet"
          type="text/css"
          href="https://use.fontawesome.com/releases/v5.2.0/css/all.css"
        />
      </Helmet>
      <ThemeProvider>
        <InteropProvider value={intentsProvider}>
          <ReduxProvider store={store}>
            <PlatformProvider value={platform}>
              <React.Fragment>
                <GlobalScrollbarStyle />
                <Router />
              </React.Fragment>
            </PlatformProvider>
          </ReduxProvider>
        </InteropProvider>
      </ThemeProvider>
    </React.Fragment>
  )
}

export default MainRoute
