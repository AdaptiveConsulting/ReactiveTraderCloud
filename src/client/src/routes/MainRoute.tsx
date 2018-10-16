import React from 'react'
import Helmet from 'react-helmet'
import { Provider as ReduxProvider } from 'react-redux'
import { timer } from 'rxjs'

import { ConnectionActions } from 'rt-actions'
import { createEnvironment, Environment } from 'rt-components'
import { AutobahnConnectionProxy } from 'rt-system'
import { ThemeName, ThemeStorage } from 'rt-theme'

import { createApplicationServices } from '../applicationServices'
import { getEnvVars } from '../config/config'
import configureStore from '../configureStore'
import { Router } from '../shell'
import FakeUserRepository from '../shell/fakeUserRepository'
import { GlobalScrollbarStyle } from '../shell/GlobalScrollbarStyle'
import { OpenFin } from '../shell/openFin'

declare const window: any

const APPLICATION_DISCONNECT = 15 * 60 * 1000

const config = getEnvVars(process.env.REACT_APP_ENV!)
const LOG_NAME = 'Application Service: '

export class MainRoute extends React.Component {
  openfin = new OpenFin()
  environment = createEnvironment(this.openfin.isPresent ? this.openfin : null)

  store = configureStore(
    createApplicationServices({
      autobahn: new AutobahnConnectionProxy(
        (config.overwriteServerEndpoint ? config.serverEndpointUrl : location.hostname)!,
        'com.weareadaptive.reactivetrader',
        +(config.overwriteServerEndpoint ? config.serverPort : location.port)!,
      ),
      openfin: this.openfin,
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
      <React.Fragment>
        <Helmet>
          <link
            rel="stylesheet"
            href="https://use.fontawesome.com/releases/v5.2.0/css/all.css"
            integrity="sha384-hWVjflwFxL6sNzntih27bfxkr27PmbbK/iSvJ+a4+0owXq79v+lsFkW54bOGbiDQ"
          />
        </Helmet>
        <ThemeStorage.Provider default={ThemeName.Dark}>
          <ReduxProvider store={this.store}>
            <Environment.Provider value={this.environment}>
              <React.Fragment>
                <GlobalScrollbarStyle />
                <Router />
              </React.Fragment>
            </Environment.Provider>
          </ReduxProvider>
        </ThemeStorage.Provider>
      </React.Fragment>
    )
  }
}

export default MainRoute
