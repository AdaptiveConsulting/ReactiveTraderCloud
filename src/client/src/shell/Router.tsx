import React, { SFC } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { AnalyticsContainer } from '.././ui/analytics'
import { BlotterContainer } from '../ui/blotter'

import { Environment } from 'rt-components'
import OpenFinRoute from './routes/OpenFinRoute'
import ShellRoute from './routes/ShellRoute'
import SpotRoute from './routes/SpotRoute'

export const Router: SFC = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={ShellSwitchRoute} />
      <Route path="/analytics" component={AnalyticsContainer} />
      <Route path="/blotter" component={BlotterContainer} />
      <Route path="/spot/:symbol" component={SpotRoute} />
    </Switch>
  </BrowserRouter>
)

const ShellSwitchRoute = ({ header }: { header: React.ReactChild }) => (
  <Environment.Consumer>
    {({ openfin }) => (openfin ? <OpenFinRoute /> : <ShellRoute header={header} />)}
  </Environment.Consumer>
)
