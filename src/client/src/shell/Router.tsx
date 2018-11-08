import React, { SFC } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import { PlatformAdapter, withPlatform } from 'rt-components'
import { AnalyticsRoute, BlotterRoute, OpenFinRoute, ShellRoute, SpotRoute } from './routes'

const ShellSwitchRoute = ({ header, platform }: { header: React.ReactChild; platform: PlatformAdapter }) =>
  platform.type === 'openfin' ? <OpenFinRoute /> : <ShellRoute header={header} />

const ShellSwitchRouteWithPlatform = withPlatform(ShellSwitchRoute)

export const Router: SFC = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={ShellSwitchRouteWithPlatform} />
      <Route path="/analytics" component={AnalyticsRoute} />
      <Route path="/blotter" component={BlotterRoute} />
      <Route path="/spot/:symbol" component={SpotRoute} />
    </Switch>
  </BrowserRouter>
)
