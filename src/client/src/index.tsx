import React, { Suspense, lazy } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { GlobalStyle } from 'rt-theme'

const MainRoute = lazy(() => import('./routes/MainRoute'))
const NotificationRoute = lazy(() => import('./routes/NotificationRoute'))
const StyleguideRoute = lazy(() => import('./routes/StyleguideRoute'))
const OrderTicketRoute = lazy(() => import('./routes/OrderTicketRoute'))
const SimpleLauncher = lazy(() => import('./routes/SimpleLauncher'))

ReactDOM.render(
  <React.Fragment>
    <GlobalStyle />
    <BrowserRouter>
      <Suspense fallback={<div />}>
        <Switch>
          <Route path="/launcher" render={() => <SimpleLauncher />} />
          <Route path="/styleguide" render={() => <StyleguideRoute />} />
          <Route path="/order-ticket" render={() => <OrderTicketRoute />} />
          <Route path="/notification" render={() => <NotificationRoute />} />
          <Route render={() => <MainRoute />} />
        </Switch>
      </Suspense>
    </BrowserRouter>
  </React.Fragment>,
  document.getElementById('root'),
)
