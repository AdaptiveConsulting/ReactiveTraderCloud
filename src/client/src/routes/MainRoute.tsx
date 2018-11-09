import React from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import { timer } from 'rxjs'

import { ConnectionActions } from 'rt-actions'
import { Platform, PlatformProvider } from 'rt-components'
import { AutobahnConnectionProxy } from 'rt-system'
import { ThemeName, ThemeStorage } from 'rt-theme'

import { createApplicationServices } from '../applicationServices'
import { getEnvVars } from '../config/config'
import configureStore from '../configureStore'
import { Router } from '../shell'
import FakeUserRepository from '../shell/fakeUserRepository'
import { GlobalScrollbarStyle } from '../shell/GlobalScrollbarStyle'
import { OpenFinLimitChecker } from '../shell/openFin'

declare const window: any

const APPLICATION_DISCONNECT = 15 * 60 * 1000

const config = getEnvVars(process.env.REACT_APP_ENV!)
const LOG_NAME = 'Application Service: '

export class MainRoute extends React.Component {
  openfin = new OpenFinLimitChecker()

  store = configureStore(
    createApplicationServices({
      autobahn: new AutobahnConnectionProxy(
        (config.overwriteServerEndpoint ? config.serverEndpointUrl : location.hostname)!,
        'com.weareadaptive.reactivetrader',
        +(config.overwriteServerEndpoint ? config.serverPort : location.port)!,
      ),
      limitChecker: this.openfin,
      platform: Platform,
      user: FakeUserRepository.currentUser,
    }),
  )

  componentDidMount() {
    if (process.env.NODE_ENV !== 'production') {
      window.store = this.store
    }

    this.store.dispatch(ConnectionActions.connect())

    timer(APPLICATION_DISCONNECT).subscribe(() => {
      this.store.dispatch(ConnectionActions.disconnect())
      console.warn(LOG_NAME, `Application has reached disconnection time at ${APPLICATION_DISCONNECT}`)
    })
  }

  render() {
    return (
      <ThemeStorage.Provider default={ThemeName.Dark}>
        <ReduxProvider store={this.store}>
          <PlatformProvider value={Platform}>
            <React.Fragment>
              <GlobalScrollbarStyle />
              <Router />
            </React.Fragment>
          </PlatformProvider>
        </ReduxProvider>
      </ThemeStorage.Provider>
    )
  }
}

export default MainRoute
