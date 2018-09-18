import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

// Side-effecting import for rt-theme/globals
import 'rt-theme'

import { MainRoute, NotificationRoute, StyleguideRoute } from './routes'

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route path="/styleguide" component={StyleguideRoute} />
      <Route path="/notification" component={NotificationRoute} />
      <Route component={MainRoute} />
    </Switch>
  </BrowserRouter>,
  document.getElementById('root'),
)
