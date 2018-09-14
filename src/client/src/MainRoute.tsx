import React from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import { timer } from 'rxjs'

import { ConnectionActions } from 'rt-actions'
import { Environment } from 'rt-components'
import { AutobahnConnectionProxy } from 'rt-system'
import { ThemeName, ThemeState } from 'rt-theme'

import { createApplicationServices } from './applicationServices'
import { getEnvVars } from './config/config'
import configureStore from './configureStore'
import { Router } from './shell'
import FakeUserRepository from './shell/fakeUserRepository'
import { OpenFin } from './shell/openFin'

declare const window: any

const APPLICATION_DISCONNECT = 15 * 60 * 1000

const config = getEnvVars(process.env.REACT_APP_ENV!)
const LOG_NAME = 'Application Service: '

export default class MainRoute extends React.Component {
  openfin = new OpenFin()

  environment = {
    isDesktop: this.openfin.isPresent,
    openfin: this.openfin.isPresent ? this.openfin : null
  }

  store = configureStore(
    createApplicationServices({
      autobahn: new AutobahnConnectionProxy(
        (config.overwriteServerEndpoint ? config.serverEndpointUrl : location.hostname)!,
        'com.weareadaptive.reactivetrader',
        +(config.overwriteServerEndpoint ? config.serverPort : location.port)!
      ),
      openfin: this.openfin,
      user: FakeUserRepository.currentUser
    })
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
        <ReduxProvider store={this.store}>
          <Environment.Provider value={this.environment}>
            <LocalStorageThemeProvider>
              <Router />
            </LocalStorageThemeProvider>
          </Environment.Provider>
        </ReduxProvider>
      </React.Fragment>
    )
  }
}

interface State {
  themeName: ThemeName
}

const THEME_STORAGE_KEY = 'themeName'

class LocalStorageThemeProvider extends React.Component<{}, State> {
  state = {
    themeName: ThemeName.LIGHT
  }

  componentDidMount = () => {
    this.setThemeNameFromStorage()
    window.addEventListener('storage', this.setThemeNameFromStorage)
  }

  componentWillUnmount = () => {
    window.removeEventListener('storage', this.setThemeNameFromStorage)
  }

  getThemeNameFromStorage = () => localStorage.getItem(THEME_STORAGE_KEY)

  setThemeNameFromStorage = () => {
    const themeName = this.getThemeNameFromStorage()
    if (themeName === ThemeName.LIGHT || themeName === ThemeName.DARK) {
      this.setState({ themeName })
    }
  }

  updateLocalStorageThemeName = (name: string) => {
    localStorage.setItem(THEME_STORAGE_KEY, name)
    this.setThemeNameFromStorage()
  }

  render() {
    return (
      <ThemeState.Provider name={this.state.themeName} onChange={this.updateLocalStorageThemeName}>
        {this.props.children}
      </ThemeState.Provider>
    )
  }
}
