import React, { FC } from 'react'
import { Route, Switch } from 'react-router-dom'
import { RouteWrapper } from 'rt-components'
import { OpenFinWindowFrame, OpenFinSubWindowFrame } from 'rt-platforms/openfin/components'
import { StatusDisplayContainer } from 'rt-platforms/openfin/components/OpenFinStatusConnection/StatusContainers'
import { currencyFormatter } from 'rt-util'
import { AnalyticsRoute, BlotterRoute, SpotRoute, ShellRoute, TileRoute } from './routes'
import { OpenFinContactDisplay } from 'rt-platforms/openfin/components/OpenFinContactButton'
import { OpenFinSnapshotList } from 'rt-platforms/openfin/components/OpenFinSnapshot'

export const Router: FC = () => {
  return (
    <Switch>
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
          <RouteWrapper windowType="sub" title="Trades">
            <BlotterRoute {...routeProps} />
          </RouteWrapper>
        )}
      />

      <Route
        path="/tiles"
        render={() => (
          <RouteWrapper windowType="sub" title="Live Rates">
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

      <Route path="/openfin-window-frame" render={() => <OpenFinWindowFrame />} />
      <Route path="/openfin-sub-window-frame" render={() => <OpenFinSubWindowFrame />} />
      <Route path="/status" render={() => <StatusDisplayContainer />} />
      <Route path="/contact" render={() => <OpenFinContactDisplay />} />
      <Route path="/snapshots" render={() => <OpenFinSnapshotList />} />
    </Switch>
  )
}
