import React, { SFC } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import { Environment } from 'rt-components'
import { AnalyticsRoute, BlotterRoute, OpenFinRoute, ShellRoute, SpotRoute } from './routes'

export const Router: SFC = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={ShellSwitchRoute} />
      <Route path="/analytics" component={AnalyticsRoute} />
      <Route path="/blotter" component={BlotterRoute} />
      <Route path="/spot/:symbol" component={SpotRoute} />
    </Switch>
  </BrowserRouter>
)

const ShellSwitchRoute = ({ header }: { header: React.ReactChild }) => (
  <Environment.Consumer>
    {({ openfin }) => (openfin ? <OpenFinRoute /> : <ShellRoute header={header} />)}
  </Environment.Consumer>
)
