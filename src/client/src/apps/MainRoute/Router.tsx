import React, { FC } from 'react'
import { Route, Switch } from 'react-router-dom'
import { AnalyticsRoute, BlotterRoute, SpotRoute, ShellRoute, TileRoute } from './routes'
import { RouteWrapper } from 'rt-components'

const ShellSwitchRoute: FC = () => {
  return (
    <RouteWrapper extendedControls={true}>
      <ShellRoute />
    </RouteWrapper>
  )
}

export const Router: FC = () => (
  <Switch>
    <Route exact path="/" component={ShellSwitchRoute} />
    <Route path="/analytics" component={AnalyticsRoute} />
    <Route path="/blotter" component={BlotterRoute} />
    <Route path="/tiles" component={TileRoute} />
    <Route path="/spot/:symbol" component={SpotRoute} />
  </Switch>
)
