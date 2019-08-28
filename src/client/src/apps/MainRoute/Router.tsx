import React, { FC } from 'react'
import { Route, Switch, RouteComponentProps } from 'react-router-dom'
import { AnalyticsRoute, BlotterRoute, SpotRoute, ShellRoute, TileRoute } from './routes'
import { RouteWrapper } from 'rt-components'

export interface RouterProps {
  windowType?: 'main' | 'sub'
}

const route = (
  Component: FC | FC<RouteComponentProps<{ symbol: string }>>,
  { windowType }: RouterProps,
) => ({ ...rest }: RouteComponentProps<{ symbol: string }>) => (
  <RouteWrapper windowType={windowType}>
    <Component {...rest} />
  </RouteWrapper>
)

export const Router: FC = () => (
  <Switch>
    <Route exact path="/" render={route(ShellRoute, { windowType: 'main' })} />
    <Route path="/analytics" render={route(AnalyticsRoute, { windowType: 'sub' })} />
    <Route path="/blotter" render={route(BlotterRoute, { windowType: 'sub' })} />
    <Route path="/tiles" component={TileRoute} />
    <Route path="/spot/:symbol" render={route(SpotRoute, { windowType: 'sub' })} />
  </Switch>
)
