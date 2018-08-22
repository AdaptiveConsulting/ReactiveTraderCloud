import React, { SFC } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { AnalyticsContainer } from 'ui/analytics'
import ConnectedBlotterContainer from 'ui/blotter/BlotterContainer'

import { OpenFinContext } from 'rt-components'
import OpenFinRoute from './routes/OpenFin'
import ShellRoute from './routes/Shell'
import SpotRoute from './routes/Spot'

export const Router: SFC = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={ShellSwitchRoute} />
      <Route path="/analytics" component={AnalyticsContainer} />
      <Route path="/blotter" component={ConnectedBlotterContainer} />
      <Route path="/spot/:symbol" component={SpotRoute} />
    </Switch>
  </BrowserRouter>
)

const ShellSwitchRoute = props => (
  <OpenFinContext.Consumer>
    {openFin => (openFin ? <OpenFinRoute {...props} /> : <ShellRoute {...props} />)}
  </OpenFinContext.Consumer>
)
