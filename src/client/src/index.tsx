import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { LocalStorageThemeProvider } from 'rt-theme'

import 'rt-theme'

import { MainRoute, NotificationRoute, StyleguideRoute } from './routes'

ReactDOM.render(
  <LocalStorageThemeProvider>
    <BrowserRouter>
      <Switch>
        <Route path="/styleguide" component={StyleguideRoute} />
        <Route path="/notification" component={NotificationRoute} />
        <Route component={MainRoute} />
      </Switch>
    </BrowserRouter>
  </LocalStorageThemeProvider>,
  document.getElementById('root'),
)
