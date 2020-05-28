import React, { FC } from 'react'
import { Route, Switch } from 'react-router-dom'
import { RouteWrapper } from 'rt-components'
import { currencyFormatter } from 'rt-util'
import { AnalyticsRoute, BlotterRoute, SpotRoute, ShellRoute, TileRoute } from './routes'

export const Router: FC = () => (
  <Switch>
    <Route
      path="/analytics"
      render={() => (
        <RouteWrapper windowType="sub" title="analytics">
          <AnalyticsRoute />
        </RouteWrapper>
      )}
    />
    <Route
      path="/blotter"
      render={routeProps => (
        <RouteWrapper windowType="sub" title="trades">
          <BlotterRoute {...routeProps} />
        </RouteWrapper>
      )}
    />
    <Route
      path="/tiles"
      render={() => (
        <RouteWrapper windowType="sub" title="live rates">
          <TileRoute />
        </RouteWrapper>
      )}
    />
    <Route
      path="/spot/:symbol"
      render={routeProps => (
        <RouteWrapper windowType="sub" title={currencyFormatter(routeProps.match.params.symbol)}>
          <SpotRoute {...routeProps} />
        </RouteWrapper>
      )}
    />
    <Route
      exact
      path="/"
      render={() => (
        <RouteWrapper>
          <ShellRoute />
        </RouteWrapper>
      )}
    />
  </Switch>
)
