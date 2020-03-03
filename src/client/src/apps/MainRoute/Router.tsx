import React, { FC } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { RouteWrapper } from 'rt-components'
import { AnalyticsRoute, BlotterRoute, SpotRoute, ShellRoute, TileRoute } from './routes'

export const Router: FC = () => (
  <Switch>
    <Redirect exact from="/" to="/ALL/Analytics" />
    <Route
      path="/analytics"
      render={() => (
        <RouteWrapper windowType="sub" title="Analytics">
          <AnalyticsRoute />
        </RouteWrapper>
      )}
    />
    <Route
      path="/blotter"
      render={routeProps => (
        <RouteWrapper windowType="sub" title="Blotter">
          <BlotterRoute {...routeProps} />
        </RouteWrapper>
      )}
    />
    <Route
      path="/tiles/:currency/:tileView"
      render={() => (
        <RouteWrapper title="Tiles">
          <TileRoute />
        </RouteWrapper>
      )}
    />
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
