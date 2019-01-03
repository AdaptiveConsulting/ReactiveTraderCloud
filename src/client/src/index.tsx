import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { MainRoute, NotificationRoute, OrderTicketRoute, SimpleLauncher, StyleguideRoute } from './routes'
import { GlobalStyle } from 'rt-theme'

ReactDOM.render(
  <React.Fragment>
    <GlobalStyle />
    <BrowserRouter>
      <Switch>
        <Route path="/launcher" component={SimpleLauncher} />
        <Route path="/styleguide" component={StyleguideRoute} />
        <Route path="/order-ticket" component={OrderTicketRoute} />
        <Route path="/notification" component={NotificationRoute} />
        <Route component={MainRoute} />
      </Switch>
    </BrowserRouter>
  </React.Fragment>,
  document.getElementById('root'),
)
