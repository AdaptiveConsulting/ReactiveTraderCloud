import React, { Suspense, lazy } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { GlobalStyle } from 'rt-theme'
import * as serviceWorker from './serviceWorker'
import { initiateSymphony } from 'rt-symphony'
import { waitForObject } from 'rt-util'

const MainRoute = lazy(() => import('./routes/MainRoute'))
const StyleguideRoute = lazy(() => import('./routes/StyleguideRoute'))
const OrderTicketRoute = lazy(() => import('./routes/OrderTicketRoute'))
const SimpleLauncher = lazy(() => import('./routes/SimpleLauncher'))

const urlParams = new URLSearchParams(window.location.search)

async function init() {
  if (urlParams.has('startAsSymphonyController')) {
    await initiateSymphony(urlParams.get('env'))
  } else {
    if (urlParams.has('waitFor')) {
      await waitForObject(urlParams.get('waitFor'))
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
              <Route render={() => <MainRoute />} />
            </Switch>
          </Suspense>
        </BrowserRouter>
      </React.Fragment>,
      document.getElementById('root'),
    )

    // If you want your app to work offline and load faster, you can change
    // unregister() to register() below. Note this comes with some pitfalls.
    // Learn more about service workers: https://bit.ly/CRA-PWA
    serviceWorker.register()
  }
}

init()
