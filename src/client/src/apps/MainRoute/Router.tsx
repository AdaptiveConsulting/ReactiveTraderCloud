import React, { FC } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { RouteWrapper } from 'rt-components'
import { AnalyticsRoute, BlotterRoute, SpotRoute, ShellRoute, TileRoute } from './routes'
import { urlCurrencyPairExtractor } from '../utils'

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
      path="/tiles"
      render={() => (
        <RouteWrapper title="Tiles">
          <TileRoute />
        </RouteWrapper>
      )}
    />
    <Route
      path="/spot/:symbol"
      render={routeProps => {
        const {
          location: { pathname },
        } = routeProps
        const ccyPair = urlCurrencyPairExtractor(pathname)

        return (
          <RouteWrapper windowType="sub" title={ccyPair}>
            <SpotRoute {...routeProps} />
          </RouteWrapper>
        )
      }}
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
