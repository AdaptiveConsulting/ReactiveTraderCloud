import React, { FC } from 'react'
import { Route, Switch } from 'react-router-dom'
import { AnalyticsRoute, BlotterRoute, SpotRoute, ShellRoute, TileRoute } from './routes'
import { RouteWrapper } from 'rt-components'
import WindowFrame from './components/windowFrame'

export const Router: FC = () => (
  <Switch>
    <Route
      exact
      path="/"
      render={() => (
        <RouteWrapper>
          <ShellRoute />
        </RouteWrapper>
      )}
    />
    <Route
      path="/analytics"
      render={() => (
        <RouteWrapper title="Analytics" windowType="sub">
          <AnalyticsRoute />
        </RouteWrapper>
      )}
    />

    <Route
      path="/blotter"
      render={routeProps => (
        <RouteWrapper title="Blotter" windowType="sub">
          <BlotterRoute {...routeProps} />
        </RouteWrapper>
      )}
    />
    <Route
      path="/tiles"
      render={routeProps => (
        <RouteWrapper title="Pricing" windowType="sub">
          <TileRoute />
        </RouteWrapper>
      )}
    />
    <Route
      path="/spot/:symbol"
      render={routeProps => {
        return (
          <RouteWrapper title={routeProps.match.params['symbol']} windowType="sub">
            <SpotRoute {...routeProps} />
          </RouteWrapper>
        )
      }}
    />

    <Route path="/openfin-window-frame" render={() => <WindowFrame />} />
  </Switch>
)
