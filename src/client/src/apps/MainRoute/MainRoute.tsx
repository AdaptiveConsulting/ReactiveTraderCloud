import React, { useEffect, useState } from 'react'
import Helmet from 'react-helmet'
import { Provider as ReduxProvider } from 'react-redux'
import { DateTime } from 'luxon'
import { ThemeProvider } from 'rt-theme'
import { Router } from './data'
import GlobalScrollbarStyle from './GlobalScrollbarStyle'
import { getPlatformAsync, PlatformProvider } from 'rt-platforms'
import { createStore } from './store'

const MainRoute = () => {
  const [platform, setPlatform] = useState()
  const [store, setStore] = useState()

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
        <ReduxProvider store={store}>
          <PlatformProvider value={platform}>
            <React.Fragment>
              <GlobalScrollbarStyle />
              <Router />
            </React.Fragment>
          </PlatformProvider>
        </ReduxProvider>
      </ThemeProvider>
    </React.Fragment>
  )
}

export default MainRoute
