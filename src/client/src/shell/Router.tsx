import React, { FC } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { AnalyticsRoute, BlotterRoute, SpotRoute, OpenFinRoute, ShellRoute } from './routes'
import { usePlatform } from 'rt-components'

const ShellSwitchRoute: FC = () => {
  const platform = usePlatform()
  return platform.name === 'openfin' ? <OpenFinRoute /> : <ShellRoute />
}

export const Router: FC = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={ShellSwitchRoute} />
      <Route path="/analytics" component={AnalyticsRoute} />
      <Route path="/blotter" component={BlotterRoute} />
      <Route path="/spot/:symbol" component={SpotRoute} />
    </Switch>
  </BrowserRouter>
)
