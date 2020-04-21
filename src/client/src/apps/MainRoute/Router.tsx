import React, { FC, useContext } from 'react'
import { Route, Switch } from 'react-router-dom'
import { RouteWrapper } from 'rt-components'
import { currencyFormatter } from 'rt-util'
import { AnalyticsRoute, BlotterRoute, SpotRoute, ShellRoute, TileRoute } from './routes'
import { GlueProvider, GlueContext } from "@glue42/react-hooks";

const CoreApp = (props: any) => {
  const glue = useContext(GlueContext);
  console.log(glue, props)
  return (
    <div>
      hi this is clue 42 core
      <button onClick={() => glue.windows.open('Test', 'http://localhost:3000/analytics')}>open</button>
    </div>
  )
}

const Core = () => {
  return (
    <GlueProvider fallback={<h2>Loading G42 Core...</h2>}>
      <CoreApp />
    </GlueProvider>
  )
}


export const Router: FC = () => (
  <Switch>
    <Route
      path="/core"
      render={() => <Core />}
    />
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
        <RouteWrapper windowType="sub" title="live - rates">
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
