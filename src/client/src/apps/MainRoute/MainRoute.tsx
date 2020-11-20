import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import ReactGA from 'react-ga'
import Helmet from 'react-helmet'
import { Provider as ReduxProvider } from 'react-redux'
import { DateTime } from 'luxon'
import { getPlatformAsync, PlatformProvider } from 'rt-platforms'
import { ThemeProvider } from 'rt-theme'
import { Provider as InteropProvider, getProvider } from 'rt-interop'
import { Router } from './data'
import GlobalScrollbarStyle from './GlobalScrollbarStyle'
import { createStore } from './store'
import { AsyncReturnType } from 'rt-util/utilityTypes'
import { getAppName } from 'rt-util'

const MainRoute = () => {
  type Platform = AsyncReturnType<typeof getPlatformAsync>
  type Store = AsyncReturnType<typeof createStore>

  const routeHistory = useHistory()
  const [platform, setPlatform] = useState<Platform>()
  const [store, setStore] = useState<Store>()
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

  useEffect(() => {
    if (platform) {
      ReactGA.set({
        dimension1: platform.type,
        dimension2: platform.name,
        page: window.location.pathname,
      })
      ReactGA.pageview(window.location.pathname)
    }
  }, [platform])

  useEffect(() => {
    const stopListening = routeHistory.listen(location => {
      ReactGA.set({ page: location.pathname })
      ReactGA.pageview(location.pathname)
    })
    return stopListening
  }, [routeHistory])

  if (!store || !platform) {
    return <></>
  }

  return (
    <React.Fragment>
      <Helmet title={getAppName('Reactive Trader®')}>
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
