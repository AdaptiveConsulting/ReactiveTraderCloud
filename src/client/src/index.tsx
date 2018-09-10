import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import 'rt-theme'

import { MainRoute, NotificationRoute } from './routes'

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route path="/notification" component={NotificationRoute} />
      <Route component={MainRoute} />
    </Switch>
  </BrowserRouter>,
  document.getElementById('root')
)
