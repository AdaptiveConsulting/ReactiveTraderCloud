import React, { FC } from 'react'
import { Route, Switch } from 'react-router-dom'
import { AnalyticsRoute, BlotterRoute, SpotRoute, ShellRoute, TileRoute } from './routes'
import { RouteWrapper } from 'rt-components'

export const Router: FC = () => (
  <Switch>
    <Route
      exact
      path="/"
      render={() => (
        <RouteWrapper>
          <ShellRoute/>
        </RouteWrapper>
      )}
    />
    <Route
      path="/analytics"
      render={() => (
        <RouteWrapper windowType="sub">
          <AnalyticsRoute/>
        </RouteWrapper>
      )}
    />
    <Route
      path="/blotter"
      render={routeProps => (
        <RouteWrapper windowType="sub">
          <BlotterRoute {...routeProps}/>
        </RouteWrapper>
      )}
    />
    <Route path="/tiles" component={TileRoute}/>
    <Route
      path="/spot/:symbol"
      render={routeProps => (
        <RouteWrapper windowType="sub">
          <SpotRoute {...routeProps} />
        </RouteWrapper>
      )}
    />
  </Switch>
)
