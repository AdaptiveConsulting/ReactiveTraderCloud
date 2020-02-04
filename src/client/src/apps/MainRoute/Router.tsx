import React, { FC } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { AnalyticsRoute, BlotterRoute, SpotRoute, ShellRoute, TileRoute } from './routes'
import { RouteWrapper } from 'rt-components'

export const Router: FC = () => (
  <Switch>
    <Redirect exact from="/" to="/ALL/Analytics" />
    <Route
      path="/analytics"
      render={() => (
        <RouteWrapper windowType="sub">
          <AnalyticsRoute />
        </RouteWrapper>
      )}
    />
    <Route
      path="/blotter"
      render={routeProps => (
        <RouteWrapper windowType="sub">
          <BlotterRoute {...routeProps} />
        </RouteWrapper>
      )}
    />
    <Route path="/tiles" component={TileRoute} />
    <Route
      path="/spot/:symbol"
      render={routeProps => (
        <RouteWrapper windowType="sub">
          <SpotRoute {...routeProps} />
        </RouteWrapper>
      )}
    />
    <Route
      exact
      path="/:currency/:tileView"
      render={() => (
        <RouteWrapper>
          <ShellRoute />
        </RouteWrapper>
      )}
    />
  </Switch>
)
