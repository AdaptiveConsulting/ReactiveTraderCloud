import React, { Suspense, lazy } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { GlobalStyle } from 'rt-theme'
import { openFinNotifications } from 'rt-components'

const MainRoute = lazy(() => import('./routes/MainRoute'))
const NotificationRoute = lazy(() => import('./routes/NotificationRoute'))
const StyleguideRoute = lazy(() => import('./routes/StyleguideRoute'))
const OrderTicketRoute = lazy(() => import('./routes/OrderTicketRoute'))
const SimpleLauncher = lazy(() => import('./routes/SimpleLauncher'))

declare const window: any

if (typeof fin !== 'undefined') {
  // openfin requires a global onNotificationMessage function to be defined before its notification structure is initialized in the platform adapter.
  // NotificationRoute is imported lazily, thus we cannot define the function in that file. (Testing has shown it's already too late.)
  // - D.S.
  window.onNotificationMessage = (message: any) => openFinNotifications.push(message)
}

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
