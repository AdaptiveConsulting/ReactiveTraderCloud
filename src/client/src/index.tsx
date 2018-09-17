import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { LocalStorageThemeProvider } from 'rt-theme'

import 'rt-theme'

import MainRoute from './MainRoute'
import NotificationRoute from './NotificationRoute'

ReactDOM.render(
  <LocalStorageThemeProvider>
    <BrowserRouter>
      <Switch>
        <Route path="/notification" component={NotificationRoute} />
        <Route component={MainRoute} />
      </Switch>
    </BrowserRouter>
  </LocalStorageThemeProvider>,
  document.getElementById('root')
)
